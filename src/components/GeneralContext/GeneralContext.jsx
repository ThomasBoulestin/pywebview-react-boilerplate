import { createContext } from "react";
import { GeneralReducer } from "./GeneralReducer";
import { useReducer } from "react";

export const GeneralContext = createContext();

export const GeneralState = ({ children }) => {
  //   Initial State of the cart
  const initialState = {
    current_path: "",
    current_name: "",
    root_path: "",
  };

  //Set up the reducer
  const [state, dispatch] = useReducer(GeneralReducer, initialState);

  return (
    //Add the functions that have been defined above into the Context provider, and pass on to the children
    <GeneralContext.Provider
      value={{
        dispatch: dispatch,
        ...state,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};
