import { NextApiRequest, NextApiResponse } from 'next';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  try {
    await delay(2000);

    if (req.method === 'GET') {
      const dummyDevices = ['Living Room', 'hat', "Jorge's iPhone"];
      res.status(200).json({ success: JSON.stringify(dummyDevices) });
    } else if (req.method === 'POST') {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error' });
  }
};

export default handler;
