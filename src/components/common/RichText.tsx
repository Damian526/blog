// components/RichText.tsx
'use client';

import parse, { Element, Text } from 'html-react-parser';
import Image from 'next/image';

interface RichTextProps {
  html: string;
  className?: string;
}

export default function RichText({ html, className }: RichTextProps) {
  return (
    <div className={className}>
      {parse(html, {
        replace: (node) => {
          // 1) Handle images
          if (
            node instanceof Element &&
            node.name === 'img' &&
            node.attribs.src
          ) {
            const { src, alt = '', width, height } = node.attribs;
            return (
              <Image
                src={src}
                alt={alt}
                width={width ? +width : 800}
                height={height ? +height : 600}
                sizes="(max-width: 600px) 100vw, 800px"
                style={{ width: '100%', height: 'auto' }}
              />
            );
          }

          // 2) Convert links to Next.js <a> with target blank
          if (
            node instanceof Element &&
            node.name === 'a' &&
            node.attribs.href
          ) {
            return (
              <a
                href={node.attribs.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {node.children.map((child, i) =>
                  child instanceof Text ? child.data : parse(child as any),
                )}
              </a>
            );
          }

          // 3) Let everything else render as normal
        },
      })}
    </div>
  );
}
