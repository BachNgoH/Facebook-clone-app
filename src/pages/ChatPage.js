import React from "react";
import Layout from "../components/layout/Layout";
import Chats from "../components/chats/Chats";
import { Route, Switch } from "react-router-dom";
import Conversations from "../components/chats/Conversations";
import { useRouteMatch } from "react-router-dom";
import classes from "./ChatPage.module.css";

const ChatPage = () => {
    const { path, url } = useRouteMatch();
    return (
        <Layout>
            <div className={classes.main}>
                <Route path={`${path}/`}>
                    <div className={classes.sidebar}>
                        <h2>Chats</h2>
                        <Conversations page_url={url} />
                    </div>
                </Route>
                <Route path={`${path}/mes/:conversationName`}>
                    <div className={classes.chat}>
                    <Chats />
                    </div>
                </Route>
            </div>
        </Layout>
    );
};

export default ChatPage;
