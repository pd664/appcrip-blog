
import "./globals.css";
import { handleWebVitals } from "./reportWebVitals";

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
        className='flex justify-center'
      >
        {children}
      </body>
    </html>
  );
}
