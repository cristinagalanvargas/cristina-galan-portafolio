import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import { graphcmsClient } from '@/lib/_client';
import { homePageQuery } from '@/lib/_queries';
import {
    useGlobalStateContext,
    useGlobalDispatchContext,
} from '@/utils/context/global-context';

import Hero from '@/components/Home/Hero';
import TypeFilters from '@/components/Home/TypeFilters';
import ProjectsList from '@/components/Home/ProjectsList';
import ProjectCard from '@/components/Home/ProjectCard';
import PageContainer from '@/components/Shared/PageContainer';

const HomePage = ({ allProjects }) => {
    const [projects] = useState(allProjects);
    const [filteredProjects, setFilteredProjects] = useState(allProjects);
    const [projectTypeFilters] = useState(['comercial', 'personal']);
    const [activeFilter, setActiveFilter] = useState('todos');
    const dispatch = useGlobalDispatchContext();
    const { cursorStyles } = useGlobalStateContext();

    const onCursor = (cursorType) => {
        cursorType = (cursorStyles.includes(cursorType) && cursorType) || false;
        dispatch({ type: 'CURSOR_TYPE', cursorType: cursorType });
    };

    const comercialProjects = allProjects.filter(
        (project) => project.type === 'comercial'
    );
    const personalProjects = allProjects.filter(
        (project) => project.type === 'personal'
    );

    const allProjectsLength = allProjects.length;
    const comercialProjectsLength = comercialProjects.length;
    const personalProjectsLength = personalProjects.length;

    return (
        <PageContainer
            metaTitle="Inicio"
            metaDescription="Portafolio web de Cristina Galán, fotógrafa y realizadora audiovisual basada en Madrid, España."
        >
            <Hero onCursor={onCursor} />
            <TypeFilters
                onCursor={onCursor}
                projects={projects}
                setFilteredProjects={setFilteredProjects}
                filteredProjects={filteredProjects}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                projectTypeFilters={projectTypeFilters}
                allProjectsLength={allProjectsLength}
                comercialProjectsLength={comercialProjectsLength}
                personalProjectsLength={personalProjectsLength}
            />
            <ProjectsList>
                <AnimatePresence>
                    {filteredProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onCursor={onCursor}
                        />
                    ))}
                </AnimatePresence>
            </ProjectsList>
        </PageContainer>
    );
};

export default HomePage;

export const getStaticProps = async () => {
    const client = graphcmsClient();

    const data = await client.request(homePageQuery);

    return {
        props: {
            allProjects: data.projects,
        },
        revalidate: 60 * 60,
    };
};
