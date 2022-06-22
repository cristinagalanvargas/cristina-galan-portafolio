import { motion } from 'framer-motion';
import { AiOutlineDown } from 'react-icons/ai';

import { childVariants } from '@/utils/framer';

import CenteredSection from '@/components/Shared/CenteredSection';

export default function Hero({ expo, onCursor }) {
    return (
        <CenteredSection>
            <motion.div
                className="flex flex-col items-center text-center"
                variants={childVariants}
            >
                <h2 className="text-lg lg:text-2xl text-gray-500">
                    {expo.location} &apos;{expo.year}
                </h2>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold uppercase mt-2 md:mt-4 lg:mt-6">
                    {expo.name}
                </h1>

                <p className="tw-paragraph mt-2 md:mt-4 lg:mt-6">
                    {expo.description}
                </p>
            </motion.div>

            <motion.div
                className="text-gray-700 dark:text-gray-300 hover:text-red-400 mt-6"
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
