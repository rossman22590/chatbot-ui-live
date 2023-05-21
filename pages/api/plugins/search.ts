import { NextApiRequest, NextApiResponse } from 'next';

import { cleanSourceText } from '@/utils/server/google';

import { GoogleSource } from '@/types/google';

import { Readability } from '@mozilla/readability';
import jsdom, { JSDOM } from 'jsdom';

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  try {
    const body = JSON.parse(req.body);

    const query = body.query;

    const key = process.env.GOOGLE_API_KEY;
    const cse_id = process.env.GOOGLE_CSE_ID;

    const googleRes = await fetch(
      `https://customsearch.googleapis.com/customsearch/v1?key=${key}&cx=${cse_id}&q=${query.trim()}&num=5`,
    );

    const googleData = await googleRes.json();

    const googleSources: GoogleSource[] = googleData.items.map((item: any) => ({
      title: item.title,
      link: item.link,
      displayLink: item.displayLink,
      snippet: item.snippet,
      image: item.pagemap?.cse_image?.[0]?.src,
      text: '',
    }));

    const sourcesWithText: any = await Promise.all(
      googleSources.map(async (source) => {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), 5000),
          );

          const res = (await Promise.race([
            fetch(source.link),
            timeoutPromise,
          ])) as any;

          // if (res) {
          const html = await res.text();

          const virtualConsole = new jsdom.VirtualConsole();
          virtualConsole.on('error', (error) => {
            if (!error.message.includes('Could not parse CSS stylesheet')) {
              console.error(error);
            }
          });

          const dom = new JSDOM(html, { virtualConsole });
          const doc = dom.window.document;
          const parsed = new Readability(doc).parse();

          if (parsed) {
            let sourceText = cleanSourceText(parsed.textContent);

            return {
              ...source,
              // TODO: switch to tokens
              text: sourceText.slice(0, 1000),
            } as GoogleSource;
          }
          // }

          return null;
        } catch (error) {
          console.error(error);
          return null;
        }
      }),
    );

    const filteredSources: GoogleSource[] = sourcesWithText.filter(Boolean);

    const sources: { title: string; link: string; text: string }[] =
      filteredSources.map((source) => {
        return {
          title: source.title,
          link: source.link,
          text: source.text,
        };
      });

    res.status(200).json({ sources });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error' });
  }
};

export default handler;
