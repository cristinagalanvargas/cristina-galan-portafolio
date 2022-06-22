import { useEffect } from 'react';
import Link from 'next/link';
import { setCookie } from 'nookies';
import { motion } from 'framer-motion';
import { AiOutlineMenu } from 'react-icons/ai';

import {
    useGlobalDispatchContext,
    useGlobalStateContext,
} from '@/utils/context/global-context';
import { parentVariants, headerVariants } from '@/utils/framer';
import { navLinks } from '@/data/navigation';

import ActiveLink from '@/components/Nav/ActiveLink';

export default function Header({ onCursor, toggleMenu, setToggleMenu }) {
    const dispatch = useGlobalDispatchContext();
    const { currentTheme } = useGlobalStateContext();

    const toggleTheme = () => {
        if (currentTheme === 'dark') {
            dispatch({ type: 'TOGGLE_THEME', theme: 'light' });
        } else {
            dispatch({ type: 'TOGGLE_THEME', theme: 'dark' });
        }
    };

    useEffect(() => {
        setCookie(null, 'theme', currentTheme, {
            maxAge: 30 * 24 * 60 * 60,
        });
    }, [currentTheme]);

    return (
        <motion.header
            className="absolute top-0 right-0 left-0 z-99 flex justify-between items-center h-20 lg:h-28 max-w-7xl mx-auto px-4 sm:px-6"
            variants={parentVariants}
            initial="initial"
            animate="animate"
        >
            <motion.div
                className="flex items-center space-x-4 lg:space-x-6"
                variants={headerVariants}
            >
                <Link href="/">
                    <a
                        className="tw-link text-lg md:text-xl lg:text-xl"
                        onMouseEnter={() => onCursor('tw-hovered')}
                        onMouseLeave={onCursor}
                    >
                        C
                    </a>
                </Link>

                <span
                    className="inline-block h-3 w-3 lg:h-5 lg:w-5 rounded-full bg-red-400 hover:bg-black dark:hover:bg-white tw-transition"
                    onClick={toggleTheme}
                    onMouseEnter={() => onCursor('tw-pointer')}
                    onMouseLeave={onCursor}
                ></span>

                <Link href="/">
                    <a
                        className="tw-link text-lg md:text-xl lg:text-xl"
                        onMouseEnter={() => onCursor('tw-hovered')}
                        onMouseLeave={onCursor}
                    >
                        G
                    </a>
                </Link>
            </motion.div>

            <motion.div
                className="block lg:hidden"
                onClick={() => setToggleMenu(!toggleMenu)}
                onMouseEnter={() => onCursor('tw-hovered')}
                onMouseLeave={onCursor}
                variants={headerVariants}
            >
                <button className="border-none bg-none outline-none ring-0 focus:outline-none tw-link">
                    <AiOutlineMenu className="w-6 h-6 md:w-8 md:h-8" />
                </button>
            </motion.div>

            <motion.div className="hidden lg:block" variants={headerVariants}>
                <ul className="flex lg:space-x-14 2x:space-x-16">
                    {navLinks &&
                        navLinks.map((link, index) => (
                            <li
                                key={index}
                                onMouseEnter={() => onCursor('tw-hovered')}
                                onMouseLeave={onCursor}
                            >
                                <ActiveLink href={`/${link.id}`}>
                                    <a className="tw-link text-lg lg:text-xl">
                                        {link.title}
                                    </a>
                                </ActiveLink>
                            </li>
                        ))}
                </ul>
            </motion.div>
        </motion.header>
    );
}
