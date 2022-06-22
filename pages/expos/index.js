import {
    useGlobalStateContext,
    useGlobalDispatchContext,
} from '@/utils/context/global-context';
import { graphcmsClient } from '@/lib/_client';
import { exposPageQuery } from '@/lib/_queries';

import Hero from '@/components/Shared/Hero';
import List from '@/components/Expo/List';
import PageContainer from '@/components/Shared/PageContainer';

export default function ExposPage({ expos }) {
    const dispatch = useGlobalDispatchContext();
    const { cursorStyles } = useGlobalStateContext();

    const onCursor = (cursorType) => {
        cursorType = (cursorStyles.includes(cursorType) && cursorType) || false;

        dispatch({ type: 'CURSOR_TYPE', cursorType: cursorType });
    };

    return (
        <>
            <PageContainer
                metaTitle="Expos"
                metaDescription="Exposiciones en las que se han presentado las obras de Cristina Galán"
            >
                <Hero text="Expos" onCursor={onCursor} />

                <List expos={expos} onCursor={onCursor} />
            </PageContainer>
        </>
    );
}

export const getStaticProps = async () => {
    const client = graphcmsClient();

    const data = await client.request(exposPageQuery);

    return {
        props: {
            expos: data.expos,
        },
    };
};
