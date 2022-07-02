import { Fragment } from 'react';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

export default function Modal({
    images,
    alt,
    selected,
    isModalOpen,
    setIsModalOpen,
    onCursor,
}) {
    return (
        <Transition.Root show={isModalOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                onClose={setIsModalOpen}
            >
                <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay
                            className="fixed inset-0 bg-neutral-500 bg-opacity-75 transition-opacity"
                            onMouseEnter={() => onCursor('tw-hovered')}
                            onMouseLeave={onCursor}
                        />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="hidden sm:inline-block sm:h-screen sm:align-middle"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block h-80v w-full max-w-sm transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:h-90v sm:max-w-5xl sm:p-6 sm:align-middle">
                            <div className="absolute top-0 right-0 z-20 block pt-2 pr-2">
                                <button
                                    type="button"
                                    className="rounded-md bg-white text-neutral-700 hover:text-neutral-500 focus:outline-none dark:text-neutral-300"
                                    onMouseEnter={() => onCursor('tw-hovered')}
                                    onMouseLeave={onCursor}
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    <span className="sr-only">Close</span>
                                    <XIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>

                            <div className="relative h-full w-full sm:flex sm:items-start">
                                {isModalOpen && (
                                    <Image
                                        src={images[selected].url}
                                        alt={alt}
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                )}
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
