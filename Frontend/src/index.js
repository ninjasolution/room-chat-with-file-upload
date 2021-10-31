import React from "react";
import ReactDOM from "react-dom";
// core components
import "assets/css/material-dashboard-react.css?v=1.10.0";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import "style.css";
import { Provider } from 'react-redux'
import { configStore } from './configureStore'
import { createBrowserHistory } from 'history'
import App from "App";
import { BrowserRouter } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";

let history = createBrowserHistory({
  hashType: 'slash',
  getUserConfirmation: (message, callback) => callback(window.confirm(message))
});
const store = configStore(history);
//history = syncHistoryWithStore(history, store)

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

if (module.hot) {
  // Reload components
  module.hot.accept('./App', () => {
    render()
  })
}