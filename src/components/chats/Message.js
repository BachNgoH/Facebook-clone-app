import { useContext } from "react";
import AuthContext from "../../store/auth";
import classes from "./Message.module.css";
import React from "react";
import Card from "../ui/Card";
import { base_url } from "../../store/extra";
import moment from "moment";

const Message = ({ message, isLastOfBlock, showTimestamp }) => {
    const { currentUser } = useContext(AuthContext);

    const formatMessageTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date()
        if (today.toDateString() === date.toDateString()){
            return moment(date).format('h:mm a')
        }

        return moment(date).format('MMMM Do YYYY, h:mm a')
    };
    const imageUrlHelper = (img_url) => {
        if (!img_url.startsWith(base_url)) {
            return base_url + img_url.slice(1);
        }
        return img_url;
    };

    return (
        <>
            <li className={classes.list}>
                {currentUser.id === message.to_user.id && (
                    <span className={classes.usericon}>
                        {isLastOfBlock && (
                            <img
                                src={imageUrlHelper(
                                    message.from_user.profile.profile_image
                                )}
                            />
                        )}
                    </span>
                )}
                <Card
                    className={`${classes.message} ${
                        currentUser.id === message.to_user.id
                            ? ""
                            : classes.from_me
                    }`}
                >
                    <span>{message.content}</span>
                </Card>
            </li>
            {showTimestamp && (
                <div className={classes.time}>
                    {formatMessageTimestamp(message.timestamp)}
                </div>
            )}
        </>
    );
};

export default Message;
