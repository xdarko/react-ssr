import axios from 'axios';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../client/reducers';

export default (req) => {
  const axiosInstance = axios.create({
    baseURL: 'http://react-ssr-api.herokuapp.com',
    headers: { cookie: req.get('cookie') || '' } // <- pass along browser cookies
  });

  const store = createStore(
    reducers,
    {},
    // pass axiosInstance to thunk for server based api requests,
    // it will be available as a 3'rd argument in thunk's async action creators 
    applyMiddleware(thunk.withExtraArgument(axiosInstance))
  );

  return store;
};