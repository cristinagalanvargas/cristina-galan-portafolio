import { motion } from 'framer-motion';
import { NextSeo } from 'next-seo';

import { pageVariants } from '@/utils/framer';

export default function PageContainer({
    children,
    metaTitle,
    metaDesription,
    className,
}) {
    return (
        <>
            <NextSeo
                title={metaTitle}
                description={metaDesription}
                openGraph={{ metaTitle, metaDesription }}
            />
            <motion.div
                className={`${className} min-h-screen pt-20 lg:pt-28`}
                exit={{ opacity: 0 }}
                initial="initial"
                animate="animate"
                variants={pageVariants}
            >
                {children}
            </motion.div>
        </>
    );
}
