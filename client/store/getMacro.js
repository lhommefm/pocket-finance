import Axios from "axios"

// thunk to get data from server side req.user and dispatch action creator
export const getMacroData = (year) => {
  return (
    async function (dispatch) {
      try {
        const macro = await Axios.get(`/api/getMacroData/year/${year}`);
        // console.log('fetchMacroData ==>',JSON.stringify(macro.data));
        dispatch(updateMacro(macro.data));
      } catch (err) {
        console.log('Error in fetching macro from API')
      }
    }
  ) 
};

// action creator to update Redux store with budget
export const updateMacro = (macro) => { 
  return {
    type: "updateMacro",
    macro
  } 
}

// update state for taxes
export function macroReducer (macro = {}, action) {
  switch (action.type) {
    case "updateMacro": return {...action.macro}
    default: return macro
  }
}