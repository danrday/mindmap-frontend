import { combineReducers } from "redux";
import document from "./document";
import liveNodeEdit from "./liveNodeEdit";
import categoryEdit from "./categoryEdit";
import globalEdit from "./globalEdit";
import ui from "./ui";
import toDo from "./toDo";
export default combineReducers({
  document,
  liveNodeEdit,
  categoryEdit,
  globalEdit,
  ui,
  toDo
});
