import ExpoCard from '@/components/Expo/Card';

export default function List({ expos, onCursor }) {
    return (
        <section className="flex flex-col">
            <ul className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-2 xl:gap-x-8">
                {expos.map((expo) => (
                    <ExpoCard key={expo.id} expo={expo} onCursor={onCursor} />
                ))}
            </ul>
        </section>
    );
}
