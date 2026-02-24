import { Geist, Geist_Mono } from "next/font/google";
import "@/app/css/globals.css";
import Script from "next/script";
import { CONFIG } from "@/config/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: CONFIG.INSTITUTE_NAME,
  description: `Welcome to ${CONFIG.NAME}`,
  icons: {
    icon: CONFIG.FAVICON_PATH,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="icon" href={CONFIG.FAVICON_PATH} />
        <Script id="theme-loader" strategy="beforeInteractive">
          {`
            (function() {
              const themes = ["light", "dark"];
              let theme = localStorage.getItem("theme");
              if (!theme || !themes.includes(theme)) {
                theme = "light";
              }
              document.documentElement.setAttribute("data-theme", theme);
            })();
          `}
        </Script>
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased mx-auto`}
      >
        <main>{children}</main>
      </body>
    </html>
  );
}
