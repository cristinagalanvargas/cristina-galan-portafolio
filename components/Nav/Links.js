import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Links({ title, id, toggleMenu, setToggleMenu }) {
    return (
        <motion.li
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={() => setToggleMenu(!toggleMenu)}
        >
            <Link href={`/${id}`}>
                <a className="h-full">
                    <div className="flex h-full w-full">
                        <motion.h2 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase text-white dark:text-black font-serif">
                            {title}
                        </motion.h2>
                    </div>
                </a>
            </Link>
        </motion.li>
    );
}
