import uuidv4 from "uuid/v4";

const initialState = {
  fetching: false,
  error: null,
  editedFile: {
    globalSettings: {
      text: {},
      defaults: {
        linkThickness: 5,
        bgColor: "powderblue",
        fontSize: 30,
        goToEditNodePageWhenNodeIsClicked: true,
        linkDistance: 300,
        nodeColor: "blue",
        nodeHoverColor: "green",
        radius: 30,
        sideMenuOpenOnInit: true
      }
    }
  },
  loaded: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "file/FETCH_FILE_ERROR":
      return { ...state, error: action.payload, fetching: false };
    // case "file/UPDATE_FILE":
    //   return { ...state, file: action.payload };
    case "file/FETCH_FILE":
      return { ...state, fetching: true };
    case "DELETE_ACTION": {
      const filteredLinks = state.editedFile.links.filter(link => {
        return (
          link.source.id !== action.payload && link.target.id !== action.payload
        );
      });

      /*      THIS IS DONE IN A MUTABLE STYLE HERE BECAUSE
      D3 FORCE KEEPS TRACK OF THE NODES OBJECT REFERENCE*/
      const filteredNodes = Object.assign([], state.editedFile.nodes);
      filteredNodes.forEach((node, i) => {
        if (node.id === action.payload) {
          filteredNodes.splice(i, 1);
        }
      });

      let updatedFile = Object.assign({}, state.editedFile);

      updatedFile.nodes = filteredNodes;
      updatedFile.links = filteredLinks;

      return { ...state, editedFile: updatedFile };
    }
    case "file/FETCH_FILE_RECEIVED": {
      let payload = action.payload;

      payload.globalSettings.defaults = Object.assign(
        state.editedFile.globalSettings.defaults,
        payload.globalSettings.defaults
      );

      let defaults = {
        text: {}
      };
      let edited = Object.assign(defaults, payload);

      return {
        ...state,
        editedFile: edited,
        fetching: false,
        loaded: true
      };
    }
    case "HANDLE_ZOOM":
      let gSettings = state.editedFile.globalSettings || {};

      gSettings.zoom = action.payload;

      let updatedFile = state.editedFile;
      updatedFile.globalSettings = gSettings;

      return {
        ...state,
        editedFile: updatedFile
      };
    case "SAVE_NAME_CHANGE_ACTION":
      const edited = Object.assign({}, state.editedFile);
      const nodeEdit = edited.nodes[state.currentNode];
      nodeEdit.name = action.payload;
      edited.nodes[state.currentNode] = nodeEdit;
      return {
        ...state,
        editedFile: edited
      };
    case "SAVE_ACTION":
      return {
        ...state,
        editedFile: { ...state.editedFile, links: action.payload }
      };
    // case "HANDLE_MOUSE_MOVE":
    //   return {
    //     ...state,
    //     mouse: { coords: action.payload }
    //   };
    case "file/DRAG_NODE": {
      // const draggedNode = state.editedFile.nodes.find(e => {
      //   return e.id === action.payload.id;
      // });

      console.log("action.;alo", action.payload);

      const edited = Object.assign({}, state.editedFile);
      edited.nodes = Object.assign([], state.editedFile.nodes);
      edited.links = Object.assign([], state.editedFile.links);

      let currSelNodeIndex = edited.nodes.findIndex(e => {
        return e.id === action.payload.id;
      });

      const node = edited.nodes[currSelNodeIndex];

      edited.nodes[currSelNodeIndex] = Object.assign({}, node);

      edited.links.forEach((link, i) => {
        if (link.source.id === edited.nodes[currSelNodeIndex].id) {
          edited.links[i] = Object.assign({}, edited.links[i]);
          edited.links[i].source = edited.nodes[currSelNodeIndex];
        } else if (link.target.id === edited.nodes[currSelNodeIndex].id) {
          edited.links[i] = Object.assign({}, edited.links[i]);
          edited.links[i].target = edited.nodes[currSelNodeIndex];
        }
      });

      edited.nodes[currSelNodeIndex].fx = action.payload.fx;
      edited.nodes[currSelNodeIndex].fy = action.payload.fy;
      edited.nodes[currSelNodeIndex].sticky = action.payload.sticky;

      return {
        ...state,
        editedFile: edited
      };
    }
    case "SAVE_EDIT": {
      console.log("SAVE EDIT", action.payload);
      const { liveNodeEdit, customAttrs, globalEdit } = action.payload;
      const changes = customAttrs;
      const edited = Object.assign({}, state.editedFile);
      edited.nodes = Object.assign([], state.editedFile.nodes);
      edited.links = Object.assign([], state.editedFile.links);
      let currSelNodeIndex = edited.nodes.findIndex(e => {
        return e.id === liveNodeEdit.selNodeId;
      });
      console.log(
        "edited.nodes[currSelNodeIndex].name",
        edited.nodes[currSelNodeIndex].name
      );
      console.log("liveNodeEdit.name", liveNodeEdit.name);

      const node = edited.nodes[currSelNodeIndex];

      edited.nodes[currSelNodeIndex] = Object.assign({}, node);

      edited.nodes[currSelNodeIndex].name = liveNodeEdit.name;
      edited.nodes[currSelNodeIndex].customAttrs = {};
      if (changes.includes("newCategoryName")) {
        if (!edited.categories) {
          edited.categories = {};
        }
        edited.categories[liveNodeEdit.newCategoryName] = {};
        changes.forEach(attr => {
          edited.categories[liveNodeEdit.newCategoryName][attr] =
            liveNodeEdit[attr];
        });
        edited.categories[liveNodeEdit.newCategoryName].category =
          liveNodeEdit.newCategoryName;
        edited.nodes[currSelNodeIndex].category = liveNodeEdit.newCategoryName;
      } else {
        changes.forEach(attr => {
          if (attr === "category") {
            edited.nodes[currSelNodeIndex].category = liveNodeEdit.category;
          }
          edited.nodes[currSelNodeIndex].customAttrs[attr] = liveNodeEdit[attr];
        });
      }

      edited.globalSettings = globalEdit;

      edited.links.forEach((link, i) => {
        if (link.source.id === edited.nodes[currSelNodeIndex].id) {
          edited.links[i] = Object.assign({}, edited.links[i]);
          edited.links[i].source = edited.nodes[currSelNodeIndex];
        } else if (link.target.id === edited.nodes[currSelNodeIndex].id) {
          edited.links[i] = Object.assign({}, edited.links[i]);
          edited.links[i].target = edited.nodes[currSelNodeIndex];
        }
      });

      return {
        ...state,
        editedFile: edited
      };
    }
    case "SAVE_LINK_EDIT": {
      const { liveLinkEdit, customAttrs, globalEdit } = action.payload;
      const changes = customAttrs;
      const edited = Object.assign({}, state.editedFile);
      edited.nodes = Object.assign([], state.editedFile.nodes);
      edited.links = Object.assign([], state.editedFile.links);
      let currSelLinkIndex = edited.links.findIndex(e => {
        return e.id === liveLinkEdit.selLinkId;
      });
      console.log(
        "edited.links[currSelLinkIndex].name",
        edited.links[currSelLinkIndex].name
      );
      console.log("liveLinkEdit.name", liveLinkEdit.name);

      const link = edited.links[currSelLinkIndex];

      edited.links[currSelLinkIndex] = Object.assign({}, link);

      edited.links[currSelLinkIndex].name = liveLinkEdit.name;
      edited.links[currSelLinkIndex].customAttrs = {};
      if (changes.includes("newCategoryName")) {
        if (!edited.categories) {
          edited.categories = {};
        }
        edited.categories[liveLinkEdit.newCategoryName] = {};
        changes.forEach(attr => {
          edited.categories[liveLinkEdit.newCategoryName][attr] =
            liveLinkEdit[attr];
        });
        edited.categories[liveLinkEdit.newCategoryName].category =
          liveLinkEdit.newCategoryName;
        edited.links[currSelLinkIndex].category = liveLinkEdit.newCategoryName;
      } else {
        changes.forEach(attr => {
          if (attr === "category") {
            edited.links[currSelLinkIndex].category = liveLinkEdit.category;
          }
          edited.links[currSelLinkIndex].customAttrs[attr] = liveLinkEdit[attr];
        });
      }

      edited.globalSettings = globalEdit;

      return {
        ...state,
        editedFile: edited
      };
    }
    case "SAVE_CATEGORY_EDIT": {
      const { currentCats, currCatName, newCatName } = action.payload;

      let updated = state.editedFile;
      updated.categories = currentCats;

      updated.links.forEach(link => {
        if (link.category === currCatName) {
          link.category = newCatName;
        }
      });

      return {
        ...state,
        editedFile: updated
      };
    }

    case "SAVE_DEFAULTS_EDIT": {
      const edits = action.payload;

      let updatedFile = state.editedFile;
      updatedFile.globalSettings = edits;

      return {
        ...state,
        editedFile: updatedFile
      };
    }

    case "ADD_NODE_AT_COORDS": {
      const editedFile = Object.assign({}, state.editedFile);
      editedFile.nodes = Object.assign([], state.editedFile.nodes);

      const length = state.editedFile.nodes.length;
      const coords = action.payload.coords;

      editedFile.nodes.push({
        customAttrs: { name: null },
        id: action.payload.id,
        index: length,
        x: coords.x,
        y: coords.y,
        vy: 0,
        vx: 0,
        sticky: true,
        fx: coords.x,
        fy: coords.y
      });
      return {
        ...state,
        editedFile: editedFile
      };
    }
    case "ADD_ACTION":
      const editedFile = Object.assign({}, state.editedFile);
      editedFile.nodes = Object.assign([], state.editedFile.nodes);

      const length = state.editedFile.nodes.length;
      const zoomLevel = action.payload.zoomLevel;

      editedFile.nodes.push({
        customAttrs: { name: null },
        id: action.payload.id,
        index: length,
        x: (50 - zoomLevel.x) / zoomLevel.k,
        y: (50 - zoomLevel.y) / zoomLevel.k,
        vy: 0,
        vx: 0,
        sticky: true,
        fx: (50 - zoomLevel.x) / zoomLevel.k,
        fy: (50 - zoomLevel.y) / zoomLevel.k
      });
      return {
        ...state,
        editedFile: editedFile
      };
    case "SELECT_AND_LINK_NODE":
      // get full node object by id
      const lastNode = state.editedFile.nodes.find(e => {
        return e.id === action.payload.lastClickedNode;
      });

      const currentNode = state.editedFile.nodes.find(e => {
        return e.id === action.payload.currentClickedNodeId;
      });

      const id = uuidv4();
      const newLink = {
        id: id,
        source: lastNode,
        target: currentNode
      };

      const linkAlreadyExists = state.editedFile.links.find(function(link) {
        const currSourceId = link.source.id,
          currTargetId = link.target.id,
          newSourceId = newLink.source.id,
          newTargetId = newLink.target.id;
        return (
          // Check for target -> source AND source -> target
          (currSourceId === newSourceId && currTargetId === newTargetId) ||
          (currSourceId === newTargetId && currTargetId === newSourceId)
        );
      });

      let newLinks;
      if (linkAlreadyExists) {
        newLinks = state.editedFile.links.filter(function(e) {
          return e !== linkAlreadyExists;
        });
      } else {
        newLinks = [...state.editedFile.links, newLink];
      }

      console.log(" new links", newLinks);
      // BUG? WHY CATS HERE?
      // const cats = this.props.file.categories || {}
      // const newData = { ...this.props.file, categories: cats, links: newLinks };
      // const newData = { ...this.state.editedFile.file, links: newLinks };
      // this.props.saveAction(newData);
      // this.props.selectNode(null);

      return {
        ...state,
        editedFile: { ...state.editedFile, links: newLinks }
      };
    case "file/POST_FILE_ERROR":
      return { ...state, error: action.payload, fetching: false };
    case "document/SAVE_TEXT_FILE":
      console.log("ACTION PAYLOAD", action.payload);
      const nodeId = action.payload.selNodeId
        ? action.payload.selNodeId
        : "main";
      const newText = Object.assign({}, state.editedFile.text);
      newText[nodeId] = action.payload.text;
      return { ...state, editedFile: { ...state.editedFile, text: newText } };
    default:
      return state;
  }
};
