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
            className="absolute top-0 right-0 left-0 z-99 mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-28"
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
                    className="tw-transition inline-block h-3 w-3 rounded-full bg-red-400 hover:bg-black dark:hover:bg-white lg:h-5 lg:w-5"
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
                <button className="tw-link border-none bg-none outline-none ring-0 focus:outline-none">
                    <AiOutlineMenu className="h-6 w-6 md:h-8 md:w-8" />
                </button>
            </motion.div>

            <motion.div className="hidden lg:block" variants={headerVariants}>
                <ul className="2x:space-x-16 flex lg:space-x-14">
                    {navLinks &&
                        navLinks.map((link, index) => (
                            <li
                                key={index}
                                onMouseEnter={() => onCursor('tw-hovered')}
                                onMouseLeave={onCursor}
                            >
                                <ActiveLink href={`/${link.id}`}>
                                    <a className="tw-link text-base uppercase lg:text-lg">
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
