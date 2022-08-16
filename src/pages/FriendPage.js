import React from "react";
import Layout from "../components/layout/Layout";
import classes from './FriendPage.module.css'
import { useRouteMatch, NavLink } from "react-router-dom";
import AllFriends from "../components/friends/AllFriends";
import AllFriendRequests from "../components/friends/AllFriendRequests";
import Suggestions from "../components/friends/Suggestions";
import { Switch, Route } from "react-router-dom";

const FriendPage = () => {
    const { path, url } = useRouteMatch();
    return <Layout>
        <div className={classes.main}>
            <div className={classes.content}>
                <div className={classes.btns}>
                        <NavLink activeClassName={classes.active} className={classes.btn} to={`${url}/all`}>
                            Friends
                        </NavLink>
                        <NavLink activeClassName={classes.active} className={classes.btn} to={`${url}/requests`}>
                            Friends Request
                        </NavLink>
                        <NavLink activeClassName={classes.active} className={classes.btn} to={`${url}/suggests`}>
                            Suggestions
                        </NavLink>
                </div>
                <Switch>
                    <Route path={`${path}/all/`} component={AllFriends}/>
                    <Route path={`${path}/requests/`} component={AllFriendRequests}/>
                    <Route path={`${path}/suggests/`} component={Suggestions}/>
                </Switch>
            </div>
        </div>
    </Layout>;
};

export default FriendPage;
