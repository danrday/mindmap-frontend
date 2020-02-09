import { combineReducers } from "redux";
import simpleReducer from "./simpleReducer";
import liveNodeEdit from "./liveNodeEdit";
import categoryEdit from "./categoryEdit";
import globalEdit from "./globalEdit";
export default combineReducers({
  simpleReducer,
  liveNodeEdit,
  categoryEdit,
  globalEdit
});
