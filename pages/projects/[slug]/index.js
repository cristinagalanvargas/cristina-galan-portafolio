import { motion } from 'framer-motion';

import {
    useGlobalStateContext,
    useGlobalDispatchContext,
} from '@/utils/context/global-context';
import { parentVariants } from '@/utils/framer';
import { graphcmsClient } from '@/lib/_client';
import { homePageQuery, singleProjectPageQuery } from '@/lib/_queries';

import Hero from '@/components/Project/Hero';
import Info from '@/components/Project/Info';
import Summary from '@/components/Project/Summary';
import Team from '@/components/Project/Team';
import Gallery from '@/components/Gallery';
import Video from '@/components/Shared/Video';
import PageContainer from '@/components/Shared/PageContainer';

export default function ProjectPage({ project }) {
    return (
        <>
            <PageContainer
                metaTitle={project.name}
                metaDescription={project.description}
            >
                <Hero project={project} />

                <motion.section
                    className="flex flex-col md:flex-row mt-6 md:mt-10 lg:mt-10 max-w-7xl mx-auto md:gap-x-12 gap-y-12"
                    variants={parentVariants}
                >
                    <Summary description={project.description} />
                    <Info project={project} />
                    <Team role={project.role} team={project.team} />
                </motion.section>

                <Gallery images={project?.gallery?.images} />

                <Video url={project.video} />
            </PageContainer>
        </>
    );
}

export const getStaticProps = async ({ params }) => {
    const slug = params.slug;
    const client = graphcmsClient();

    const data = await client.request(singleProjectPageQuery, { slug });

    return {
        props: {
            project: data.project,
        },
    };
};

export const getStaticPaths = async () => {
    const client = graphcmsClient();

    const data = await client.request(homePageQuery);
    return {
        paths: data.projects.map((project) => {
            return {
                params: {
                    slug: project.slug,
                },
            };
        }),
        fallback: false,
    };
};
