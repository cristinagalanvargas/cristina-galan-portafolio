import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

import { scrollVariants } from '@/utils/framer';

import PlusIcon from '@/components/Icons/PlusIcon';
import MinusIcon from '@/components/Icons/MinusIcon';

export default function Clients({ clients, onCursor }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleOpen = () => setIsExpanded(!isExpanded);

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
            <motion.li
                layout
                ref={contentRef}
                initial="initial"
                animate={animation}
                variants={scrollVariants}
                onClick={toggleOpen}
            >
                <motion.div
                    layout
                    className="flex justify-between items-center"
                    onClick={() => setIsExpanded(isExpanded ? false : true)}
                    onMouseEnter={() => onCursor('tw-hovered')}
                    onMouseLeave={onCursor}
                >
                    <h2
                        className={`tw-subheading text-xl lg:text-5xl tw-transition ${
                            isExpanded ? 'text-red-400' : ''
                        }`}
                    >
                        Clientes
                    </h2>

                    <div
                        className={`tw-transition tw-link ${
                            isExpanded ? 'transform rotate-180' : ''
                        }`}
                    >
                        {!isExpanded && <PlusIcon />}
                        {isExpanded && <MinusIcon />}
                    </div>
                </motion.div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-x-20 gap-y-10 lg:gap-x-48 py-12"
                        >
                            {clients.map((client) => (
                                <Image
                                    key={client.id}
                                    src={client.logo.url}
                                    alt={client.name}
                                    layout="responsive"
                                    width={1}
                                    height={1}
                                    objectFit="contain"
                                    objectPosition="center"
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.li>
        </>
    );
}
