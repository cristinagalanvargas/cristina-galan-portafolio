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
                <Hero title="Reel" />
                <div className="w-full tw-content-container-mobile lg:tw-content-container-desktop flex flex-col justify-center items-center space-y-8 sm:space-y-12">
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
