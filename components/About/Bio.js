import { useEffect } from 'react';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { parentVariants } from '@/utils/framer';

export default function Bio({ about }) {
    const animation = useAnimation();
    const [contentRef, inView] = useInView({
        triggerOnce: true,
        threshold: 0.25,
    });

    useEffect(() => {
        if (inView) {
            animation.start('animate');
        }
    }, [animation, inView]);

    return (
        <motion.section
            className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-y-12 gap-x-0 md:flex-row md:gap-x-6 lg:gap-x-24"
            variants={parentVariants}
        >
            <div className="w-full md:w-1/3">
                <Image
                    src={about.profilePicture.url}
                    alt="Cristina Galán"
                    layout="responsive"
                    width={3}
                    height={4}
                    objectFit="cover"
                    objectPosition="center"
                />
            </div>

            <div className="w-full md:w-2/3">
                <p className="prose prose-base lg:prose-lg">{about.bio}</p>
            </div>
        </motion.section>
    );
}
