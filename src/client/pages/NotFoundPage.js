import React from 'react';

const NotFoundPage = ({ staticContext = {} }) => {
  // mark the page with notFound status using StaticRouter's staticContext
  staticContext.notFound = true;

  return <h1>Page no found</h1>
};

export default {
  component: NotFoundPage
};