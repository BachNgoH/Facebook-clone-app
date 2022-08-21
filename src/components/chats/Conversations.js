import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../store/auth";
import { base_url, sendRequest } from "../../store/extra";
import { Link, NavLink } from "react-router-dom";
import classes from "./Conversations.module.css";
import { useHistory } from "react-router-dom";
import moment from "moment";
import NotificationContext from "../../store/notification";

const Conversations = (props) => {
    const { currentUser, authTokens } = useContext(AuthContext);
    const [conversations, setActiveConversations] = useState([]);
    const {notificationCount} = useContext(NotificationContext)
    
    useEffect(() => {
        async function fetchUsers() {
            const res = await sendRequest(
                `api/chats/conversations/`,
                "GET",
                null,
                authTokens.access
            );
            const data = await res.json();
            console.log(data.friends);
            setActiveConversations(data)
        }
        fetchUsers();
    }, [notificationCount]);


    const createConversationName = (id) => {
        const namesAlph = [currentUser?.id, id].sort();
        return `${namesAlph[0]}__${namesAlph[1]}`;
    };
    const formatMessageTimestamp = (timestamp) => {
        if (!timestamp) return;
        const date = new Date(timestamp);
        let str = moment(date).fromNow()
        str = str.split(" ").slice(0, -1)
        return str.join(' ')
    }


    const imageUrlHelper = (img_url) => {
        if (!img_url.startsWith(base_url)) {
            return base_url + img_url.slice(1)
        }
        return img_url;
    }

    return (
        <div className={classes.allconv}>
        {conversations
            ? conversations.map((c) => (
                <NavLink className={classes.link} 
                key={c.other_user.id}
                to={`/chats/mes/${createConversationName(c.other_user.id)}`}
                activeClassName={classes.active}>
                    <div className={classes.ava}>
                        <img src={imageUrlHelper(c.other_user.profile.profile_image)}/>
                    </div>
                    <div className={classes.cont}>
                        <div className={classes.username}>
                            {c.other_user.first_name} {c.other_user.last_name}
                            <div className={classes.timeago}>
                            {formatMessageTimestamp( c.last_message?.timestamp )}
                            </div>

                        </div>
                        {c.last_message && <div className={`${classes.lastMes} ${(c.last_message?.read || c.last_message.from_user.id == currentUser.id) ? "": classes.unread}`}>
                            {c.last_message.from_user.id === currentUser.id ? "You": c.last_message.from_user.username}: {c.last_message?.content} 
                        </div>}
                    </div>
                    </NavLink>
                  ))
                : null}
        </div>
    );
};

export default Conversations;
