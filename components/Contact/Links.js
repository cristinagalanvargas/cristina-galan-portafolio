import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { scrollVariants } from '@/utils/framer';

export default function Links({ contacts, onCursor }) {
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
        <motion.ul
            className="flex justify-evenly w-full"
            ref={contentRef}
            initial="initial"
            animate={animation}
            variants={scrollVariants}
        >
            {contacts.map((contact) => (
                <li
                    key={contact.id}
                    onMouseEnter={() => onCursor('tw-hovered')}
                    onMouseLeave={onCursor}
                >
                    <a
                        className="text-base md:text-lg lg:text-xl tw-link"
                        href={contact.link}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {contact.name}
                    </a>
                </li>
            ))}
        </motion.ul>
    );
}
