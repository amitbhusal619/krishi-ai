import { SiteNavbar } from "@/components/shared/site-navbar";
import { SiteFooter } from "@/components/shared/site-footer";
import { FloatingChatbot } from "@/components/shared/floating-chatbot";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNavbar />
      <main>{children}</main>
      <SiteFooter />
      <FloatingChatbot />
    </>
  );
}
