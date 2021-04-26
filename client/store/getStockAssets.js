import Axios from "axios"

// thunk to get data from server side req.user and dispatch action creator
export const getStockAssets = () => {
  return (
    async function (dispatch) {
      try {
        const stockTable = await Axios.get('/api/getStockAssets');
        // console.log('fetchStockAssets',JSON.stringify(stockTable.data));
        dispatch(updateStockAssets(stockTable.data));
      } catch (err) {
        console.log('Error in fetching stockAssets from API')
      }
    }
  ) 
};

// action creator to update Redux store with budget
export const updateStockAssets = (stockTable) => { 
  return {
    type: "updateStockTable",
    stockTable
  } 
}

// update state for stockTable
export function stockTableReducer (stockTable = [], action) {
  switch (action.type) {
    case "updateStockTable": return [...action.stockTable]
    default: return stockTable
  }
}