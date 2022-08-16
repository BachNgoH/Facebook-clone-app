import React, { useCallback, useState } from "react";
import { Card } from "react-bootstrap";
import classes from "../search/AllQuery.module.css";
import { useEffect, useContext } from "react";
import AuthContext from "../../store/auth";
import { sendRequest } from "../../store/extra";
import Button from "../ui/Button";

const AllFriendRequests = () => {
    const authCtx = useContext(AuthContext);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [requestData, setRequestData] = useState([])

    const onAcceptFriendRequest = async (id) => {
        const response = await sendRequest(`api/user/friends/accept/${id}`, 'POST', null, authCtx.authTokens.access);
        if (response.ok) {
            getFriends()
        }
    }

    const getFriends = useCallback( async () => {
        if (user) {
            const data = user.friend_requests.map(async (item) => {
                if (!item.accepted) {
                    const response = await sendRequest(`api/user/profiles/${item.user_sender}`,"GET",null,
                        authCtx.authTokens.access
                    );
                    const user_sender = await response.json();
                    return (
                        <div className={classes.item} key={item.user_sender}>
                            <div className={classes.ava}>
                                <img src={user_sender.profile? user_sender.profile.profile_image: null}/>
                            </div>
                            <div className={classes.usr}>
                                <div>{user_sender.username}</div>
                                <Button className={classes.btn} onClick={() => onAcceptFriendRequest(item.user_sender)}>
                                    Accept
                                </Button>
                            </div>
                        </div>
                    );}});
            setRequestData(await Promise.all( data) )
        }
    }, [user]);

    useEffect(() => {

        getFriends();
    }, [user]);

    return (
        <div className={classes.mainPrt}>
            <Card className={classes.card}>
                <h3>All Friend requests</h3>
                {requestData}
            </Card>
        </div>
    );
};

export default AllFriendRequests;
