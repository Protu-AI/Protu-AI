import { Message } from "../../types";
import { cn } from "@/lib/utils";
import { Sparkles, Paperclip, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === "assistant";
  const hasAttachment = message.attachment && message.attachment.name;

  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {isBot && (
        <div className="mr-[12px] shrink-0 self-start mt-1">
          <div className="h-10 w-10 rounded-full border border-[#A6B5BB] dark:border-[#BFA7F3] flex items-center justify-center bg-transparent p-[9px]">
            <Sparkles className="h-full w-full text-[#5F24E0] dark:text-[#EFE9FC]" />
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "relative max-w-[600px] font-['Archivo'] text-[18px] md:text-[20px] font-normal text-[#1C0B43] dark:text-[#EFE9FC] leading-relaxed",
          isBot
            ? "bg-transparent"
            : "bg-white dark:bg-[#BFA7F3]/80 rounded-2xl p-[12px]"
        )}
      >
        {isBot && (
          <div className="absolute left-[-10px] top-3 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white dark:border-r-[#BFA7F3]/80"></div>
        )}

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => (
              <p className="mb-3 leading-relaxed">{children}</p>
            ),
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold mb-3 mt-4">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold mb-3 mt-4">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-medium mb-2 mt-3">{children}</h3>
            ),
            li: ({ children }) => (
              <li className="ml-4 pl-2 mb-2 list-decimal">{children}</li>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside pl-5 mb-3">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside pl-5 mb-3">{children}</ol>
            ),
            a: ({ href, children }) => (
              <a
                href={href ?? "#"}
                className="text-blue-600 underline hover:opacity-80"
              >
                {children}
              </a>
            ),
            code: ({ inline, children }) => {
              const [copied, setCopied] = useState(false);
              const codeString = String(children).replace(/\n$/, "");

              const handleCopy = () => {
                navigator.clipboard.writeText(codeString);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              };

              if (inline) {
                return (
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono">
                    {children}
                  </code>
                );
              }

              return (
                <div className="relative group my-4">
                  <SyntaxHighlighter
                    language="javascript"
                    style={isDarkMode ? oneDark : oneLight}
                    customStyle={{
                      borderRadius: "0.5rem",
                      padding: "1rem",
                      fontSize: "0.9rem",
                      margin: 0,
                    }}
                    wrapLongLines={true}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 bg-white dark:bg-[#2d2d3a] border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1"
                  >
                    {copied ? "Copied!" : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              );
            },
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gray-400 pl-4 italic text-gray-600 dark:text-gray-300 mb-4">
                {children}
              </blockquote>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>

        {hasAttachment && (
          <div className="flex items-center mt-2">
            <Paperclip className="h-4 w-4 text-[#5F24E0] dark:text-[#EFE9FC] mr-2" />
            <span className="text-sm text-[#5F24E0] dark:text-[#EFE9FC]">
              {message.attachment?.name}
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
