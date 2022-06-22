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
                className="z-20 font-heading font-bold text-6xl md:text-8xl lg:text-10xl text-white leading-0 uppercase whitespace-normal text-center"
                variants={childVariants}
            >
                {project.name}
            </motion.h1>
        </CenteredSection>
    );
}
