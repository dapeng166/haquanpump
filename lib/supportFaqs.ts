import type { SitePage } from "@/lib/types";
import { acfStr } from "@/lib/wordpress";
import { faqs } from "@/lib/data/content";

/**
 * FAQs shown on the Support page. Editable via the `support` site_page
 * (FAQ 1–8): when any are filled in, only those are used; otherwise the curated
 * defaults. Shared by the Support page and the site search index.
 */
export function supportFaqs(page: SitePage | null): { q: string; a: string }[] {
  const cmsFaqs = [1, 2, 3, 4, 5, 6, 7, 8]
    .map((n) => ({
      q: acfStr(page, `faq_${n}_question`),
      a: acfStr(page, `faq_${n}_answer`),
    }))
    .filter((f) => f.q && f.a);
  return cmsFaqs.length > 0 ? cmsFaqs : faqs;
}
