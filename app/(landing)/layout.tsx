import { Toaster } from "@/components/ui/toaster";
import Footer from "./_components/footer";
import Navbar from "./_components/navbar";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <Navbar />
      <main className="pt-40 pb-20 bg-black h-full">{children}</main>
      <Footer />
      <Toaster />
    </div>
  );
}
