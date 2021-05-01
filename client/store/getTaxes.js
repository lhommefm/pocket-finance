import Axios from "axios"

// thunk to get data from server side req.user and dispatch action creator
export const getTaxes = () => {
  return (
    async function (dispatch) {
      try {
        const rawTaxes = await Axios.get('/api/getTaxData');
        const unsortedTaxes = Object.entries(rawTaxes.data)
        const taxes = unsortedTaxes.sort(function (a,b) {return b[1]-a[1]})
        // console.log('fetchTaxes ==>',JSON.stringify(taxes));
        dispatch(updateTaxes(taxes));
      } catch (err) {
        console.log('Error in fetching taxes from API')
      }
    }
  ) 
};

// action creator to update Redux store with budget
export const updateTaxes = (taxes) => { 
  return {
    type: "updateTaxes",
    taxes
  } 
}

// update state for taxes
export function taxesReducer (taxes = [], action) {
  switch (action.type) {
    case "updateTaxes": return [...action.taxes]
    default: return taxes
  }
}