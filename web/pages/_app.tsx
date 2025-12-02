// web/pages/_app.tsx

import type { AppProps } from 'next/app';
// Anda mungkin perlu mengimport global styles di sini

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
