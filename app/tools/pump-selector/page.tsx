import type { Metadata } from "next";
import { getProducts } from "@/lib/wordpress";
import { toToolProducts } from "@/lib/tools/catalogue";
import { TOOLS_EN } from "@/lib/tools/strings";
import { localeAlternates } from "@/lib/i18n/alternates";
import { PumpSelector } from "@/components/tools/PumpSelector";
import { ToolPage, TOOLS_PATH } from "@/components/tools/ToolPage";

const PATH = `${TOOLS_PATH}/pump-selector`;
const T = TOOLS_EN.selector;

export const metadata: Metadata = {
  title: T.page.metaTitle,
  description: T.page.metaDesc,
  alternates: { canonical: PATH, languages: localeAlternates(PATH) },
};

// Static (ISR) like the catalogue; refreshed on every WordPress product publish
// via /api/revalidate, so new pumps are matched straight away.
export default async function PumpSelectorPage() {
  const catalogue = toToolProducts(await getProducts());
  return (
    <ToolPage
      path={PATH}
      page={T.page}
      common={TOOLS_EN.common}
      tool={<PumpSelector catalogue={catalogue} t={T.ui} />}
    />
  );
}
