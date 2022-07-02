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
            className="flex w-full justify-evenly"
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
                        className="tw-link text-sm uppercase lg:text-lg"
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
