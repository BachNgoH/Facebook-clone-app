import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../store/auth";

const PrivateRoute = ({ children, isForAuth, ...rest }) => {
    const authCtx = useContext(AuthContext);
    if (isForAuth) {
        return (
            <Route {...rest}>
                {authCtx.isLoggedIn ? <Redirect to="/" /> : children}
            </Route>
        );
    }
    return (
        <Route {...rest}>
            {!authCtx.isLoggedIn ? <Redirect to="/auth" /> : children}
        </Route>
    );
};

export default PrivateRoute;
