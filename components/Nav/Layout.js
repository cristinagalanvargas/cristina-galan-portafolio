import { useState, useEffect } from 'react';

import {
    useGlobalStateContext,
    useGlobalDispatchContext,
} from '@/utils/context/global-context';
import { WEB_NAME } from '@/utils/constants';

import Cursor from '@/components/Shared/Cursor';
import Menu from '@/components/Nav/Menu';
import Header from '@/components/Nav/Header';
import Footer from '@/components/Nav/Footer';

export default function Layout({ children }) {
    const dispatch = useGlobalDispatchContext();
    const { currentTheme, cursorStyles } = useGlobalStateContext();

    const [toggleMenu, setToggleMenu] = useState(false);

    const onCursor = (cursorType) => {
        cursorType = (cursorStyles.includes(cursorType) && cursorType) || false;
        dispatch({ type: 'CURSOR_TYPE', cursorType: cursorType });
    };

    useEffect(() => {
        if (currentTheme === 'dark') {
            document.querySelector('html').classList.add('dark');
        } else {
            document.querySelector('html').classList.remove('dark');
        }
    }, [currentTheme]);

    useEffect(() => {
        toggleMenu === true
            ? document.querySelector('html').classList.add('body-lock')
            : document.querySelector('html').classList.remove('body-lock');
    }, [toggleMenu]);

    return (
        <>
            <div className="min-h-screen">
                <Cursor toggleMenu={toggleMenu} />
                <Header
                    siteTitle={WEB_NAME}
                    onCursor={onCursor}
                    toggleMenu={toggleMenu}
                    setToggleMenu={setToggleMenu}
                />
                <Menu
                    onCursor={onCursor}
                    toggleMenu={toggleMenu}
                    setToggleMenu={setToggleMenu}
                />
                <main className="max-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {children}
                </main>
                <Footer onCursor={onCursor} />
            </div>
        </>
    );
}
