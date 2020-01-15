import axios from "axios";
import environment from "../../environment";

const serverUrl = environment._serverUrl;

export const simpleAction = filename => dispatch => {
  dispatch({
    type: "SIMPLE_ACTION",
    payload: "result_of_simple_action"
  });

  const f = "web";

  const endpointForAuthUser = serverUrl + `getfile/${f}`;

  // Make a request for a user with a given ID
  dispatch({ type: "file/FETCH_FILE" });

  axios({
    method: "get",
    url: endpointForAuthUser,
    headers: { Pragma: "no-cache" }
  })
    .then(function(response) {
      dispatch({
        type: "file/UPDATE_FILE",
        payload: response.data.file
      });
      dispatch({
        type: "file/FETCH_FILE_RECEIVED",
        payload: response.data.file
      });
    })
    .catch(function(error) {
      dispatch({
        type: "file/FETCH_FILE_ERROR",
        payload: error.response
      });
    });
};

export const saveAction = file => dispatch => {
  dispatch({
    type: "SAVE_ACTION",
    payload: file
  });
};

export const addAction = () => dispatch => {
  dispatch({
    type: "ADD_ACTION",
    payload: ""
  });
};

export const deleteAction = () => dispatch => {
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

export const postAction = file => dispatch => {
  const h = "web";

  console.log("POST FILE?", file);

  const endpointForPostFile = serverUrl + `savefile/${h}`;

  axios({
    method: "post",
    url: endpointForPostFile,
    headers: { Pragma: "no-cache" },
    data: file
  })
    .then(function(response) {
      dispatch({
        type: "file/POST_FILE",
        payload: response.data
      });
    })
    .catch(function(error) {
      dispatch({
        type: "file/POST_FILE_ERROR",
        payload: error.response
      });
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
