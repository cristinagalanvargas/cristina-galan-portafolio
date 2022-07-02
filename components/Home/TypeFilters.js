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
            className="mx-auto mt-16 max-w-5xl md:mt-20 lg:mt-24"
            id="projects"
            ref={contentRef}
            animate={animation}
            initial="initial"
            variants={scrollVariants}
        >
            <div className="flex items-center justify-evenly">
                <button
                    type="button"
                    className={`tw-transition border px-1.5 py-2 text-xs capitalize md:text-sm lg:text-base ${
                        activeFilter === 'todos' &&
                        'border-red-400 text-red-400'
                    }`}
                    onClick={() => {
                        setActiveFilter('todos');
                    }}
                    onMouseEnter={() => onCursor('tw-hovered')}
                    onMouseLeave={onCursor}
                >
                    <span className="uppercase">todos</span>
                    <span className="ml-2 text-xs text-neutral-500 md:text-sm lg:text-sm">
                        {allProjectsLength}
                    </span>
                </button>

                {projectTypeFilters.map((typeFilter, idx) => (
                    <button
                        key={idx}
                        type="button"
                        className={`tw-transition border px-1.5 py-2 text-xs capitalize md:text-sm lg:text-base ${
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
                            <span className="ml-2 text-xs text-neutral-500 md:text-sm lg:text-base">
                                {comercialProjectsLength}
                            </span>
                        )}
                        {typeFilter === 'personal' && (
                            <span className="ml-2 text-xs text-neutral-500 md:text-sm lg:text-base">
                                {personalProjectsLength}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </motion.section>
    );
}
