import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { scrollVariants } from '@/utils/framer';

export default function Video({ url }) {
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
        <>
            {url && (
                <motion.section
                    className="tw-section-separator mx-auto w-full max-w-4xl"
                    id="player"
                    ref={contentRef}
                    initial="initial"
                    animate={animation}
                    variants={scrollVariants}
                >
                    <div className="aspect-w-16 aspect-h-9 ">
                        <iframe
                            src={url}
                            width="640"
                            height="360"
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                        />
                    </div>
                </motion.section>
            )}
        </>
    );
}
