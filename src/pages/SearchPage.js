import React from "react";
import Layout from "../components/layout/Layout";
import classes from "./SearchPage.module.css";
import {  NavLink, Route, Switch } from "react-router-dom";
import { useRouteMatch } from "react-router-dom";
import AllQuery from "../components/search/AllQuery";
import People from "../components/search/People";
import PostsQuery from "../components/search/PostsQuery";
import { useQuery } from "../utils/customHooks";

const SearchPage = () => {
    const { path, url } = useRouteMatch();
    const query = useQuery();

    return (
        <Layout>
            <div className={classes.main}>
                <div className={classes.content}>
                    <div className={classes.btns}>
                        <NavLink activeClassName={classes.active} className={classes.btn} to={`${url}/all?q=${query.get('q')}`}>
                            All
                        </NavLink>
                        <NavLink activeClassName={classes.active} className={classes.btn} to={`${url}/users?q=${query.get('q')}`}>
                            User
                        </NavLink>
                        <NavLink activeClassName={classes.active} className={classes.btn} to={`${url}/posts?q=${query.get('q')}`}>
                            Post
                        </NavLink>
                    </div>
                    <Switch>
                        <Route path={`${path}/all/`} exact component={AllQuery}/>
                        <Route path={`${path}/users/`} component={People}/>
                        <Route path={`${path}/posts/`} component={PostsQuery}/>
                    </Switch>
                </div>
            </div>
        </Layout>
    );
};

export default SearchPage;
