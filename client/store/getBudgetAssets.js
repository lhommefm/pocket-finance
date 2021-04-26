import Axios from "axios"

// thunk to get data from server side req.user and dispatch action creator
export const getBudgetAssets = () => {
  return (
    async function (dispatch) {
      try {
        const financials = await Axios.get('/api/budgetAssets');
        dispatch(updateBudget(financials.data[0]));
        dispatch(updateAssets(financials.data[1]));
      } catch (err) {
        console.log('Error in fetching budgetAssets from API')
      }
    }
  ) 
};

// action creator to update Redux store with budget
export const updateBudget = (budget) => { 
  return {
    type: "updateBudget",
    budget
  } 
}

// action creator to update Redux store with assets
export const updateAssets = (assets) => { 
  return {
    type: "updateAssets",
    assets
  } 
}

// update state for budget
export function budgetReducer (budget = [], action) {
    switch (action.type) {
      case "updateBudget": return [...action.budget]
      default: return budget
    }
  }

// update state for asset
export function assetReducer (assets = [], action) {
  switch (action.type) {
    case "updateAssets": return [...action.assets]
    default: return assets
  }
}
