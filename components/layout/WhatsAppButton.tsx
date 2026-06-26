import { company } from "@/lib/site";
import { WhatsappIcon } from "@/components/ui/WhatsappIcon";

/** Floating WhatsApp quick-chat button, shown on every page (bottom corner). */
export function WhatsAppButton() {
  return (
    <a
      href={company.social.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/60 focus-visible:ring-offset-2 rtl:left-5 rtl:right-auto"
    >
      <WhatsappIcon className="h-7 w-7" />
    </a>
  );
}
