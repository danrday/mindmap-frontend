import axios from "axios";
import uuidv4 from "uuid/v4";

export const document = channel => dispatch => {
 channel.push("get_file")
      .receive("ok", (msg) => {
        dispatch({
          type: "file/UPDATE_FILE",
          payload: msg.file
        });
        dispatch({
          type: "file/FETCH_FILE_RECEIVED",
          payload: msg.file
        });
        dispatch({
          type: "globalEdit/POPULATE_INITIAL_VALUES",
          payload: msg.file.globalSettings
        });
      })
      .receive("error", e => {
        console.log('fetch file error', e)
        dispatch({
          type: "file/FETCH_FILE_ERROR",
          payload: e
        });
      })
};

export const saveAction = file => dispatch => {
  dispatch({
    type: "SAVE_ACTION",
    payload: file
  });
};

export const addAction = (zoomLevel) => dispatch => {

  zoomLevel.id = uuidv4()

  dispatch({
    type: "ADD_ACTION",
    payload: zoomLevel
  });
  dispatch({
    type: "SELECT_NODE",
    payload: zoomLevel.id
  });
  dispatch({
    type: "liveNodeEdit/POPULATE_CURRENT_NODE_VALUES",
    payload: {id: zoomLevel.id, name: 'new', customAttrs: null, category: null}
  });
  dispatch({
    type: "UI_SELECT_PAGE",
    payload: 2
  });
};

export const saveEdits = edits => dispatch => {
  dispatch({
    type: "SAVE_EDIT",
    payload: edits
  });
};

export const deleteAction = () => dispatch => {
  console.log('delete ac?', )
  dispatch({
    type: "DELETE_ACTION",
    payload: ""
  });
};

export const saveNameChangeAction = text => dispatch => {
  dispatch({
    type: "SAVE_NAME_CHANGE_ACTION",
    payload: text
  });
};

export const selectNode = node => dispatch => {
  dispatch({
    type: "SELECT_NODE",
    payload: node
  });
};

export const handleMouseMove = coords => dispatch => {
  dispatch({
    type: "HANDLE_MOUSE_MOVE",
    payload: coords
  });
};

export const selectAndLinkNode = node => dispatch => {
  dispatch({
    type: "SELECT_AND_LINK_NODE",
    payload: node
  });
};

export const postAction = (file, channel) => dispatch => {

  file.links.forEach(obj => {
    obj.source = obj.source.id;
    obj.target = obj.target.id;
  });

  channel.push("save_file", file)
      .receive("ok", (msg) => {
        dispatch({
          type: 'SHOW_ALERT_MESSAGE',
          payload: {
            show: true,
            msg: 'saved!',
            type: 'success',
          }
        })
      })
      .receive("error", e => {
        dispatch({
          type: "file/POST_FILE_ERROR",
          payload: e
        });
      })
};

export const saveCategoryEdit = edits => dispatch => {
  dispatch({
    type: `SAVE_CATEGORY_EDIT`,
    payload: edits
  });
};

export const saveDefaultsEdit = edits => dispatch => {
  dispatch({
    type: `SAVE_DEFAULTS_EDIT`,
    payload: edits
  });
};

export const handleZoom = zoomAttrs => dispatch => {
  dispatch({
    type: `HANDLE_ZOOM`,
    payload: zoomAttrs,
    audit: {user: 'danday', time_stamp: 'Saturday 12.17 pm'}
  });
};

// export const getUserFacilities = ({ user34, authToken }) => dispatch => {
//     const endpointForAuthUser = serverUrl + `User/GetUserFacilities/${user34}`
//
//     // Make a request for a user with a given ID
//     dispatch({ type: 'facilities/FETCH_FACILITIES' })
//
//     axios({
//         method: 'get',
//         url: endpointForAuthUser,
//         headers: { Authorization: authToken, Pragma: 'no-cache' },
//     })
//         .then(function(response) {
//             dispatch({
//                 type: 'facilities/SET_SELECTED_FACILITY',
//                 payload: response.data[0].facilityCoid,
//             })
//             dispatch({
//                 type: 'facilities/SET_SELECTED_ADMIN_VIEW_FACILITY',
//                 payload: {
//                     facilityCoid: response.data[0].facilityCoid,
//                     id: response.data[0].id,
//                     facilityName: response.data[0].displayName,
//                 },
//             })
//             dispatch({
//                 type: 'facilities/FETCH_FACILITIES_RECEIVED',
//                 payload: response.data,
//             })
//
//             fetchUnitsInternal(authToken, response.data[0].facilityCoid)
//         })
//         .catch(function(error) {
//             ErrorCheck(error)
//             dispatch({
//                 type: 'user/FETCH_FACILITIES_ERROR',
//                 payload: error.response,
//             })
//         })
//
//     function fetchUnitsInternal(authToken, facilityId) {
//         const getUnitsUrl = serverUrl + `Location/GetUnitsByFacility`
//
//         dispatch({ type: 'assignments/FETCH_UNITS' })
//         axios({
//             method: 'get',
//             url: getUnitsUrl,
//             headers: {
//                 authorization: authToken,
//                 FacilityCoid: facilityId,
//                 Pragma: 'no-cache',
//             },
//         })
//             .then(function(response) {
//                 dispatch({
//                     type: 'assignments/FETCH_UNITS_RECEIVED',
//                     payload: response.data,
//                 })
//             })
//             .catch(function(error) {
//                 if (error.response.status === 404) {
//                     dispatch({
//                         type: 'assignments/FETCH_UNITS_RECEIVED',
//                         payload: [],
//                     })
//                 } else  if (error.response.status !== 404) {
//                     ErrorCheck(error)
//                     dispatch({
//                         type: 'assignments/FETCH_UNITS_ERROR',
//                         payload: error.response,
//                     })
//                 }
//             })
//     }
// }
