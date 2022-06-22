import Link from 'next/link';
import PageContainer from '@/components/Shared/PageContainer';

export default function NotFound() {
    return (
        <PageContainer
            metaTitle="404"
            metaDescription="Error, página no encontrada"
        >
            <h1>404: Esta página no ha sido encontrada.</h1>
            <p>
                <Link href="/">
                    <a>Volver al incio.</a>
                </Link>
            </p>
        </PageContainer>
    );
}
