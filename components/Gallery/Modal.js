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
                className="fixed z-10 inset-0 overflow-y-auto"
                onClose={setIsModalOpen}
            >
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onMouseEnter={() => onCursor('tw-hovered')}
                            onMouseLeave={onCursor}
                        />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="hidden sm:inline-block sm:align-middle sm:h-screen"
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
                        <div className="h-80v sm:h-90v inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-sm sm:max-w-5xl w-full sm:p-6">
                            <div className="z-20 block absolute top-0 right-0 pt-2 pr-2">
                                <button
                                    type="button"
                                    className="bg-white rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-500 focus:outline-none"
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

                            <div className="w-full h-full relative sm:flex sm:items-start">
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
