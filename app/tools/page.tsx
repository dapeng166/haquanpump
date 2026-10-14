import type { Metadata } from "next";
import { TOOLS_EN } from "@/lib/tools/strings";
import { localeAlternates } from "@/lib/i18n/alternates";
import { ToolsIndex } from "@/components/tools/ToolsIndex";
import { TOOLS_PATH } from "@/components/tools/ToolPage";

export const metadata: Metadata = {
  title: TOOLS_EN.index.metaTitle,
  description: TOOLS_EN.index.metaDesc,
  alternates: { canonical: TOOLS_PATH, languages: localeAlternates(TOOLS_PATH) },
};

export default function ToolsPage() {
  return <ToolsIndex t={TOOLS_EN} />;
}
