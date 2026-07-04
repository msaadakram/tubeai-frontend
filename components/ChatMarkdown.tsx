"use client";

import React, { memo, useMemo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  h1: ({ children }) => (
    <h3 className="text-base font-black mt-3 mb-1.5 first:mt-0 text-neutral-900 leading-tight">{children}</h3>
  ),
  h2: ({ children }) => (
    <h3 className="text-sm font-black mt-3 mb-1.5 first:mt-0 text-neutral-900 leading-tight">{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className="text-[13px] font-black mt-2.5 mb-1 first:mt-0 text-neutral-900 leading-tight">{children}</h4>
  ),
  h4: ({ children }) => (
    <h4 className="text-[13px] font-bold mt-2 mb-1 first:mt-0 text-neutral-800 leading-tight">{children}</h4>
  ),
  p: ({ children }) => <p className="my-1.5 first:mt-0 last:mb-0 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="my-1.5 ml-4 list-disc space-y-1 marker:text-red-600">{children}</ul>,
  ol: ({ children }) => (
    <ol className="my-1.5 ml-4 list-decimal space-y-1 marker:text-red-600 marker:font-bold">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed pl-0.5">{children}</li>,
  strong: ({ children }) => <strong className="font-black text-neutral-900">{children}</strong>,
  em: ({ children }) => <em className="italic text-neutral-700">{children}</em>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-red-600 font-bold underline underline-offset-2 hover:text-red-700"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 pl-3 border-l-[3px] border-red-600 bg-red-50/60 italic text-neutral-700">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-3 border-t-2 border-dashed border-neutral-200" />,
  code: ({ className, children, ...props }) => {
    const isBlock = /language-/.test(className || "");
    if (isBlock) {
      return (
        <code className="block font-mono text-[12px]" {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="px-1 py-0.5 mx-0.5 rounded bg-neutral-100 border border-neutral-300 font-mono text-[12px] text-red-700"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-2 p-3 rounded-lg bg-neutral-900 text-neutral-100 border-2 border-black overflow-x-auto text-[12px] leading-relaxed">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto">
      <table className="w-full text-[12px] border-collapse border-2 border-black">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-neutral-900 text-white">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr className="border-b border-neutral-300 even:bg-neutral-50">{children}</tr>
  ),
  th: ({ children }) => <th className="px-2 py-1.5 text-left font-black border-r border-neutral-700 last:border-r-0">{children}</th>,
  td: ({ children }) => <td className="px-2 py-1.5 border-r border-neutral-300 last:border-r-0 align-top">{children}</td>,
};

type Props = {
  content: string;
};

function ChatMarkdownBase({ content }: Props) {
  const remarkPlugins = useMemo(() => [remarkGfm], []);
  return (
    <div className="text-[13px] text-neutral-800 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

export const ChatMarkdown = memo(ChatMarkdownBase);
