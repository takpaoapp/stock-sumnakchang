import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ระบบบริหารและควบคุมวัสดุ สำนักช่าง (Paper & Stock Card Edition)",
  description: "ระบบควบคุมการเบิกจ่ายและตรวจรับวัสดุ สำนักช่าง องค์การบริหารส่วนจังหวัด",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#f4efe6] text-[#2c2825] antialiased selection:bg-amber-200">
        {children}
      </body>
    </html>
  );
}
