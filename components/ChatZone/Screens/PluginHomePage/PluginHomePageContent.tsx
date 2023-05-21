import { useEffect, useState } from 'react';

import { QuickViewPlugin } from '@/types/plugin';

import { CodeBlock } from '@/components/Markdown/CodeBlock';
import { MemoizedReactMarkdown } from '@/components/Markdown/MemoizedReactMarkdown';

import rehypeMathjax from 'rehype-mathjax';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

export const PluginHomePageContent = ({
  plugin,
}: {
  plugin: QuickViewPlugin;
}) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      const res = await fetch(plugin.homepage);
      const text = await res.text();

      if (res.status == 200) {
        setContent(text);
      } else {
        setContent(`# Error \n ${res.status} loading plugin homepage`);
      }
    };
    fetchContent();
  }, [plugin]);

  return (
    <div
      className={`group md:px-4 'border-b border-black/10 bg-white text-gray-800
       dark:border-gray-900/50 dark:bg-[#343541] dark:text-gray-100'`}
      style={{ overflowWrap: 'anywhere' }}
    >
      <div className="relative m-auto flex p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
        <div className="prose mt-[-2px] w-full dark:prose-invert">
          <div className="flex flex-row">
            <MemoizedReactMarkdown
              className="prose dark:prose-invert flex-1"
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeMathjax, rehypeRaw]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  if (children.length) {
                    if (children[0] == '▍') {
                      return (
                        <span className="animate-pulse cursor-default mt-1">
                          ▍
                        </span>
                      );
                    }

                    children[0] = (children[0] as string).replace('`▍`', '▍');
                  }

                  const match = /language-(\w+)/.exec(className || '');

                  return !inline ? (
                    <CodeBlock
                      key={Math.random()}
                      language={(match && match[1]) || ''}
                      value={String(children).replace(/\n$/, '')}
                      {...props}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                table({ children }) {
                  return (
                    <table className="border-collapse border border-black px-3 py-1 dark:border-white">
                      {children}
                    </table>
                  );
                },
                th({ children }) {
                  return (
                    <th className="break-words border border-black bg-gray-500 px-3 py-1 text-white dark:border-white">
                      {children}
                    </th>
                  );
                },
                td({ children }) {
                  return (
                    <td className="break-words border border-black px-3 py-1 dark:border-white">
                      {children}
                    </td>
                  );
                },
                a({ children, ...props }) {
                  return (
                    <a {...props} target="_blank">
                      {children}
                    </a>
                  );
                },
                img({ src, alt, width, height }) {
                  return (
                    <img
                      src={src}
                      alt={alt}
                      width={width}
                      height={height}
                      className="m-1"
                    />
                  );
                },
              }}
            >
              {content}
            </MemoizedReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

PluginHomePageContent.displayName = 'ChatMessage';
