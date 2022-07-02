import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { scrollVariants } from '@/utils/framer';

export default function Card({ expo, onCursor }) {
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
        <motion.li
            ref={contentRef}
            initial="initial"
            animate={animation}
            variants={scrollVariants}
            onMouseEnter={() => onCursor('tw-hovered')}
            onMouseLeave={onCursor}
        >
            <Link href={`/expos/${expo.slug}`}>
                <a>
                    <div className="group aspect-w-10 aspect-h-7 block w-full overflow-hidden bg-transparent">
                        <div className="flex flex-col justify-center">
                            <Image
                                className="relative"
                                alt={expo.name}
                                src={expo.cover.url}
                                layout="fill"
                                objectFit="cover"
                            />

                            <div
                                className="tw-transition relative z-99 flex h-full w-full items-center justify-center font-serif text-6xl font-bold uppercase text-white hover:opacity-0 dark:text-black lg:text-8xl"
                                style={{
                                    backgroundColor: `${expo.color.hex}`,
                                }}
                            >
                                {expo.location}
                            </div>
                        </div>
                    </div>
                </a>
            </Link>
        </motion.li>
    );
}
