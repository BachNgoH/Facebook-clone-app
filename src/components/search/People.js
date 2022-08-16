import React, { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../../store/auth";
import { sendRequest } from "../../store/extra";
import { useQuery } from "../../utils/customHooks";
import classes from "./AllQuery.module.css";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { ClipLoader } from "react-spinners";

const People = () => {
    const query = useQuery();
    const authCtx = useContext(AuthContext);
    const [userRes, setUserRes] = useState([]);
    const [currentUser, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onSendFriendRequest = async (id) => {
        const response = await sendRequest(
            `api/user/friends/add/${id}`,
            "POST",
            null,
            authCtx.authTokens.access
        );
        if (response.ok) {
            const search_q = query.get("q");
            get_result(search_q)
        }
    };

    const onDeleteFriendRequest = async (id) => {
        if (window.confirm("Are you sure to unsend friend request this user?")) {
            const response = await sendRequest(
                `api/user/friends/delreq/${id}`,
                "DELETE",
                null,
                authCtx.authTokens.access
            );
            if (response.ok) {
                const search_q = query.get("q");
                get_result(search_q)
            }
        }
    };



    useEffect(() => {
        const getUser = async () => {
            setUser(await authCtx.getCurrentUser() );
        }
        getUser()
    }, [authCtx]);

    const get_result = useCallback( async (search_q) => {
        setIsLoading(true)
        const response = await sendRequest(
            `api/search/user?q=${search_q}`,
            null,
            null,
            authCtx.authTokens.access
        );

        const data = await response.json();
        // console.log(data);
        // console.log(currentUser, "CURRENT USER");

        if (currentUser) {
            const userResult = data.map((item) => {
                // console.log(item);
                const inFriendList =
                    typeof currentUser.friends.find(
                        (element) => element.id === item.id
                    ) !== "undefined";
                const inFriendRequested =
                    typeof item.friend_requests.find(
                        (element) =>
                            element.user_sender === currentUser.id &&
                            !element.accepted
                    ) !== "undefined";
                return (
                    <div className={classes.item} key={item.id}>
                        <div className={classes.ava}>
                            <img
                                src={
                                    item.profile
                                        ? item.profile.profile_image
                                        : null
                                }
                                alt="AVA"
                            />
                        </div>
                        <div className={classes.usr}>
                            <div>{item.username}</div>
                            {!inFriendList && !inFriendRequested && (
                                <Button className={classes.btn} onClick={() => onSendFriendRequest(item.id)}>
                                    Add Friend
                                </Button>
                            )}
                            {inFriendRequested && (
                                <Button className={classes.btn} onClick={() => onDeleteFriendRequest(item.id)}>
                                    Requested
                                </Button>
                            )}
                        </div>
                    </div>
                );
            });
            setIsLoading(false)
            setUserRes(userResult);
        }
    }, [currentUser, authCtx, onSendFriendRequest, onDeleteFriendRequest]);


    useEffect(() => {
        const search_q = query.get("q");
        // console.log(search_q);

        get_result(search_q);
    }, [currentUser]);



    return (
        <div className={classes.mainPrt}>
            <Card className={classes.card}>
                <h3>People</h3>
                <div className={classes.items}>
                    {!isLoading && (userRes.length > 0 ? userRes : <div className={classes.noRes}>No result found</div>)}
                    {isLoading && <ClipLoader color="#ccc" className={classes.loader}/>}
                </div>
            </Card>
        </div>
    );
};

export default People;
