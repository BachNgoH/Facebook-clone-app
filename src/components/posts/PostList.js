import React, { useState } from "react";
import Post from "./Post";
import classes from "./PostList.module.css";
import { useContext, useEffect, useCallback } from "react";
import { sendRequest } from "../../store/extra";
import AuthContext from "../../store/auth";
import NewPost from "./NewPost";

const PostList = (props) => {
    const authCtx = useContext(AuthContext);
    const [posts, setPosts] = useState([]);

    const getAllPosts = useCallback(async () => {
        let response;
        if (props.in === "profile_page") {
            response = await sendRequest(
                `api/post/${props.id}`,
                "GET",
                null,
                authCtx.authTokens.access
            );
        } else {
            response = await sendRequest(
                "api/post",
                "GET",
                null,
                authCtx.authTokens.access
            );
        }
        const data = await response.json();
        const data_posts = await Promise.all(data.map(async (item) => {
            let nested_post = null;
            if (item.is_nested) {
                const response = await sendRequest(
                    `api/post/rev/${item.shared_post}`,
                    "GET",
                    null,
                    authCtx.authTokens.access
                );
                nested_post = await response.json();
            }
            return (
                <Post key={item.id} item={item} refresh={getAllPosts}>
                    {nested_post ? (
                        <Post
                            key={nested_post.id}
                            item={nested_post}
                            refresh={getAllPosts}
                        ></Post>
                    ) : null}
                </Post>
            );
        }));
        setPosts(data_posts);
    }, []);

    useEffect(() => {
        getAllPosts();
    }, []);

    return (
        <div className={classes.list}>
            {(props.in === "profile_page") && props.current && (
                <NewPost refresh={getAllPosts} />
            )}
            {!(props.in === "profile_page") && <NewPost refresh={getAllPosts} />}
            {posts}
        </div>
    );
};

export default PostList;
