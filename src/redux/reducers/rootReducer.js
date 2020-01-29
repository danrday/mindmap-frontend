import { combineReducers } from "redux";
import simpleReducer from "./simpleReducer";
import liveNodeEdit from "./liveNodeEdit";
export default combineReducers({
  simpleReducer,
  liveNodeEdit
});
