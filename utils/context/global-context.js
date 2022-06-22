import { createContext, useContext, useReducer } from 'react';

const GlobalStateContext = createContext();
const GlobalDispatchContext = createContext();

const initialState = {
    currentTheme: 'light',
    cursorType: false,
    cursorStyles: ['tw-pointer', 'tw-hovered'],
};

const globalReducer = (state, action) => {
    switch (action.type) {
        case 'TOGGLE_THEME': {
            return {
                ...state,
                currentTheme: action.theme,
            };
        }
        case 'CURSOR_TYPE': {
            return {
                ...state,
                cursorType: action.cursorType,
            };
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
};

export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(globalReducer, initialState);

    return (
        <GlobalDispatchContext.Provider value={dispatch}>
            <GlobalStateContext.Provider value={state}>
                {children}
            </GlobalStateContext.Provider>
        </GlobalDispatchContext.Provider>
    );
};

export const useGlobalStateContext = () => useContext(GlobalStateContext);

export const useGlobalDispatchContext = () => useContext(GlobalDispatchContext);
