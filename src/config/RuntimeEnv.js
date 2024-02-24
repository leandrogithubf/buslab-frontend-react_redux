let RuntimeEnv = ((runtimeEnv) =>
{
    return {
        BASE_URL: runtimeEnv.get('REACT_APP_BASE_URL') ?? process.env.REACT_APP_BASE_URL,
        SOCKET_URL: runtimeEnv.get('REACT_APP_SOCKET_URL') ?? process.env.REACT_APP_SOCKET_URL,
        SOCKET_IS_SECURE: runtimeEnv.get('REACT_APP_SOCKET_IS_SECURE') ?? process.env.REACT_APP_SOCKET_IS_SECURE,
        SITE_KEY: runtimeEnv.get('REACT_APP_SITE_KEY') ?? process.env.REACT_APP_SITE_KEY,
        KEY_MAPS: runtimeEnv.get('REACT_APP_KEY_MAPS') ?? process.env.REACT_APP_KEY_MAPS,
        KEY_MAPBOX: runtimeEnv.get('REACT_APP_KEY_MAPBOX') ?? process.env.REACT_APP_KEY_MAPBOX,
        NODE_ENV: runtimeEnv.get('REACT_APP_NODE_ENV') ?? process.env.REACT_APP_NODE_ENV,
    };
})(window.ENV || {});

export default RuntimeEnv;