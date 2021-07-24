import Head from "next/head";
import { AppProps } from "next/app";
import { Provider as NextAuthProvider } from "next-auth/client";

import { Header } from "components/Header";

import "styles/global.scss";
import { AuthProvider } from "context/AuthContext";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <AuthProvider>
        <Head>
          <title>IGNews</title>
        </Head>
        <Header />
        <Component {...pageProps} />
      </AuthProvider>
    </NextAuthProvider>
  );
}
