import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { scrollVariants } from '@/utils/framer';

import Label from '@/components/Project/Table/Label';
import CellContainer from '@/components/Project/Table/CellContainer';
import CellKey from '@/components/Project/Table/CellKey';
import CellValue from '@/components/Project/Table/CellValue';

export default function Info({ project }) {
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
            className="col-span-1"
            ref={contentRef}
            initial="initial"
            animate={animation}
            variants={scrollVariants}
        >
            <Label>Info</Label>
            <div>
                {project.title && (
                    <CellContainer>
                        <CellKey>Proyecto</CellKey>
                        <CellValue>{project.title}</CellValue>
                    </CellContainer>
                )}

                {project.category && (
                    <CellContainer>
                        <CellKey>Categoría</CellKey>
                        <CellValue>{project.category.name}</CellValue>
                    </CellContainer>
                )}

                {project.type && (
                    <CellContainer>
                        <CellKey>Tipo</CellKey>
                        <CellValue>{project.type}</CellValue>
                    </CellContainer>
                )}

                {project.agency && (
                    <CellContainer>
                        <CellKey>Agencia</CellKey>
                        <CellValue>{project.agency}</CellValue>
                    </CellContainer>
                )}

                {project.client && (
                    <CellContainer>
                        <CellKey>Cliente</CellKey>
                        <CellValue>{project.client}</CellValue>
                    </CellContainer>
                )}

                {project.year && (
                    <CellContainer>
                        <CellKey>Año</CellKey>
                        <CellValue>{project.year}</CellValue>
                    </CellContainer>
                )}
            </div>
        </motion.div>
    );
}
