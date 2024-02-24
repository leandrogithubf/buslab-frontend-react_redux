const runtimeEnv = new Map();
runtimeEnv.set('REACT_APP_BASE_URL',null);
runtimeEnv.set('REACT_APP_SOCKET_URL',null);
runtimeEnv.set('REACT_APP_SOCKET_IS_SECURE',null);
runtimeEnv.set('REACT_APP_SITE_KEY',null);
runtimeEnv.set('REACT_APP_KEY_MAPS',null);
runtimeEnv.set('REACT_APP_KEY_MAPBOX',null);
window['ENV']=runtimeEnv;