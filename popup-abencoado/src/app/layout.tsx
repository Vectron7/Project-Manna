import "./globals.css";
import { Calligraffitti } from "next/font/google";
import AssetPreloader from "../main/components/AssetPreloader";

const calligraffitti = Calligraffitti({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className={calligraffitti.className}>
      <body>
        <AssetPreloader />
        {children}
      </body>
    </html>
  );
}