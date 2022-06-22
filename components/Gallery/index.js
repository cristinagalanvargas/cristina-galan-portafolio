import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { scrollVariants } from '@/utils/framer';

import Modal from '@/components/Gallery/Modal';

export default function Gallery({ images, alt, onCursor }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleModalToggle = (key) => {
        setIsModalOpen(!isModalOpen);
        setSelected(key);
    };

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
            {images && (
                <motion.section
                    className="tw-section-separator"
                    id="gallery"
                    ref={contentRef}
                    initial="initial"
                    animate={animation}
                    variants={scrollVariants}
                >
                    <ul
                        role="list"
                        className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-8"
                    >
                        {images.map((image, idx) => (
                            <li
                                key={image.id}
                                className="relative"
                                onClick={() => handleModalToggle(idx)}
                                onMouseEnter={() => onCursor('tw-hovered')}
                                onMouseLeave={onCursor}
                            >
                                <div className="group block w-full aspect-w-10 aspect-h-7 bg-transparent overflow-hidden">
                                    <div className="flex flex-col justify-center">
                                        <Image
                                            key={idx}
                                            src={image.url}
                                            alt={alt}
                                            layout="responsive"
                                            objectFit="contain"
                                            width={image.width}
                                            height={image.height}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        className="absolute inset-0 focus:outline-none"
                                    >
                                        <span className="sr-only">
                                            View details for {alt}
                                        </span>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <Modal
                        images={images}
                        alt={alt}
                        selected={selected}
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        handleModalToggle={handleModalToggle}
                        onCursor={onCursor}
                    />
                </motion.section>
            )}
        </>
    );
}
