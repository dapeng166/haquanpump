"use client";

import { useEffect } from "react";

/**
 * The brand name "Haquan" must stay "Haquan" in every language. Google's free
 * Website Translator has no glossary and phonetically renders it into Chinese
 * several different ways (哈昆 / 海泉 / 哈泉 …), which looks inconsistent in news
 * and article bodies. We correct its output after the fact: rewrite any of those
 * variants back to "Haquan" in text nodes ONLY, setting `nodeValue` in place.
 *
 * Editing text nodes never adds/removes DOM nodes, so it cannot trip React's
 * reconciler (unlike Google's own <font>-wrapping, which the layout guards
 * against). The pass converges: once corrected there is no variant left to
 * re-trigger it. Brand text we control (e.g. the logo) is additionally marked
 * translate="no" so it is never translated in the first place.
 */
const REPLACEMENTS: Array<[RegExp, string]> = [
  [/哈昆|海泉|哈泉|哈奎|哈川|哈全/g, "Haquan"],
];

function correct(value: string | null): string | null {
  if (!value) return value;
  let next = value;
  for (const [re, to] of REPLACEMENTS) next = next.replace(re, to);
  return next;
}

function fixNode(node: Node) {
  const fixed = correct(node.nodeValue);
  if (fixed !== node.nodeValue) node.nodeValue = fixed;
}

export function BrandTranslationFix() {
  useEffect(() => {
    const sweep = (root: Node) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        fixNode(node);
        node = walker.nextNode();
      }
    };

    sweep(document.body);

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "characterData") {
          fixNode(m.target);
        } else {
          m.addedNodes.forEach((n) => {
            if (n.nodeType === Node.TEXT_NODE) fixNode(n);
            else sweep(n);
          });
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
