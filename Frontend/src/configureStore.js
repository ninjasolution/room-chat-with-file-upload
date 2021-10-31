import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import reduxThunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createSocketAction } from 'actions/AuthActions';
import { BaseURL } from 'containers';
import { connectRouter, routerMiddleware } from 'connected-react-router'
//import Immutable from 'immutable'
import rootReducer from './reducers';

const asyncDispatchMiddleware = store => next => action => {
    let syncActivityFinished = false;
    let actionQueue = [];
  
    function flushQueue() {
      actionQueue.forEach(a => store.dispatch(a)); // flush queue
      actionQueue = [];
    }
  
    function asyncDispatch(asyncAction) {
      actionQueue = actionQueue.concat([asyncAction]);
  
      if (syncActivityFinished) {
        flushQueue();
      }
    }
  
    const actionWithAsyncDispatch =
      Object.assign({}, action, { asyncDispatch });
  
    const res = next(actionWithAsyncDispatch);
  
    syncActivityFinished = true;
    flushQueue();
  
    return res;
  };

export  function configStore ( history) {

    const middlewareEnhancer = applyMiddleware(
                                reduxThunk, 
                                createLogger(), 
                                routerMiddleware(history), 
                                asyncDispatchMiddleware);

    const composeEnhancer = composeWithDevTools(middlewareEnhancer )
    
    const store = createStore(
        rootReducer(history), 
        undefined,
        composeEnhancer
    )
    
     // Hot reloading
    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./reducers', () => {
        store.replaceReducer(rootReducer(history));
        });
    }

    store.dispatch(createSocketAction(BaseURL))

    return store;
}