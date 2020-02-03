import { combineReducers } from "redux";
import simpleReducer from "./simpleReducer";
import liveNodeEdit from "./liveNodeEdit";
import categoryEdit from "./categoryEdit";
export default combineReducers({
  simpleReducer,
  liveNodeEdit,
  categoryEdit
});
