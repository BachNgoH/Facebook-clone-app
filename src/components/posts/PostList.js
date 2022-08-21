import React, { useState } from "react";
import Post from "./Post";
import classes from "./PostList.module.css";
import { useContext, useEffect, useCallback } from "react";
import { sendRequest } from "../../store/extra";
import AuthContext from "../../store/auth";
import NewPost from "./NewPost";
import InfiniteScroll from "react-infinite-scroll-component";
import { ClipLoader } from "react-spinners";

const PostList = (props) => {
    const authCtx = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1)
    const [hasNext, setHasNext] = useState(false)

    const getAllPosts = useCallback(async (page_) => {
        let response;
        if (props.in === "profile_page") {
            response = await sendRequest(
                `api/post/${props.id}?page=${page_}`,
                "GET",
                null,
                authCtx.authTokens.access
            );
        } else {
            response = await sendRequest(
                `api/post/?page=${page_}`,
                "GET",
                null,
                authCtx.authTokens.access
            );
        }
        if (response.ok){

        const data = await response.json();
        const data_posts = await Promise.all(
            data.results.map(async (item) => {
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
                item['nested_post'] = nested_post;
                return item
            })
        );
        console.log(data_posts);
        console.log(page +1);
        setPage(page => {return page + 1})
        setHasNext(data.next !== null)
        setPosts(prev => prev.concat(data_posts));
        }
    }, []);

    useEffect(() => {
        getAllPosts(page);
    }, []);

    return (
        <div className={classes.list}>
            {(props.in === "profile_page") && props.current && (
                <NewPost refresh={getAllPosts} />
            )}
            {!(props.in === "profile_page") && <NewPost refresh={getAllPosts} />}
            <InfiniteScroll
            dataLength={posts.length}
            next={() => getAllPosts(page)}
            hasMore={hasNext}
            loader={<ClipLoader color="#ccc" className={classes.loader}/>}
            >
                {posts.map(item => <Post key={item.id} item={item} inshare={false}>
                    <Post key={item.id} item={item}></Post>
                </Post>)}
            </InfiniteScroll>
        </div>
    );
};

export default PostList;
