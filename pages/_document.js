import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="es-es">
                <Head>
                    <link
                        rel="preload"
                        href="/fonts/formula/PPFormula-CondensedMedium.woff2"
                        as="font"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />
                    <link
                        rel="preload"
                        href="/fonts/formula/PPFormula-CondensedRegular.woff2"
                        as="font"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />
                    <link
                        rel="preload"
                        href="/fonts/formula/PPFormula-Medium.woff2"
                        as="font"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />
                    <link
                        rel="preload"
                        href="/fonts/formula/PPFormula-Regular.woff2"
                        as="font"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />

                    <meta
                        httpEquiv="Content-Type"
                        content="text/html; charset=utf-8"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
