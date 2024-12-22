// modalReducer.js
export const initialState = {
  isOpen: false,
  data: {},
  callback: null,
  toast: {
    message: '',
  },
  content: {},
  error: '',
};

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';
export const CALLBACK_MODAL = 'CALLBACK_MODAL';
export const TOAST_MODAL = 'TOAST_MODAL';
export const CONTENT_MODAL = 'CONTENT_MODAL';
export const ERROR_MODAL = 'ERROR_MODAL';

export const modalReducer = (state, action) => {
  switch (action.type) {
    case OPEN_MODAL:
      state.toast = {
        message: ''
      }
      state.isOpen = true
      return { ...state };
    case CLOSE_MODAL:
      state = {
        ...initialState,
        isOpen: false,
      }
      return { ...state };
    case CALLBACK_MODAL:
      state.callback = action.callback
      return { ...state };
    case TOAST_MODAL:
      state.toast = action.toast
      return { ...state };
    case CONTENT_MODAL:
      state.content = action.content
      return { ...state };
    case ERROR_MODAL:
      state.error = action.error;
      return { ...state }
    default:
      state.data = action.data;
      return { ...state };
  }
};

export const openModal = () => ({
  type: OPEN_MODAL,
});

export const closeModal = () => ({
  type: CLOSE_MODAL,
});