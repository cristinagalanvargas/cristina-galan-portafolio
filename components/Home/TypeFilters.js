import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { scrollVariants } from '@/utils/framer';

export default function TypeFilters({
    onCursor,
    projects,
    setFilteredProjects,
    filteredProjects,
    activeFilter,
    setActiveFilter,
    projectTypeFilters,
    allProjectsLength,
    comercialProjectsLength,
    personalProjectsLength,
}) {
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

    useEffect(() => {
        if (activeFilter === 'todos') {
            setFilteredProjects(projects);
            return;
        }

        const filtered = projects.filter(
            (project) => project.type === activeFilter
        );

        setFilteredProjects(filtered);
    }, [activeFilter]);

    return (
        <motion.section
            className="mx-auto max-w-5xl mt-16 md:mt-20 lg:mt-24"
            id="projects"
            ref={contentRef}
            animate={animation}
            initial="initial"
            variants={scrollVariants}
        >
            <div className="flex items-center justify-evenly">
                <button
                    type="button"
                    className={`tw-transition text-sm capitalize text-brand md:text-base px-1.5 md:px-2 md:py-1 lg:px-3 lg:py-2 py-0.5 border lg:text-lg ${
                        activeFilter === 'todos' &&
                        'text-red-400 border-red-400'
                    }`}
                    onClick={() => {
                        setActiveFilter('todos');
                    }}
                    onMouseEnter={() => onCursor('tw-hovered')}
                    onMouseLeave={onCursor}
                >
                    <span className="uppercase">todos</span>
                    <span className="text-xs md:text-sm lg:text-sm ml-2 text-neutral-500">
                        {allProjectsLength}
                    </span>
                </button>

                {projectTypeFilters.map((typeFilter, idx) => (
                    <button
                        key={idx}
                        type="button"
                        className={`tw-transition text-sm capitalize text-brand md:text-base px-1.5 md:px-2 md:py-1 lg:px-3 lg:py-2 py-0.5 border lg:text-lg ${
                            activeFilter === typeFilter &&
                            'border-red-400 text-red-400'
                        }`}
                        onClick={() => {
                            setActiveFilter(typeFilter);
                        }}
                        onMouseEnter={() => onCursor('tw-hovered')}
                        onMouseLeave={onCursor}
                    >
                        <span className="uppercase">{typeFilter}</span>
                        {typeFilter === 'comercial' && (
                            <span className="text-xs md:text-sm lg:text-base ml-2 text-neutral-500">
                                {comercialProjectsLength}
                            </span>
                        )}
                        {typeFilter === 'personal' && (
                            <span className="text-xs md:text-sm lg:text-base ml-2 text-neutral-500">
                                {personalProjectsLength}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </motion.section>
    );
}
