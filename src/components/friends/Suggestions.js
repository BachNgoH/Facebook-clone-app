import React, { useCallback } from "react";
import { Card } from "react-bootstrap";
import classes from "../search/AllQuery.module.css";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../../store/auth";
import { sendRequest } from "../../store/extra";
import Button from "../ui/Button";
import classes2 from "./Friends.module.css";
import { Link, useHistory } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const Suggestions = () => {
    const authCtx = useContext(AuthContext);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") ? localStorage.getItem("user"): null));
    const [requestData, setRequestData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const onSendFriendRequest = async (id) => {
        const response = await sendRequest(
            `api/user/friends/add/${id}`,
            "POST",
            null,
            authCtx.authTokens.access
        );
        if (response.ok) {
            getFriends()
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
                getFriends()
            }
        }
    };

    const getFriends = useCallback( async () => {
        if (user) {
            setIsLoading(true);
            const response = await sendRequest(`api/user/`,"GET",null,authCtx.authTokens.access);
            const data = await response.json();

            const modified_data = data.map((item) => {
                const inFriendRequested =
                    typeof item.friend_requests.find(
                        (element) =>
                            element.user_sender === user.id &&
                            !element.accepted
                    ) !== "undefined";
                return (
                    <div className={classes.item} key={item.id}>
                        <div className={classes.ava}>
                            <img src={item.profile? item.profile.profile_image: null}/>
                        </div>
                        <div className={classes.usr}>
                            <Link to={`/profile/${item.id}`}className={classes2.link}>{item.username}</Link>
                            {!inFriendRequested && <Button className={classes.btn} onClick={() => onSendFriendRequest(item.id)}>
                                Add Friend
                            </Button>}
                            {inFriendRequested && <Button className={classes.btn} onClick={() => onDeleteFriendRequest(item.id)}>
                                Requested
                            </Button>}
                            </div>
                        </div>
                );
            });
            setRequestData(modified_data);
            setIsLoading(false);
        }
    }, [user]);
    useEffect(() => {
        getFriends();
    }, [user]);

    return (
        <div className={classes.mainPrt}>
            <Card className={classes.card}>
                <h3>All Friends</h3>
                {!isLoading && requestData}
                    
                {isLoading && <ClipLoader color="#ccc" />}
            </Card>
        </div>
    );
};

export default Suggestions;
