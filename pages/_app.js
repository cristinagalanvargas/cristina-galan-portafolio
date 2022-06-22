import { useRouter } from 'next/router';
import { AnimatePresence } from 'framer-motion';
import { DefaultSeo } from 'next-seo';

import { GlobalProvider } from '@/utils/context/global-context';
import Layout from '@/components/Nav/Layout';

import '@/styles/global.css';

function handleExitComplete() {
    if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0 });
    }
}

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const url = `https://bukitt.com${router.asPath}`;

    return (
        <>
            <DefaultSeo
                titleTemplate="%s | Cristina Galán"
                openGraph={{
                    type: 'website',
                    locale: 'en_IE',
                    url,
                    description: 'Realizadora y artista visual.',
                    site_name: 'Cristina Galán | cristinagalan.com',
                    images: [],
                }}
                canonical={url}
            />

            <GlobalProvider>
                <Layout>
                    <AnimatePresence
                        exitBeforeEnter
                        onExitComplete={handleExitComplete}
                    >
                        <Component {...pageProps} canonical={url} key={url} />
                    </AnimatePresence>
                </Layout>
            </GlobalProvider>
        </>
    );
}

export default MyApp;
