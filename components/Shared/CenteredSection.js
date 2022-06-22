import { motion } from 'framer-motion';

import { parentVariants } from '@/utils/framer';

export default function CenteredSection({ children }) {
    return (
        <motion.section
            className="tw-content-container-mobile lg:tw-content-container-desktop flex flex-col items-center justify-center"
            variants={parentVariants}
        >
            {children}
        </motion.section>
    );
}
