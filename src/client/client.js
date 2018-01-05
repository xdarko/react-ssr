// Startup point for client side app
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import axios from 'axios';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

import routes from './routes';

const axiosInstance = axios.create({
  baseURL: '/api'
});

const store = createStore(
  reducers,
  window.INITIAL_STATE || {},
  // pass axiosInstance to thunk for client based api requests,
  // it will be available as a 3'rd argument in thunk's async action creators 
  applyMiddleware(thunk.withExtraArgument(axiosInstance))
);

// Booting up server-side rendered markup (hydration):
ReactDOM.hydrate(
  <Provider store={store}>
    <BrowserRouter>
      <div>{renderRoutes(routes)}</div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);