import Image from 'next/image';
import { motion } from 'framer-motion';

import { childVariants } from '@/utils/framer';

import CenteredSection from '@/components/Shared/CenteredSection';

export default function Hero({ project }) {
    return (
        <CenteredSection>
            <Image
                className="z-10"
                src={project.coverImage.url}
                alt={project.name}
                objectFit="cover"
                objectPosition="center"
                layout="fill"
                priority
            />
            <motion.h1
                className="leading-0 z-20 whitespace-normal text-center font-serif text-7xl font-bold uppercase text-white md:text-9xl lg:text-11xl"
                variants={childVariants}
            >
                {project.name}
            </motion.h1>
        </CenteredSection>
    );
}
