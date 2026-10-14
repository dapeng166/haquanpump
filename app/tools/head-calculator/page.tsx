import type { Metadata } from "next";
import { TOOLS_EN } from "@/lib/tools/strings";
import { localeAlternates } from "@/lib/i18n/alternates";
import { HeadCalculator } from "@/components/tools/HeadCalculator";
import { ToolPage, TOOLS_PATH } from "@/components/tools/ToolPage";

const PATH = `${TOOLS_PATH}/head-calculator`;
const T = TOOLS_EN.calc;

export const metadata: Metadata = {
  title: T.page.metaTitle,
  description: T.page.metaDesc,
  alternates: { canonical: PATH, languages: localeAlternates(PATH) },
};

export default function HeadCalculatorPage() {
  return (
    <ToolPage
      path={PATH}
      page={T.page}
      common={TOOLS_EN.common}
      tool={<HeadCalculator t={T.ui} />}
    />
  );
}
