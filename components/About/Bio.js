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
            className="tw-content-container-mobile lg:tw-content-container-desktop flex flex-col lg:flex-row items-center justify-center space-x-0 space-y-12 lg:space-x-24"
            variants={parentVariants}
        >
            <div className="w-full lg:w-1/3">
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

            <div className="w-full lg:w-2/3">
                <p className="tw-paragraph">{about.bio}</p>
            </div>
        </motion.section>
    );
}
