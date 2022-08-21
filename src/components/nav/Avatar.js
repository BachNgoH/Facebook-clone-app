import React, { useContext, useEffect, useRef, useState } from "react";
import classes from "./Avatar.module.css";


import DropdownMenu from "./DropdownMenu";

const Avatar = () => {

    const [showProfile, setShowProfile] = useState(false);
    const [disableAva, setDisableAva] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));


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
            </div>
            {showProfile && (
                <DropdownMenu toggleShowProfile={toggleShowProfile}/>
            )}
        </>
    );
};

export default Avatar;
