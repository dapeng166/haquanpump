import type { Metadata } from "next";
import { TOOLS_EN } from "@/lib/tools/strings";
import { localeAlternates } from "@/lib/i18n/alternates";
import { WildenSelector } from "@/components/tools/WildenSelector";
import { ToolPage, TOOLS_PATH } from "@/components/tools/ToolPage";

const PATH = `${TOOLS_PATH}/wilden-pump-selector`;
const T = TOOLS_EN.wilden;

export const metadata: Metadata = {
  title: T.page.metaTitle,
  description: T.page.metaDesc,
  alternates: { canonical: PATH, languages: localeAlternates(PATH) },
};

export default function WildenPumpSelectorPage() {
  return (
    <ToolPage
      path={PATH}
      page={T.page}
      common={TOOLS_EN.common}
      tool={<WildenSelector t={T.ui} />}
    />
  );
}
