import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import store from './store';

// Webpack will take this css file and include it in the build
// style-related loaders were defined in webpack.config.js
import '../public/index.css'

// import components
import Login from './components/Login';
import Header from './components/Header';
import BudgetAssets from './components/BudgetAssets';
import Stocks from './components/Stocks';
import Macro from './components/Macro';


// Provider is needed to wrap the rest of the application and give access to Redux Store
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Route path='/' component={Header} />
      <Route path='/login' component={Login} />  
      <Route path='/macro' component={Macro} />
      <Route path='/budgetAssets' component={BudgetAssets} />
      <Route path='/stocks' component={Stocks} />
    </Router>
  </Provider>,
  document.getElementById('app')
);