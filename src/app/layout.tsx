import { Roboto } from 'next/font/google';
import './globals.css'

// Загрузка шрифта Roboto
const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en" className={roboto.className}>
      <body>{children}</body>
      </html>
  );
}
