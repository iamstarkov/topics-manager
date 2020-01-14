import { createStore, /* combineReducers, */ applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
// import * as ducks from "../ducks";

// const rootReducer = combineReducers({
//   ...ducks.theme.reducer
// });

export function initStore() {
  return createStore(
    //    rootReducer,
    () => ({}),
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
}
