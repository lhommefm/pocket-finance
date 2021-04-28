import Axios from "axios"

// thunk to get data from server side req.user and dispatch action creator
export const getInputSettings = () => {
  return (
    async function (dispatch) {
      try {
        const inputs = await Axios.get('/api/getInputs');
        dispatch(updateInputs(inputs.data));
      } catch (err) {
        console.log('Error in fetching Inputs from API')
      }
    }
  ) 
};

// action creator to update Redux store with inputs
export const updateInputs = (inputs) => { 
  return {
    type: "updateInputs",
    inputs
  } 
}

// update state for inputs
export function inputsReducer (inputs = [], action) {
    switch (action.type) {
      case "updateInputs": return [...action.inputs]
      default: return inputs
    }
  }