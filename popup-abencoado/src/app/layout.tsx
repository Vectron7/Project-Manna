import AssetPreloader from "../main/components/AssetPreloader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>
        <AssetPreloader />
        {children}
      </body>
    </html>
  );
}