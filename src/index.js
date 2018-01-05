import 'babel-polyfill';
import express from 'express';
import proxy from 'express-http-proxy';
import { matchRoutes } from 'react-router-config';

import renderer from './helpers/renderer';
import createStore from './helpers/createStore';
import routes from './client/routes';

const app = express();

// Proxying client api requests 
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
  }).map(promise => {
    // additionally wrap all promises in to another one, it handles promises rejections in the Promise.all (below)
    if (promise) {
      return new Promise((resolve, reject) => promise.then(resolve).catch(resolve));
    }
  });
  
  // send server-rendered markup to the client when all data was successfully loaded
  Promise.all(dataLoadPromises).then(() => {
    const context = {}; // creating static context object for react StaticRouter
    const content = renderer(req.url, store, context); // get rendered app markup as a html-string
    
    // if redirecting was implemented (for example with <Redirect> component) redirect user appropriately
    if (context.url) {
      return res.redirect(301, context.url);
    }

    // if rendered page was marked as 'notFound' through the static context, set 404 status for response
    if (context.notFound) {
      res.status(404);
    }

    res.send(content);
  });
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});