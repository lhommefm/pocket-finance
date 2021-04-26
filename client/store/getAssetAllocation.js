import Axios from "axios"

// thunk to get data from server side req.user and dispatch action creator
export const getAssetAllocation = () => {
  return (
    async function (dispatch) {
      try {
        const assetTable = await Axios.get('/api/getAssetAllocation');
        // console.log('getAssetAllocation',JSON.stringify(stockTable.data));
        dispatch(updateAssetAllocation(assetTable.data));
      } catch (err) {
        console.log('Error in fetching asset allocation from API')
      }
    }
  ) 
};

// action creator to update Redux store with budget
export const updateAssetAllocation = (assetTable) => { 
  return {
    type: "updateAssetAllocation",
    assetTable
  } 
}

// update state for assetTable
export function assetAllocationReducer (assetTable = [], action) {
  switch (action.type) {
    case "updateAssetAllocation": return [...action.assetTable]
    default: return assetTable
  }
}