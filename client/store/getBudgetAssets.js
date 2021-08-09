import Axios from "axios"

// thunk to get data from server side req.user and dispatch action creator
export const getBudgetAssets = () => {
  return (
    async function (dispatch) {
      try {
        const financials = await Axios.get('/api/budgetAssets');
        let people = [];
        for (let i = 0; i < financials.data[0].length; i++) {
          let person = financials.data[0][i]['person']
          if (person && !people.includes(person)) {
              people.push(person)
            }
        };
        dispatch(updateBudget(financials.data[0]));
        dispatch(updatePeople(people));
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

// action creator to update Redux store with people
export const updatePeople = (people) => { 
  return {
    type: "updatePeople",
    people
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

// update state for budget
export function peopleReducer (people = [], action) {
  switch (action.type) {
    case "updatePeople": return [...action.people]
    default: return people
  }
}

// update state for asset
export function assetReducer (assets = [], action) {
  switch (action.type) {
    case "updateAssets": return [...action.assets]
    default: return assets
  }
}
