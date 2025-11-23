import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "THUENGAY.COM - Tìm việc làm nông nghiệp nhanh chóng",
  description: "Kết nối chủ vườn và thợ hái cà phê, tiêu, sầu riêng... nhanh chóng, uy tín.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 80px)' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
