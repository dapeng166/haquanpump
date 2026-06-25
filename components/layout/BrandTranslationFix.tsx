"use client";

import { useEffect } from "react";

/**
 * Google's free Website Translator renders the brand "Haquan" into Chinese as
 * "哈昆" (a phonetic guess). The company's real Chinese name is 哈泉, and the free
 * widget offers no custom glossary — so we correct its output after the fact.
 *
 * We watch the DOM and rewrite 哈昆 → 哈泉 in text nodes ONLY, setting `nodeValue`
 * in place. That never adds or removes nodes, so it cannot trip React's
 * reconciler (unlike Google's own <font>-wrapping, which the layout already
 * guards against). The pass converges: once corrected there is no 哈昆 left to
 * re-trigger it.
 */
const REPLACEMENTS: Array<[RegExp, string]> = [[/哈昆/g, "哈泉"]];

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
