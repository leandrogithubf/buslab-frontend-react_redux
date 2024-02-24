import { createStore, compose, applyMiddleware } from 'redux';
import RuntimeEnv from "../../config/RuntimeEnv";

export default (reducers, middleware) => {
  const enhancer = RuntimeEnv.NODE_ENV === 'development'
      ? compose(console.tron.createEnhancer(), applyMiddleware(...middleware))
      : applyMiddleware(...middleware);

  return createStore(reducers, enhancer);
};
