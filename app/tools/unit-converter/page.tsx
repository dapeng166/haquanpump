import type { Metadata } from "next";
import { TOOLS_EN } from "@/lib/tools/strings";
import { localeAlternates } from "@/lib/i18n/alternates";
import { UnitConverter } from "@/components/tools/UnitConverter";
import { ToolPage, TOOLS_PATH } from "@/components/tools/ToolPage";

const PATH = `${TOOLS_PATH}/unit-converter`;
const T = TOOLS_EN.conv;

export const metadata: Metadata = {
  title: T.page.metaTitle,
  description: T.page.metaDesc,
  alternates: { canonical: PATH, languages: localeAlternates(PATH) },
};

export default function UnitConverterPage() {
  return (
    <ToolPage
      path={PATH}
      page={T.page}
      common={TOOLS_EN.common}
      tool={<UnitConverter t={T.ui} />}
    />
  );
}
