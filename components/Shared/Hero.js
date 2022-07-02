import { motion } from 'framer-motion';

import { parentVariants, childVariants } from '@/utils/framer';

export default function Hero({ title }) {
    return (
        <motion.section
            className="fixed top-0 left-0 right-0 bottom-0 -z-1 mx-auto flex h-screen w-screen max-w-full items-end overflow-hidden px-4 sm:px-6"
            variants={parentVariants}
        >
            <motion.h1
                className="tw-page-title tw-transition text-neutral-100 dark:text-neutral-900"
                variants={childVariants}
            >
                {title}
            </motion.h1>
        </motion.section>
    );
}
