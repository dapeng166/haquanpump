"use client";

import { useEffect } from "react";

/**
 * Brand name per language:
 *   - Chinese (zh-*)   → the brand reads 哈泉 (the company's Chinese name).
 *   - every other lang → it stays "Haquan".
 *
 * Google's free Website Translator has no glossary: in Chinese it renders the
 * brand inconsistently (海泉 / 哈昆 / 哈奎 / …) and sometimes leaves "Haquan". We
 * normalise its output ourselves by rewriting text nodes in place (setting
 * nodeValue only — never adding/removing nodes, so React's reconciler is
 * untouched, unlike Google's own <font>-wrapping which the layout guards
 * against). The company domain/email (haquanpump.com) is deliberately left
 * alone. The pass converges: once normalised there is nothing left to re-match.
 */

const CN_VARIANTS = /海泉|哈昆|哈奎|哈川|哈全/g; // Google's wrong phonetic guesses
const LATIN_BRAND = /Haquan(?!pump)/gi; // the brand word, but not the domain
const ANY_CN_BRAND = /海泉|哈昆|哈奎|哈川|哈全|哈泉/g;

function targetLang(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
  return m ? decodeURIComponent(m[1]).toLowerCase() : "";
}

function correct(value: string | null, chinese: boolean): string | null {
  if (!value) return value;
  if (chinese) {
    return value.replace(CN_VARIANTS, "哈泉").replace(LATIN_BRAND, "哈泉");
  }
  return value.replace(ANY_CN_BRAND, "Haquan");
}

export function BrandTranslationFix() {
  useEffect(() => {
    let lastLang = targetLang();

    const sweep = (root: Node, chinese: boolean) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        const fixed = correct(node.nodeValue, chinese);
        if (fixed !== node.nodeValue) node.nodeValue = fixed;
        node = walker.nextNode();
      }
    };

    sweep(document.body, lastLang.startsWith("zh"));

    const observer = new MutationObserver((mutations) => {
      const lang = targetLang();
      const chinese = lang.startsWith("zh");

      // Language switched (e.g. the user picked 中文) → re-normalise the whole
      // page, including text Google never touches (the translate="no" wordmark).
      if (lang !== lastLang) {
        lastLang = lang;
        sweep(document.body, chinese);
        return;
      }

      for (const m of mutations) {
        if (m.type === "characterData") {
          const fixed = correct(m.target.nodeValue, chinese);
          if (fixed !== m.target.nodeValue) m.target.nodeValue = fixed;
        } else {
          m.addedNodes.forEach((n) => {
            if (n.nodeType === Node.TEXT_NODE) {
              const fixed = correct(n.nodeValue, chinese);
              if (fixed !== n.nodeValue) n.nodeValue = fixed;
            } else {
              sweep(n, chinese);
            }
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
