import { motion } from 'framer-motion';
import { AiOutlineDown } from 'react-icons/ai';

import { childVariants } from '@/utils/framer';

import CenteredSection from '@/components/Shared/CenteredSection';

export default function Hero({ onCursor }) {
    return (
        <CenteredSection>
            <motion.div
                className="flex space-x-2 items-center text-gray-700 dark:text-gray-300 text-base md:text-2xl lg:text-2xl"
                variants={childVariants}
            >
                <h2 variants={childVariants}>
                    Fotógrafa & Realizadora @ Madrid, ES
                </h2>
            </motion.div>

            <div className="flex flex-col items-center font-heading font-bold text-7xl md:text-9xl lg:text-10xl uppercase">
                <motion.h1 variants={childVariants}>Cristina</motion.h1>

                <motion.h1 variants={childVariants}>Galán</motion.h1>
            </div>

            <div className="flex flex-col items-center justify-center">
                <motion.div
                    className="text-gray-500 hover:text-red-400 tw-transition"
                    variants={childVariants}
                    onMouseEnter={() => onCursor('tw-hovered')}
                    onMouseLeave={onCursor}
                >
                    <a href="#projects">
                        <AiOutlineDown
                            className="tw-icon"
                            aria-label="Projects"
                        />
                    </a>
                </motion.div>
            </div>
        </CenteredSection>
    );
}
