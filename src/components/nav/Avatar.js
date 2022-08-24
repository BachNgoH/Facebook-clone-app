import React, { useContext, useState } from "react";
import NotificationContext from "../../store/notification";
import classes from "./Avatar.module.css";


import DropdownMenu from "./DropdownMenu";

const Avatar = () => {

    const [showProfile, setShowProfile] = useState(false);
    const [disableAva, setDisableAva] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));
    const {notificationCount} = useContext(NotificationContext)

    const toggleShowProfile = () => {
        setDisableAva((prev) => !prev);
        setShowProfile((prev) => !prev);
    };



    return (
        <>
            <div
                className={classes.ava}
                onClick={toggleShowProfile}
                disabled={disableAva}
            >
                <img
                    src={user ? user.profile.profile_image : null}
                    alt="profile"
                />
                {notificationCount > 0 && <div className={classes.notiBadge}></div>}
            </div>
            {showProfile && (
                <DropdownMenu toggleShowProfile={toggleShowProfile}/>
            )}
        </>
    );
};

export default Avatar;
