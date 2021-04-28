
import { combineReducers } from 'redux';
import { budgetReducer, assetReducer } from './getBudgetAssets';
import { stockTableReducer } from './getStockAssets';
import { assetAllocationReducer } from './getAssetAllocation';
import { taxesReducer } from './getTaxes';
import { macroReducer } from './getMacro';
import { stocksReducer } from './getStocks';
import { inputsReducer } from './getInputSettings';

const primaryReducer = combineReducers({
  budget: budgetReducer,
  assets: assetReducer,
  stockTable: stockTableReducer,
  assetTable: assetAllocationReducer,
  taxes: taxesReducer,
  macro: macroReducer,
  stocks: stocksReducer,
  inputs: inputsReducer
})

export default primaryReducer

