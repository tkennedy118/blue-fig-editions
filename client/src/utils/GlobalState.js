import React, { createContext, useReducer, useContext } from "react";
import {
  LOGIN,
  LOGOUT,
  LOADING,
  ADD_PRINT,
  UPDATE_PRINTS,
  REMOVE_PRINT,
  SET_CURRENT_PRINT,
  ADD_ITEM,
  REMOVE_ITEM,
  CLEAR,
  UPDATE_FEATURED_PRINTS,
  UPDATE_ADDRESS,
  UPDATE_SHIPPING
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
        isAdmin: action.isAdmin,
        user: {
          _id: action._id,
          stripe_id: action.stripe_id,
          email: action.email
        },
        loading: false
      };

    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        isAdmin: false,
        customer: {
          _id: null,
          stripe_id: null,
          email: null
        },
        loading: false,
      };
    
    case LOADING:
      return {
        ...state,
        loading: !state.loading
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

    case UPDATE_PRINTS:
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
        }),
        featured: state.featured.filter(print => {
          return print._id !== action._id;
        }),
        loading: false
      };

    // FEATURED PRINT =========================================================
    case UPDATE_FEATURED_PRINTS:
      return {
        ...state,
        featured: [...action.prints],
        loading: false
      };

    // ADDRESS INFORMATION ====================================================
    case UPDATE_ADDRESS:
      return {
        ...state,
        address: { ...action.address },
        loading: false
      };
    
    // SHIPPING INFORMATION ===================================================
    case UPDATE_SHIPPING:
      return {
        ...state,
        shipping: { ...action.shipping },
        loading: false
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
        cart: [ ...state.cart.filter(id => id !== action._id)],
        loading: false
      };

    case CLEAR:
      return {
        ...state,
        cart: [],
        loading: false
      };

    default:
      return state;
  }
};

const StoreProvider = ({ valu = [], ...props }) => {

  const [state, dispatch] = useReducer(reducer, {
    isLoggedIn: false,
    isAdmin: false,
    user: {
      _id: null,
      stripe_id: null,
      email: null
    },
    prints: [],
    featured: [],
    currentPrint: {
      _id: 0,
      name: '',
      series: '',
      description: '',
      price: 0,
      count: 0
    },
    cart: JSON.parse(localStorage.getItem('bfg-cart')) || [],
    loading: false,
    address: {
      name: '',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    shipping: {
      shipment_id: '',
      rate_id: ''
    },
  });

  return <Provider value={[state, dispatch]} {...props} />;
};

const useStoreContext = () => {
  return useContext(StoreContext);
}

export { StoreProvider, useStoreContext };
