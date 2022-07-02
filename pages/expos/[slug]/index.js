import { graphcmsClient } from '@/lib/_client';
import { exposPageQuery, singleExpoPageQuery } from '@/lib/_queries';
import {
    useGlobalStateContext,
    useGlobalDispatchContext,
} from '@/utils/context/global-context';

import Hero from '@/components/Expo/Hero';
import Video from '@/components/Shared/Video';
import Gallery from '@/components/Gallery';
import PageContainer from '@/components/Shared/PageContainer';

export default function ExpoPage({ expo }) {
    const dispatch = useGlobalDispatchContext();
    const { cursorStyles } = useGlobalStateContext();

    const onCursor = (cursorType) => {
        cursorType = (cursorStyles.includes(cursorType) && cursorType) || false;

        dispatch({ type: 'CURSOR_TYPE', cursorType: cursorType });
    };

    return (
        <>
            <PageContainer
                metaTitle={expo.name}
                metaDescription={expo.description}
            >
                <Hero expo={expo} onCursor={onCursor} />

                <Video url={expo.video} />

                <Gallery alt={expo.name} images={expo?.gallery?.images} />
            </PageContainer>
        </>
    );
}

export const getStaticProps = async ({ params }) => {
    const slug = params.slug;

    const client = graphcmsClient();

    const data = await client.request(singleExpoPageQuery, { slug });

    if (!data.expo) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            expo: data.expo,
            revalidate: 60 * 60,
        },
    };
};

export const getStaticPaths = async () => {
    const client = graphcmsClient();

    const data = await client.request(exposPageQuery);
    return {
        paths: data.expos.map((expo) => {
            return {
                params: {
                    slug: expo.slug,
                },
            };
        }),
        fallback: false,
    };
};
