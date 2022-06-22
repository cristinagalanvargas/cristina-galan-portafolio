import { useEffect } from 'react';
import Image from 'next/image';

import Link from 'next/link';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { scrollVariants } from '@/utils/framer';

export default function ProjectCard({ project, onCursor }) {
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
            layout
            ref={contentRef}
            initial="initial"
            animate={animation}
            exit={{ opacity: 0 }}
            variants={scrollVariants}
            onMouseEnter={() => onCursor('tw-hovered')}
            onMouseLeave={onCursor}
            className="col-span-2 lg:col-span-1"
        >
            <Link href={`/projects/${project.slug}`} passHref>
                <a>
                    <div className="flex">
                        <p className="pr-1 lg:pr-2 tw-card-text writing-mode-vertical-rl text-orientation-mixed">
                            {project.year}
                        </p>

                        <div className="flex flex-col w-full h-full">
                            <Image
                                className="object-cover object-center transform hover:scale-110 tw-transition"
                                src={project.coverImage.url}
                                alt={project.name}
                                layout="responsive"
                                width={16}
                                height={9}
                            />

                            <div className="flex flex-col">
                                <p className="pt-1 lg:pt-2 tw-card-text">
                                    {project.category.name}
                                </p>
                                <p className="tw-card-title">{project.name}</p>
                            </div>
                        </div>
                    </div>
                </a>
            </Link>
        </motion.li>
    );
}
