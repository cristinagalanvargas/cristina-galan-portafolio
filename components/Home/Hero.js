import { motion } from 'framer-motion';
import { AiOutlineDown } from 'react-icons/ai';

import { childVariants } from '@/utils/framer';

import CenteredSection from '@/components/Shared/CenteredSection';

export default function Hero({ onCursor }) {
    return (
        <CenteredSection>
            <motion.div
                className="spasmce-x-2 flex items-center text-sm text-neutral-700 dark:text-neutral-300 md:text-lg lg:text-xl"
                variants={childVariants}
            >
                <h2 variants={childVariants}>
                    Fotógrafa & Realizadora @ Madrid, ES
                </h2>
            </motion.div>

            <div className="mt-4 flex flex-col items-center font-serif text-8xl font-bold uppercase md:text-9xl lg:text-10xl">
                <motion.h1 variants={childVariants}>Cristina</motion.h1>

                <motion.h1 variants={childVariants}>Galán</motion.h1>
            </div>

            <div className="flex flex-col items-center justify-center">
                <motion.div
                    className="tw-transition text-neutral-500 hover:text-red-400"
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
