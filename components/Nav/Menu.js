import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';

import { menuVariants } from '@/utils/framer';
import { navLinks } from '@/data/navigation';

import Links from '@/components/Nav/Links';

export default function Menu({ toggleMenu, setToggleMenu, onCursor, x, y }) {
    return (
        <AnimatePresence>
            {toggleMenu && (
                <>
                    <motion.main
                        className="fixed top-0 left-0 z-100 flex h-screen w-screen flex-col justify-center overflow-hidden bg-black px-5 dark:bg-white"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        custom={toggleMenu}
                        variants={menuVariants}
                    >
                        <header className="fixed top-0 right-0 flex h-20 items-center justify-between px-5 py-10">
                            <div onClick={() => setToggleMenu(!toggleMenu)}>
                                <button className="tw-link origin-center border-none bg-none text-white focus:outline-none dark:text-black">
                                    <AiOutlineClose className="tw-icon" />
                                </button>
                            </div>
                        </header>

                        <ul className="flex h-2/3 flex-col justify-center gap-y-12">
                            {navLinks.map((menuItem) => (
                                <Links
                                    key={menuItem.id}
                                    title={menuItem.title}
                                    thumbnailPosition={
                                        menuItem.thumbnailPosition
                                    }
                                    src={menuItem.src}
                                    id={menuItem.id}
                                    x={x}
                                    y={y}
                                    onCursor={onCursor}
                                    toggleMenu={toggleMenu}
                                    setToggleMenu={setToggleMenu}
                                />
                            ))}
                        </ul>
                    </motion.main>
                </>
            )}
        </AnimatePresence>
    );
}
