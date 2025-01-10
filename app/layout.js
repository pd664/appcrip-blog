import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { handleWebVitals } from "./reportWebVitals";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "My Blogs",
  description: "My Thoughts and What’s Running in the Environment",
};

export default function RootLayout({ children }) {
  if (typeof window !== 'undefined') {
    import('web-vitals').then(({ reportWebVitals }) => {
      reportWebVitals(handleWebVitals); // Pass your custom handler
    });
  }
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
