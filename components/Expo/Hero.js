import { motion } from 'framer-motion';
import { AiOutlineDown } from 'react-icons/ai';

import { childVariants } from '@/utils/framer';

import CenteredSection from '@/components/Shared/CenteredSection';

export default function Hero({ expo, onCursor }) {
    return (
        <CenteredSection>
            <motion.div
                className="relative flex flex-col items-center text-center"
                variants={childVariants}
            >
                <h2 className="text-base text-black lg:text-xl">
                    {expo.location} {expo.year}
                </h2>

                <h1 className="mt-1.5 font-serif text-6xl font-bold uppercase md:mt-2 md:text-7xl lg:mt-3 lg:text-8xl">
                    {expo.name}
                </h1>

                <p className="tw-paragraph mt-2 md:mt-4 lg:mt-6">
                    {expo.description}
                </p>

                <div
                    className="absolute top-1/2 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full"
                    style={{ backgroundColor: `${expo.color.hex}` }}
                />
            </motion.div>

            <motion.div
                className="mt-6 text-neutral-700 hover:text-red-400 dark:text-neutral-300"
                variants={childVariants}
                onMouseEnter={() => onCursor('tw-hovered')}
                onMouseLeave={onCursor}
            >
                <a
                    href={`${
                        (expo.video && '#player') ||
                        (expo.gallery && '#gallery') ||
                        (expo.video && expo.gallery && '#player')
                    }`}
                >
                    <AiOutlineDown className="tw-icon" />
                </a>
            </motion.div>
        </CenteredSection>
    );
}
