import { motion, AnimateSharedLayout } from 'framer-motion';

import { graphcmsClient } from '@/lib/_client';
import { aboutPageQuery } from '@/lib/_queries';
import {
    useGlobalDispatchContext,
    useGlobalStateContext,
} from '@/utils/context/global-context';

import Hero from '@/components/Shared/Hero';
import Bio from '@/components/About/Bio';
import Clients from '@/components/About/Clients';
import Accordion from '@/components/About/Accordion';
import PageContainer from '@/components/Shared/PageContainer';

export default function AboutPage({ about, achievements, clients }) {
    const dispatch = useGlobalDispatchContext();
    const { cursorStyles } = useGlobalStateContext();

    const onCursor = (cursorType) => {
        cursorType = (cursorStyles.includes(cursorType) && cursorType) || false;
        dispatch({ type: 'CURSOR_TYPE', cursorType: cursorType });
    };

    return (
        <>
            <PageContainer
                metaTitle="Hola"
                metaDescription="Vida y obra de la realizadora y artista visual Cristina Galán"
            >
                <motion.article initial="initial" animate="animate" exit="exit">
                    <Hero title="Hola" />

                    <Bio about={about} />

                    <AnimateSharedLayout>
                        <motion.ul
                            className="mx-auto mt-24 flex max-w-5xl flex-col gap-y-12 lg:gap-y-20"
                            layout
                        >
                            {achievements.map((achievement, idx) => (
                                <Accordion
                                    key={achievement.id}
                                    table={achievement}
                                    onCursor={onCursor}
                                    index={idx}
                                />
                            ))}

                            <Clients clients={clients} onCursor={onCursor} />
                        </motion.ul>
                    </AnimateSharedLayout>
                </motion.article>
            </PageContainer>
        </>
    );
}

export const getStaticProps = async () => {
    const client = graphcmsClient();
    const data = await client.request(aboutPageQuery);

    return {
        props: {
            about: data.about,
            achievements: data.achievements,
            clients: data.clientPortfolio.client,
        },
    };
};
