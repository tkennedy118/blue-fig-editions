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
  CLEAR
} from "./actions";

const StoreContext = createContext();
const { Provider } = StoreContext;

const reducer = (state, action) => {

  switch (action.type) {
    // LOGIN/LOGOUT/LOADING ===================================================
    case LOGIN:
      return {
        ...state,
        isLoggedIn: true,
        loading: false
      };

    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        loading: false,
      };
    
    case LOADING:
      return {
        ...state,
        loading: true
      };

    // CRUD OPERATIONS ========================================================
    case ADD_PRINT:
      return {
        ...state,
        prints: [action.print, ...state.prints],
        loading: false
      };

    case SET_CURRENT_PRINT:
      return {
        ...state,
        currentPrint: action.print,
        loading: false
      };

    case UPDATE_PRINT:
      return {
        ...state,
        prints: [...action.prints],
        loading: false
      };

    case REMOVE_PRINT:
      return {
        ...state,
        prints: state.prints.filter(print => {
          return print._id !== action._id;
        })
      };
    
    // SHOPPING CART ==========================================================
    case ADD_ITEM: 
      return {
        ...state,
        cart: [action.item, ...state.cart],
        loading: false
      };

    case REMOVE_ITEM:
      return {
        ...state,
        cart: [ ...state.cart.filter(item => item._id !== action._id)],
        loading: false
      };

    case CLEAR:
      return {
        ...state,
        cart: [{}],
        loading: false
      };

    default:
      return state;
  }
};

const StoreProvider = ({ valu = [], ...props }) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoggedIn: false,
    prints: [],
    currentPrint: {
      _id: 0,
      name: '',
      series: '',
      description: '',
      price: 0,
      count: 0
    },
    cart: [{}],
    loading: false
  });

  return <Provider value={[state, dispatch]} {...props} />;
};

const useStoreContext = () => {
  return useContext(StoreContext);
}

export { StoreProvider, useStoreContext };