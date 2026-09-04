import "./globals.css";

export const metadata = {
  title: "Astra-Forecast Web Console",
  description: "Advanced Operations Center Interface for SIH 2026",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
