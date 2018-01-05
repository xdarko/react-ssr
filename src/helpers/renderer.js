import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import serialize from 'serialize-javascript';

import routes from '../client/routes';

/**
 * Renders react app markup and returns it as a string
 * @param  {String} location - The URL the server received, needed to render proper route's markup
 * @param  {Object} store    - redux store
 * @param  {Object} context  - react context
 * @return {String}          - server rendered markup for specified location
 */
export default (location, store, context) => {
  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={location} context={context}>
        <div>{renderRoutes(routes)}</div>
      </StaticRouter>
    </Provider>
  );

  return `
    <html>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css">
        <body>
          <div id="root">${content}</div>
          <script>
            window.INITIAL_STATE = ${serialize(store.getState())}
          </script>
          <script src="bundle.js"></script>
        </body>
      </head>
    </html>
  `;
};