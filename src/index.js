import 'babel-polyfill';
import express from 'express';
import proxy from 'express-http-proxy';
import { matchRoutes } from 'react-router-config';

import renderer from './helpers/renderer';
import createStore from './helpers/createStore';
import routes from './client/routes';

const app = express();

app.use('/api', proxy('http://react-ssr-api.herokuapp.com', {
  proxyReqOptDecorator(options) {
    options.headers['x-forwarded-host'] = 'localhost:3000'
    return options;
  }
}));

app.use(express.static('public'));

app.get('*', (req, res) => {
  const store = createStore(req);

  // initialize and load data into the redux store for each component that needs to be rendered:
  const dataLoadPromises = matchRoutes(routes, req.url).map(({ route }) => {
    return route.loadData ? route.loadData(store) : null;
  });
  
  // send server-rendered markup to the client when all data was successfully loaded
  Promise.all(dataLoadPromises).then(() => {
    res.send(renderer(req.url, store));
  });
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});