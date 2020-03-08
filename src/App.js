import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {routes} from "./config";
import {ToastContainer} from "react-toastify";

function App() {
    const children = [];
    const renderRoute = (item, currentPath) => {
        let path = `${currentPath}/${item.path}`;
        // replace [/]+ to /, such as /// to /
        path = path.replace(/\/+/g, '/');

        if (item.component) {
            children.push(
                <Route
                    key={path}
                    render={props => <item.component {...props}/>}
                    exact
                    path={path}
                />
            );
        }
        if (item.childRoutes) {
            item.childRoutes.forEach(r => renderRoute(r, path));
        }
    };
    routes.forEach(item => renderRoute(item, '/'));
    return (
        <BrowserRouter>
            <Switch>{children}</Switch>
            <ToastContainer/>
        </BrowserRouter>

    );
}

export default App;
