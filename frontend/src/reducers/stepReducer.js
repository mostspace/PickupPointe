const initialState = {
    activeTab: 'shopper',
    steps: {
      shopper: 0,
      vendor: 0,
    },
  };
  
  const stepReducer = (state, action) => {
    switch (action.type) {
      case 'SET_STEP':
        return {
          ...state,
          steps: {
            ...state.steps,
            [action.payload.role]: action.payload.step,
          },
        };
      case 'SET_TAB':
        return {
          ...state,
          activeTab: action.payload,
        };
      default:
        return state;
    }
  };
  
  export { initialState, stepReducer };
  