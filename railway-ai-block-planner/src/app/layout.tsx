import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Automatic Block Planning Engine | Indian Railways (Lucknow Division)',
  description: 'AI-Powered Decision Support System to Maximize Asset Availability and Minimize Train Delay Hours for Indian Railways Operations (Lucknow NR/NER & UP Network)',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090f1c] text-slate-100 min-h-screen antialiased selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
