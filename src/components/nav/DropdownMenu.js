import React from "react";
import Card from "../ui/Card";
import classes from "./Avatar.module.css";
import { CSSTransition } from "react-transition-group";
import { useContext, useState, useRef } from "react";
import NotificationContext from "../../store/notification";
import AuthContext from "../../store/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRightFromBracket,
    faUserGroup,
    faMessage,
    faChevronLeft,
    faBell,
} from "@fortawesome/free-solid-svg-icons";
import { base_url } from "../../store/extra";
import { useHistory } from "react-router-dom";
import { useClickOutsideDetector } from "../../utils/customHooks";


const DropdownMenu = (props) => {
    const navigateToProfilePageHandler = () => {
        if (user) history.push(`/profile/${user.id}`);
    };
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

    const history = useHistory();

    const imageUrlHelper = (img_url) => {
        if (!img_url.startsWith(base_url)) {
            return base_url + img_url.slice(1);
        }
        return img_url;
    };
    const [activeMenu, setAtiveMenu] = useState("main");
    const authCtx = useContext(AuthContext);
    const { notificationList, notificationCount } =
        useContext(NotificationContext);
    const wrapperRef = useRef(null);
    const [menuHeight, setMenuHeight] = useState("284px")
    
    function calcHeight(el) {
        const height = el.offsetHeight
        setMenuHeight(height)
    }
    useClickOutsideDetector(wrapperRef, props.toggleShowProfile);


    return (
        <Card className={classes.profile} ref={wrapperRef} style={{height: menuHeight}}>
            <CSSTransition
                in={activeMenu === "main"}
                unmountOnExit
                timeout={500}
                classNames={{
                    enter: classes.menuPrimaryEnter,
                    enterActive: classes.menuPrimaryEnterActive,
                    exit: classes.menuPrimaryExit,
                    exitActive: classes.menuPrimaryExitActive,
                }}
                onEnter={calcHeight}
            >
                <div className={classes.menu}>
                    <div
                        className={classes.profileSection}
                        onClick={navigateToProfilePageHandler}
                    >
                        <div className={classes.ava}>
                            <img
                                src={user ? user.profile.profile_image : null}
                                alt="profile"
                            />
                        </div>
                        <div>
                            {user
                                ? `${user.first_name} ${user.last_name}`
                                : "username"}
                        </div>
                    </div>
                    <div
                        className={classes.profileSection}
                        onClick={() => history.push("/friends/all")}
                    >
                        <FontAwesomeIcon icon={faUserGroup} />
                        Friends
                    </div>
                    <div
                        className={classes.profileSection}
                        onClick={() => history.push("/chats/")}
                    >
                        <FontAwesomeIcon icon={faMessage} />
                        Message
                        <div className={classes.badge}>{notificationCount}</div>
                    </div>
                    <div
                        className={classes.profileSection}
                        onClick={() => setAtiveMenu("noti")}
                    >
                        <FontAwesomeIcon icon={faBell} />
                        Notification
                        <div className={classes.badge}>{notificationCount}</div>
                    </div>
                    <div
                        className={classes.profileSection}
                        onClick={authCtx.logout}
                    >
                        <FontAwesomeIcon icon={faArrowRightFromBracket} />
                        Logout
                    </div>
                </div>
            </CSSTransition>
            <CSSTransition
                in={activeMenu === "noti"}
                unmountOnExit
                timeout={500}
                classNames={{
                    enter: classes.menuSecondaryEnter,
                    enterActive: classes.menuSecondaryEnterActive,
                    exit: classes.menuSecondaryExit,
                    exitActive: classes.menuSecondaryExitActive,
                }}
                onEnter={calcHeight}
            >
                <div className={classes.menu}>
                    <div
                        className={classes.profileSection}
                        onClick={() => setAtiveMenu("main")}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </div>
                    {notificationCount > 0 &&
                        notificationList.map((noti) => {
                            const conv = [
                                noti.message.from_user.id,
                                noti.message.to_user.id,
                            ]
                                .sort()
                                .join("__");
                            return (
                                <div
                                    className={classes.profileSection}
                                    key={noti.message.id}
                                    onClick={() =>
                                        history.push(`/chats/mes/${conv}`)
                                    }
                                >
                                    <div className={classes.ava}>
                                        <img
                                            src={imageUrlHelper(
                                                noti.user.profile.profile_image
                                            )}
                                        />
                                    </div>
                                    <div className={classes.notiname}>
                                        <div>{noti.user.username}</div>
                                        <div className={classes.noticontent}>
                                            {noti.message.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    {notificationCount === 0 && (
                        <div className={classes.profileSection}>
                            No notification now!!
                        </div>
                    )}
                </div>
            </CSSTransition>
        </Card>
    );
};

export default DropdownMenu;
