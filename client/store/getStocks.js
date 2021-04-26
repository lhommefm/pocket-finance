import Axios from "axios"

// thunk to get data from server side req.user and dispatch action creator
export const getStockHistory = () => {
  return (
    async function (dispatch) {
      try {
        const stocks = await Axios.get(`/api/getStockHistory`);
        // console.log('fetchStockHistory ==>',JSON.stringify(macro.data));
        dispatch(updateMacro(stocks.data));
      } catch (err) {
        console.log('Error in fetching stock history from API')
      }
    }
  ) 
};

// action creator to update Redux store with budget
export const updateMacro = (stocks) => { 
  return {
    type: "updateStocks",
    stocks
  } 
}

// update state for taxes
export function stocksReducer (stocks = {}, action) {
  switch (action.type) {
    case "updateStocks": return {...action.stocks}
    default: return stocks
  }
}