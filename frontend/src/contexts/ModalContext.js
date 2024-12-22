import React, { createContext, useReducer, useContext } from 'react';
import { modalReducer, initialState } from 'src/reducers/modalReducer';

const ModalStateContext = createContext();
const ModalDispatchContext = createContext();

export const ModalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(modalReducer, initialState);

  return (
    <ModalStateContext.Provider value={state}>
      <ModalDispatchContext.Provider value={dispatch}>
        {children}
      </ModalDispatchContext.Provider>
    </ModalStateContext.Provider>
  );
};

export const useModalState = () => useContext(ModalStateContext);
export const useModalDispatch = () => useContext(ModalDispatchContext);
