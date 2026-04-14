import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import RootComponent from './root.component';

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: RootComponent,
  errorBoundary(err, info, props) {
    return <div>Error occurred in Store App</div>;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
