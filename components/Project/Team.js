import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { scrollVariants } from '@/utils/framer';

import Label from '@/components/Project/Table/Label';
import CellContainer from '@/components/Project/Table/CellContainer';
import CellKey from '@/components/Project/Table/CellKey';
import CellValue from '@/components/Project/Table/CellValue';

export default function Team({ role, team }) {
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
        <motion.section
            className="w-full md:w-1/5 md:text-right"
            ref={contentRef}
            initial="initial"
            animate={animation}
            variants={scrollVariants}
        >
            <Label>Equipo</Label>

            {role && (
                <CellContainer>
                    <CellKey>{role}</CellKey>
                    <CellValue>Cristina Galán</CellValue>
                </CellContainer>
            )}

            {team && (
                <>
                    {team.map((member) => (
                        <CellContainer key={member.id}>
                            <CellKey>{member.role}</CellKey>
                            <CellValue>{member.name}</CellValue>
                        </CellContainer>
                    ))}
                </>
            )}
        </motion.section>
    );
}
