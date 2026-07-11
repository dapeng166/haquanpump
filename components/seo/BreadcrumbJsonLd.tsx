import { company } from "@/lib/site";

export type Crumb = { name: string; path: string };

/**
 * Emits BreadcrumbList structured data so Google can render a breadcrumb trail
 * (Home › Products › Pump Name) in the search result instead of a raw URL —
 * which improves click-through. `path` is the site-relative path (e.g.
 * "/products/foo"); the final crumb is the current page.
 */
export function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${company.url}${c.path}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
