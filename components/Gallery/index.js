import Image from 'next/image';

export default function Gallery({ images, alt }) {
    return (
        <>
            {images && (
                <section className="tw-section-separator">
                    <ul
                        role="list"
                        className="columns-1 md:columns-2 lg:columns-3"
                    >
                        {images.map((image, idx) => (
                            <li key={image.id} className="mb-4">
                                <div className="group block w-full bg-transparent overflow-hidden">
                                    <div className="flex flex-col justify-center">
                                        <Image
                                            key={idx}
                                            src={image.url}
                                            alt={alt}
                                            layout="responsive"
                                            objectFit="contain"
                                            width={image.width}
                                            height={image.height}
                                        />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </>
    );
}
