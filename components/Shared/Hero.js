import { motion } from 'framer-motion';

import { parentVariants, childVariants } from '@/utils/framer';

export default function Hero({ title }) {
    return (
        <motion.section
            className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen overflow-hidden flex items-end -z-1 max-w-full mx-auto px-4 sm:px-6"
            variants={parentVariants}
        >
            <motion.h1
                className="tw-page-title text-neutral-100 dark:text-neutral-900 tw-transition"
                variants={childVariants}
            >
                {title}
            </motion.h1>
        </motion.section>
    );
}
