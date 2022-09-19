import Link from 'next/link';
import {} from 'react-icons/';

import {
    useGlobalStateContext,
    useGlobalDispatchContext,
} from '@/utils/context/global-context';

import PageContainer from '@/components/Shared/PageContainer';

export default function ErrorPage() {
    const dispatch = useGlobalDispatchContext();
    const { cursorStyles } = useGlobalStateContext();

    const onCursor = (cursorType) => {
        cursorType = (cursorStyles.includes(cursorType) && cursorType) || false;
        dispatch({ type: 'CURSOR_TYPE', cursorType: cursorType });
    };

    return (
        <PageContainer
            metaTitle="404"
            metaDescription="Error, página no encontrada"
        >
            <div className="tw-content-container-mobile lg:tw-content-container-desktop flex flex-col items-center justify-center">
                <h1 className="text-7xl font-bold md:text-8xl lg:text-9xl">
                    404
                </h1>
                <h2 className="tw-paragraph text-center text-2xl md:text-3xl lg:text-4xl">
                    Esta página no ha sido encontrada.
                </h2>
                <button
                    onMouseEnter={() => onCursor('tw-hovered')}
                    onMouseLeave={onCursor}
                    className="mt-8 md:mt-10 lg:mt-12"
                >
                    <Link href="/">
                        <a className="tw-link text-sm uppercase lg:text-lg">
                            Volver al inicio
                        </a>
                    </Link>
                </button>
            </div>
        </PageContainer>
    );
}
