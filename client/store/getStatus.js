import Axios from "axios"

// thunk to get logged in user_id dispatch action creator
export const getStatus = () => {
  return (
    async function (dispatch) {
      try {
        const status = await Axios.get('/authentication/me');
        console.log('fetchStatus ==>',JSON.stringify(status.data));
        dispatch(updateStatus(status.data));
      } catch (err) {
        console.log('Error in fetching status from API')
      }
    }
  ) 
};

// action creator to update Redux store with status
export const updateStatus = (status) => { 
  return {
    type: "updateStatus",
    status
  } 
}

// update state for status
export function statusReducer (status = false, action) {
  switch (action.type) {
    case "updateStatus": return action.status
    default: return status
  }
}