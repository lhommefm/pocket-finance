
import { combineReducers } from 'redux';
import { budgetReducer, peopleReducer, assetReducer } from './getBudgetAssets';
import { stockTableReducer } from './getStockAssets';
import { assetAllocationReducer } from './getAssetAllocation';
import { taxesReducer } from './getTaxes';
import { macroReducer } from './getMacro';
import { stocksReducer } from './getStocks';
import { stockDetailReducer } from './getStockDetail';
import { inputsReducer } from './getInputSettings';
import { statusReducer } from './getStatus';

const primaryReducer = combineReducers({
  budget: budgetReducer,
  assets: assetReducer,
  people: peopleReducer,
  stockTable: stockTableReducer,
  assetTable: assetAllocationReducer,
  taxes: taxesReducer,
  macro: macroReducer,
  stocks: stocksReducer,
  stockDetail: stockDetailReducer,
  inputs: inputsReducer,
  status: statusReducer
})

export default primaryReducer

