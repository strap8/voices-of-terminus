import C from "../../constants.js";

const defaultState = {
  author: null,
  author_username: null,
  tags: null,
  title: null,
  html: null
};

export const HtmlDocument = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case C.GET_HTML_DOCUMENT:
      return payload;
    case C.CLEAR_HTML_DOCUMENT:
      return defaultState;
    case C.RESET_REDUX:
      return defaultState;
    default:
      return state;
  }
};
