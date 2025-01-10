export const GeneralReducer = (state, action) => {
  // The switch statement is checking the type of action that is being passed in
  switch (action.type) {
    case "set_current_path":
      return {
        ...state,
        current_path: action.value,
      };

    case "set_current_name":
      return {
        ...state,
        current_name: action.value,
      };

    case "set_root_path":
      return {
        ...state,
        root_path: action.value,
      };

    //Return the state if the action type is not found
    default:
      return state;
  }
};
