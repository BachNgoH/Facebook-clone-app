import React from "react";
import { Card } from "react-bootstrap";
import classes from "../search/AllQuery.module.css";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../../store/auth";
import { sendRequest } from "../../store/extra";
import Button from "../ui/Button";
import classes2 from './Friends.module.css'
import { Link, useHistory } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const AllFriends = () => {
    const authCtx = useContext(AuthContext);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") ? localStorage.getItem("user"): null));
    const [requestData, setRequestData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();


    useEffect(() => {
        const getFriends = async () => {
            if (user) {
                setIsLoading(true)
                const data = user.friends.map(async (item) => {
                    const response = await sendRequest(`api/user/profiles/${item.id}`,"GET",null,authCtx.authTokens.access);
                    const user_sender = await response.json();
                    return (
                        <div className={classes.item} key={item.id}>
                            <div className={classes.ava}>
                                <img src={user_sender.profile ? user_sender.profile.profile_image: null}/>
                            </div>
                            <div className={classes.usr}>
                                <Link to={`/profile/${item.id}`} className={classes2.link}>{user_sender.username}</Link>
                            </div>
                        </div>
                    );
                });
                setRequestData(await Promise.all(data));
                setIsLoading(false)
            }
        };
        getFriends();
    }, [user]);

    return (
        <div className={classes.mainPrt}>
            <Card className={classes.card}>
                <h3>All Friends</h3>
                {!isLoading && (requestData.length > 0 ? requestData: <div className={classes2.btncon}>
                    <Button className={classes2.frBtn} onClick={() => history.push('/friends/suggests')}>
                    Find Friends now! 
                    </Button> 
                </div>)}
                {isLoading && <ClipLoader color="#ccc"/>}
            </Card>
        </div>
    );
};

export default AllFriends;
