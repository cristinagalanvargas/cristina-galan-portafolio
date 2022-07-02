import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { scrollVariants } from '@/utils/framer';

export default function Summary({ description }) {
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
            className="w-full text-base md:text-lg lg:w-3/5 lg:text-xl"
            ref={contentRef}
            initial="initial"
            animate={animation}
            variants={scrollVariants}
        >
            <p>{description}</p>
        </motion.div>
    );
}
