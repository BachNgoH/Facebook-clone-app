import React, { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../../store/auth";
import { sendRequest } from "../../store/extra";
import { useQuery } from "../../utils/customHooks";
import classes from "./AllQuery.module.css";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Post from "../posts/Post";
import { ClipLoader } from "react-spinners";

const PostsQuery = () => {
    const query = useQuery();
    const authCtx = useContext(AuthContext);
    const [userRes, setUserRes] = useState([]);
    const [postRes, setPostRes] = useState([]);
    const [currentUser, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            setUser(await authCtx.getCurrentUser() );
        }
        getUser()
    }, []);

    const getResPost = useCallback(async (search_q) => {
        setIsLoading(true)
        const response = await sendRequest(
            `api/search/posts?q=${search_q}&n=3`,
            null,
            null,
            authCtx.authTokens.access
        );
        const data2 = await response.json();
        const data_posts = await Promise.all(
            data2.map(async (item) => {
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
                    <Post key={item.id} item={item} refresh={getResPost}>
                        {nested_post ? (
                            <Post
                                key={nested_post.id}
                                item={nested_post}
                                refresh={getResPost}
                            ></Post>
                        ) : null}
                    </Post>
                );
            })
        );
        setPostRes(data_posts);
        setIsLoading(false)
    }, []);

    useEffect(() => {
        const search_q = query.get("q");
        // console.log(search_q);

        getResPost(search_q);
    }, [currentUser]);

    return (
        <div className={classes.mainPrt}>
            <Card className={classes.card}>
                <h3>Posts</h3>
                <div className={classes.items}>
                    {!isLoading && (postRes.length > 0 ? postRes : <div className={classes.noRes}>No result found</div>)}
                    {isLoading && <ClipLoader color="#ccc" className={classes.loader}/>}
                </div>
            </Card>
        </div>
    );
};

export default PostsQuery;
