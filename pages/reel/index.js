import { graphcmsClient } from '@/lib/_client';
import { reelPageQuery } from '@/lib/_queries';

import Hero from '@/components/Shared/Hero';
import Video from '@/components/Shared/Video';
import PageContainer from '@/components/Shared/PageContainer';

export default function ReelPage({ reel }) {
    return (
        <>
            <PageContainer
                metaTitle="Reel"
                metaDescription="Video reel de la realizadora y artista visual Cristina Galán"
            >
                <Hero title="Reel" />
                <div className="tw-content-container-mobile lg:tw-content-container-desktop flex flex-col items-center justify-center">
                    <Video url={reel} />
                </div>
            </PageContainer>
        </>
    );
}

export const getStaticProps = async () => {
    const client = graphcmsClient();

    const data = await client.request(reelPageQuery);

    return {
        props: {
            reel: data.about.reel,
        },
    };
};
