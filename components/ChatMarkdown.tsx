"use client";

import React, { memo, useMemo, useState, useCallback } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/clipboard";

function CodeBlock({ children }: { children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(() => {
    const text = extractText(children);
    copyToClipboard(text).then((ok) => {
      if (ok) {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }
    });
  }, [children]);
  return (
    <div className="relative group my-2.5">
      <button
        type="button"
        onClick={onCopy}
        className="absolute top-1.5 right-1.5 inline-flex items-center gap-1 px-1.5 py-1 rounded-md border border-white/15 bg-white/10 text-[10px] font-bold text-neutral-200 hover:bg-white/20 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Copy code"
      >
        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="p-3 pr-16 rounded-lg bg-neutral-900 text-neutral-100 border-2 border-black overflow-x-auto text-[12px] leading-relaxed">
        <code className="block font-mono">{children}</code>
      </pre>
    </div>
  );
}

function extractText(node: React.ReactNode): string {
  if (node == null || node === false || node === true) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in (node as any)) {
    return extractText((node as any).props?.children);
  }
  return "";
}

function TaskListItem({
  checked,
  children,
}: {
  checked?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-2 leading-relaxed list-none pl-0">
      <span
        aria-hidden
        className={`mt-0.5 shrink-0 w-4 h-4 rounded border-2 border-black flex items-center justify-center ${
          checked ? "bg-red-600" : "bg-white"
        }`}
      >
        {checked && <Check className="w-3 h-3 text-white" />}
      </span>
      <span
        className={`flex-1 ${checked ? "line-through text-neutral-400" : ""}`}
      >
        {children}
      </span>
    </li>
  );
}

const components: Components = {
  h1: ({ children }) => (
    <h3 className="text-base font-black mt-3 mb-1.5 first:mt-0 text-neutral-900 leading-tight">
      {children}
    </h3>
  ),
  h2: ({ children }) => (
    <h3 className="text-sm font-black mt-3 mb-1.5 first:mt-0 text-neutral-900 leading-tight">
      {children}
    </h3>
  ),
  h3: ({ children }) => (
    <h4 className="text-[13px] font-black mt-2.5 mb-1 first:mt-0 text-neutral-900 leading-tight">
      {children}
    </h4>
  ),
  h4: ({ children }) => (
    <h4 className="text-[13px] font-bold mt-2 mb-1 first:mt-0 text-neutral-800 leading-tight">
      {children}
    </h4>
  ),
  h5: ({ children }) => (
    <h5 className="text-[13px] font-bold mt-2 mb-1 first:mt-0 text-neutral-800">
      {children}
    </h5>
  ),
  h6: ({ children }) => (
    <h6 className="text-[12px] font-bold uppercase tracking-wide mt-2 mb-1 first:mt-0 text-neutral-600">
      {children}
    </h6>
  ),
  p: ({ children }) => (
    <p className="my-1.5 first:mt-0 last:mb-0 leading-relaxed">{children}</p>
  ),
  ul: ({ children, className }) => {
    const isTask = /contains:task-list/.test(className || "");
    return (
      <ul
        className={`my-1.5 ml-4 space-y-1 ${
          isTask ? "list-none" : "list-disc marker:text-red-600"
        }`}
      >
        {children}
      </ul>
    );
  },
  ol: ({ children }) => (
    <ol className="my-1.5 ml-4 list-decimal space-y-1 marker:text-red-600 marker:font-bold">
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => {
    const checked = (props as { checked?: boolean | null }).checked;
    if (checked !== undefined && checked !== null) {
      return (
        <TaskListItem checked={!!checked}>{children}</TaskListItem>
      );
    }
    return <li className="leading-relaxed pl-0.5">{children}</li>;
  },
  strong: ({ children }) => (
    <strong className="font-black text-neutral-900">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-neutral-700">{children}</em>
  ),
  del: ({ children }) => (
    <del className="line-through text-neutral-500">{children}</del>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-red-600 font-bold underline underline-offset-2 hover:text-red-700 break-words"
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
  code: ({ className, children }) => {
    const isBlock = /language-/.test(className || "");
    if (isBlock) {
      return <CodeBlock>{children}</CodeBlock>;
    }
    return (
      <code className="px-1 py-0.5 mx-0.5 rounded bg-neutral-100 border border-neutral-300 font-mono text-[12px] text-red-700">
        {children}
      </code>
    );
  },
  pre: ({ children }) => <>{children}</>,
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto rounded-lg border-2 border-black">
      <table className="w-full text-[12px] border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-black text-white">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr className="border-b border-neutral-300 even:bg-neutral-50 last:border-0">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-2 py-1.5 text-left font-black border-r border-neutral-700 last:border-r-0">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-2 py-1.5 border-r border-neutral-300 last:border-r-0 align-top">
      {children}
    </td>
  ),
  input: ({ checked, ...props }) => {
    // Used inside task list items — render nothing here, TaskListItem renders the box.
    void props;
    return checked !== undefined ? null : <input defaultChecked={!!checked} />;
  },
  kbd: ({ children }) => (
    <kbd className="px-1.5 py-0.5 rounded border border-neutral-300 bg-neutral-50 font-mono text-[11px] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
      {children}
    </kbd>
  ),
  mark: ({ children }) => (
    <mark className="bg-yellow-200 px-0.5 rounded">{children}</mark>
  ),
  sub: ({ children }) => <sub className="text-[0.7em]">{children}</sub>,
  sup: ({ children }) => <sup className="text-[0.7em]">{children}</sup>,
};

type Props = {
  content: string;
};

function ChatMarkdownBase({ content }: Props) {
  const remarkPlugins = useMemo(() => [remarkGfm], []);
  return (
    <div className="text-[13px] sm:text-[13px] text-neutral-800 break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_li>ul]:my-1 [&_li>ol]:my-1 [&_pre]:max-w-full [&_table]:max-w-full [&_img]:max-w-full [&_img]:h-auto">
      <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

export const ChatMarkdown = memo(ChatMarkdownBase);
