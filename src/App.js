import React from "react";
import { Switch, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { BrowserRouter as Router } from "react-router-dom";
import { routesAuth, routesAdmin } from "./routes";
const App = () => {

    return (
        <>
            <Router>
                <Switch>
                    {routesAuth.map((route, idx) => {
                        return route.component ? (
                            <Route
                                key={idx}
                                path={route.path}
                                exact={route.exact}
                                name={route.name}
                                render={props => <route.component {...props} />}
                            />
                        ) : null;
                    })}
                    <Layout>
                        {routesAdmin.map((route, idx) => {
                            return route.component ? (
                                <Route
                                    key={idx}
                                    path={route.path}
                                    exact={route.exact}
                                    name={route.name}
                                    render={props => {
                                        const crumbs = routesAdmin
                                            // Get all routes that contain the current one.
                                            .filter(({ path }) => props.match.path.includes(path))
                                            // Swap out any dynamic routes with their param values.
                                            // E.g. "/pizza/:pizzaId" will become "/pizza/1"
                                            .map(({ path, ...rest }) => ({
                                                path: Object.keys(props.match.params).length
                                                    ? Object.keys(props.match.params).reduce(
                                                          (path, param) =>
                                                              path.replace(`:${param}`, props.match.params[param]),
                                                          path
                                                      )
                                                    : path,
                                                ...rest,
                                            }));
                                        return <route.component {...props} crumbs={crumbs} />;
                                    }}
                                />
                            ) : null;
                        })}
                    </Layout>
                </Switch>
            </Router>
        </>
    );
};

export default App;
