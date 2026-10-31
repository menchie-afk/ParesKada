import "./globals.css";

export const metadata = {
  title: "ParesKada — Sarap ng Pares, Dito sa Kada!",
  description: "Discover local paresan favorites and satisfy your pares cravings with ParesKada."
};

export default function RootLayout({ children }) {
  return (
    <html lang="tl">
      <body>{children}</body>
    </html>
  );
}
