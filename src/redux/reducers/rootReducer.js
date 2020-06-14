import { combineReducers } from "redux";
import undoable from "redux-undo";

import document from "./document";
import liveNodeEdit from "./liveNodeEdit";
import liveLinkEdit from "./liveLinkEdit";
import categoryEdit from "./categoryEdit";
import globalEdit from "./globalEdit";
import ui from "./ui";
import user from "./user";
export default combineReducers({
  document: undoable(document),
  liveNodeEdit,
  liveLinkEdit,
  categoryEdit,
  globalEdit,
  ui,
  user
});
