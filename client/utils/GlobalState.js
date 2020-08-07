import React, { createContext, useReducer, useContext } from "react";
import {
  LOGIN,
  LOGOUT,
  LOADING,
  ADD_PRINT,
  UPDATE_PRINT,
  REMOVE_PRINT,
  SET_CURRENT_PRINT,
  ADD_ITEM,
  REMOVE_ITEM,
  INCREASE,
  DECREASE,
  CHECKOUT,
  CLEAR
} from "./actions";

const StoreContext = createContext();
const { Provider } = StoreContext;

const reducer = (state, action) => {

  switch (action.type) {

    default:
      return state;
  }
};

const StoreProvider = ({ valu = [], ...props }) => {
  const [state, dispatch] = useReducer(reducer, {

  });

  return <Provider value={[state, dispatch]} {...props} />;
};

const useStoreContext = () => {
  return useContext(StoreContext);
}

export { StoreProvider, useStoreContext };
