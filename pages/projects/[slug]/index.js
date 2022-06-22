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
import Content from '@/components/Project/Content';
import Team from '@/components/Project/Team';
import Gallery from '@/components/Gallery';
import Video from '@/components/Shared/Video';
import PageContainer from '@/components/Shared/PageContainer';

export default function ProjectPage({ project }) {
    const dispatch = useGlobalDispatchContext();
    const { cursorStyles } = useGlobalStateContext();

    const onCursor = (cursorType) => {
        cursorType = (cursorStyles.includes(cursorType) && cursorType) || false;

        dispatch({ type: 'CURSOR_TYPE', cursorType: cursorType });
    };

    return (
        <>
            <PageContainer
                metaTitle={project.name}
                metaDescription={project.description}
            >
                <Hero project={project} />

                <motion.section
                    className="grid grid-cols-7 gap-x-0 md:gap-x-2 lg:gap-x-12 gap-y-10 md:gap-y-12 mt-6 md:mt-10 lg:mt-10"
                    variants={parentVariants}
                >
                    <Content description={project.description} />
                    <Info
                        project={project}
                        agency={project.agency}
                        client={project.client}
                    />
                    <Team role={project.role} team={project.team} />
                </motion.section>

                <Gallery
                    images={project?.gallery?.images}
                    onCursor={onCursor}
                />

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
