import React from 'react';
import PropTypes from 'prop-types';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {Redirect} from "react-router";

export default function AppRoute({routes}) {
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
        if (item.redirect) {
            const redirect = item.redirect;
            if (typeof redirect === 'string') {
                children.push(<Redirect exact from={redirect} to={path} key={path + '-' + redirect}/>)
            } else {
                redirect.forEach(it => {
                    children.push(<Redirect exact from={it} to={path} key={path + '-' + it}/>)
                })
            }
        }
    };
    routes.forEach(item => renderRoute(item, '/'));
    return (
        <BrowserRouter>
            <Switch>{children}</Switch>
        </BrowserRouter>

    );
}
AppRoute.propTyps = {
    routes: PropTypes.array.isRequired
};
