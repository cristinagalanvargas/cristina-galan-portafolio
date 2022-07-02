import { motion } from 'framer-motion';
import { AiOutlineDown } from 'react-icons/ai';

import { childVariants } from '@/utils/framer';

import CenteredSection from '@/components/Shared/CenteredSection';

export default function Hero({ expo, onCursor }) {
    return (
        <CenteredSection>
            <motion.div
                className="flex flex-col items-center text-center relative"
                variants={childVariants}
            >
                <h2 className="text-base lg:text-xl text-black">
                    {expo.location} {expo.year}
                </h2>

                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold uppercase mt-1.5 md:mt-2 lg:mt-3 font-serif">
                    {expo.name}
                </h1>

                <p className="tw-paragraph mt-2 md:mt-4 lg:mt-6">
                    {expo.description}
                </p>

                <div
                    className="w-96 h-96 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full -z-10"
                    style={{ backgroundColor: `${expo.color.hex}` }}
                />
            </motion.div>

            <motion.div
                className="text-neutral-700 dark:text-neutral-300 hover:text-red-400 mt-6"
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
