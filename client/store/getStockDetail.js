import Axios from "axios"

// thunk to get data from server side req.user and dispatch action creator
export const getStockDetail = () => {
  return (
    async function (dispatch) {
      try {
        const stocksDetail = await Axios.get(`/api/getStockDetail`);
        // console.log('fetchStockDetail ==>',JSON.stringify(stockDetail.data));
        dispatch(updateStockDetail(stocksDetail.data));
      } catch (err) {
        console.log('Error in fetching stock detail from API')
      }
    }
  ) 
};

// action creator to update Redux store with stock detail
export const updateStockDetail = (stockDetail) => { 
  return {
    type: "updateDetail",
    stockDetail
  } 
}

// update state for stockDetail
export function stockDetailReducer (stockDetail = [], action) {
  switch (action.type) {
    case "updateDetail": return [...action.stockDetail]
    default: return stockDetail
  }
}
