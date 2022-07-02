import { graphcmsClient } from '@/lib/_client';
import { contactPageQuery } from '@/lib/_queries';

import {
    useGlobalStateContext,
    useGlobalDispatchContext,
} from '@/utils/context/global-context';

import Hero from '@/components/Shared/Hero';
import CTA from '@/components/Contact/CTA';
import Links from '@/components/Contact/Links';
import PageContainer from '@/components/Shared/PageContainer';

export default function ContactPage({ contacts }) {
    const dispatch = useGlobalDispatchContext();
    const { cursorStyles } = useGlobalStateContext();

    const onCursor = (cursorType) => {
        cursorType = (cursorStyles.includes(cursorType) && cursorType) || false;
        dispatch({ type: 'CURSOR_TYPE', cursorType: cursorType });
    };

    return (
        <>
            <PageContainer
                metaTitle="Contacto"
                metaDescription="Información de contacto de la realizadora y fotógrafa Cristina Galán"
            >
                <Hero title="Contacto" />
                <div className="tw-content-container-mobile lg:tw-content-container-desktop mx-auto flex max-w-5xl flex-col items-center justify-center gap-y-8 sm:gap-y-16">
                    <CTA>
                        Si tienes alguna propuesta,
                        <br /> me encantaría escucharla.
                    </CTA>
                    <Links contacts={contacts} onCursor={onCursor} />
                </div>
            </PageContainer>
        </>
    );
}

export const getStaticProps = async () => {
    const client = graphcmsClient();
    const data = await client.request(contactPageQuery);

    return {
        props: {
            contacts: data.contact.info,
        },
    };
};
