import { socialLinks } from '@/data/navigation';

export default function Footer({ onCursor }) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();

    return (
        <footer className="pt-12 sm:pt-24">
            <div className="mx-auto max-w-7xl border-t border-neutral-300 py-12 px-4 dark:border-neutral-700 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center space-x-6 md:order-2">
                    {socialLinks.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            target="_blank"
                            rel="noreferrer"
                            className="tw-link"
                            onMouseEnter={() => onCursor('tw-hovered')}
                            onMouseLeave={onCursor}
                        >
                            <span className="sr-only">{item.name}</span>
                            <item.icon className="h-6 w-6" aria-hidden="true" />
                        </a>
                    ))}
                </div>
                <div className="mt-8 md:order-1 md:mt-0">
                    <p className="text-center text-xs text-neutral-500 md:text-base">
                        &copy; {year} Cristina Galán. Todos los derechos
                        reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
