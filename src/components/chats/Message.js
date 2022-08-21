import { useContext } from "react";
import AuthContext from "../../store/auth";
import classes from "./Message.module.css";
import React from "react";
import Card from "../ui/Card";
import { base_url } from "../../store/extra";

const Message = ({ message, isLastOfBlock, showTimestamp }) => {
    const { currentUser } = useContext(AuthContext);

    const formatMessageTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString().slice(0, 5);
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
