import { combineReducers } from "redux";

import authReducer from "./AuthReducer";
import chatReducer from "./ChatReducer";

export const reducers = combineReducers({authReducer, chatReducer})