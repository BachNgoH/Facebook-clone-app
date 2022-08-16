import React, {
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import classes from "./Avatar.module.css";
import AuthContext from "../../store/auth";
import Card from "../ui/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faUserGroup, faMessage } from "@fortawesome/free-solid-svg-icons";
import { useClickOutsideDetector } from "../../utils/customHooks";
import { useHistory } from "react-router-dom";

const Avatar = () => {
    const authCtx = useContext(AuthContext);
    const [showProfile, setShowProfile] = useState(false);
    const [disableAva, setDisableAva] = useState(false)
    const history = useHistory()
    const [user, setUser] = useState( JSON.parse(localStorage.getItem("user")) );
    
    const wrapperRef = useRef(null);
    
    const toggleShowProfile = () => {
        setDisableAva((prev) =>!prev)
        setShowProfile((prev) => !prev);
    };

    useClickOutsideDetector(wrapperRef, toggleShowProfile);
    const navigateToProfilePageHandler = () => {
        if (user) history.push(`/profile/${user.id}`) 
    }

    return (
        <>
            <div className={classes.ava} onClick={toggleShowProfile} disabled={disableAva}>
                <img
                    src={user  ? user.profile.profile_image : null }
                    alt="profile"
                />
            </div>
            {showProfile && (
                <Card className={classes.profile} ref={wrapperRef}>
                    <div className={classes.profileSection} onClick={navigateToProfilePageHandler}>
                        <div className={classes.ava}>
                            <img
                                src={user ? user.profile.profile_image : null}
                                alt="profile"
                            />
                        </div>
                        <div>{user ? `${user.first_name} ${user.last_name}`: "username"}</div>
                    </div>
                    <div className={classes.profileSection} onClick={() => history.push('/friends/all')}>
                        <FontAwesomeIcon icon={faUserGroup}/>
                        Friends

                    </div>
                    <div className={classes.profileSection}>
                        <FontAwesomeIcon icon={faMessage}/>
                        Message

                    </div>
                    <div
                        className={classes.profileSection}
                        onClick={authCtx.logout}
                    >
                        <FontAwesomeIcon icon={faArrowRightFromBracket} />
                        Logout
                    </div>
                </Card>
            )}
        </>
    );
};

export default Avatar;
