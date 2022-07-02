import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { scrollVariants } from '@/utils/framer';

export default function CTA({ children }) {
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
        <motion.div
            className="overflow-hidden"
            ref={contentRef}
            initial="initial"
            animate={animation}
            variants={scrollVariants}
        >
            <p className="tw-paragraph text-center text-2xl md:text-3xl lg:text-4xl">
                {children}
            </p>
        </motion.div>
    );
}
