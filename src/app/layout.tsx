import PublicPageProvider from "@/components/context/PublicPageContext";
import { LangcookieName } from "@/middleware";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";

const LangProvider = dynamic(() => import("@/components/context/LangProvider"));
const Authsession = dynamic(() => import("@/components/providers/Authsession"));
// const ThemeRegistry = dynamic(() => import("@/components/Theme/ThemeRegistry"));
import ThemeRegistry from "@/components/Theme/ThemeRegistry";
// const AppHeader = dynamic(() => import("@/components/header"), { ssr: false });
import AppHeader from "@/components/header";

export const metadata: Metadata = {
  title: "EazyGain",
  applicationName: "EazyGain",
  other: {
    google: "notranslate",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EazyGain",
  },
  description:
    "A direct-to-retailer platform for Indian retailers to buy 100% authentic products directly from brands.",
  formatDetection: {
    telephone: false,
  },
  themeColor: "#0B5CFF",
  icons: [
    {
      rel: "shortcut icon",
      url: "/assets/favicon.svg",
    },
    {
      rel: "apple-touch-icon",
      sizes: "152x152",
      url: "https://growmax-prod-app-assets.s3.ap-northeast-1.amazonaws.com/app_assets/app/alfome/icon/PWA_lg7yqqkm14/android-chrome-512x512.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "https://growmax-prod-app-assets.s3.ap-northeast-1.amazonaws.com/app_assets/app/alfome/icon/PWA_lg7yqqkm14/android-chrome-512x512.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "167x167",
      url: "https://growmax-prod-app-assets.s3.ap-northeast-1.amazonaws.com/app_assets/app/alfome/icon/PWA_lg7yqqkm14/android-chrome-512x512.png",
    },
  ],
  twitter: {
    images: [
      "https://growmax-prod-app-assets.s3.ap-northeast-1.amazonaws.com/app_assets/app/alfome/icon/PWA_lg7yqqkm14/android-chrome-512x512.png",
    ],
    card: "summary_large_image",
    title: "Eazy Gain",
    description:
      "A direct-to-retailer platform for Indian retailers to buy 100% authentic products directly from brands.",
  },
  openGraph: {
    images: [
      "https://growmax-prod-app-assets.s3.ap-northeast-1.amazonaws.com/app_assets/app/alfome/icon/PWA_lg7yqqkm14/android-chrome-512x512.png",
    ],
    title: "Eazy Gain",
    description:
      "A direct-to-retailer platform for Indian retailers to buy 100% authentic products directly from brands.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const currentLang = cookieStore.get(LangcookieName);

  return (
    <html translate='no' lang={currentLang?.value || "ta"}>
      <body>
        <Authsession>
          <ThemeRegistry>
            <AppHeader />
            <LangProvider currentLang={currentLang?.value}>
              <PublicPageProvider>{children}</PublicPageProvider>
            </LangProvider>
          </ThemeRegistry>
        </Authsession>
      </body>
    </html>
  );
}
