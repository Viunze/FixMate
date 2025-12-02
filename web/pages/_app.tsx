// web/pages/_app.tsx

import '../styles/globals.css'; // <--- BARIS KRITIS: Mengimpor semua styling Tailwind
import type { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>FixMate AI Engineer Assistant</title>
        <meta name="description" content="AI-powered debugging and code fixing assistant." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
