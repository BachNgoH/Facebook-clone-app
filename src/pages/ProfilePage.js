import Button from "../components/ui/Button";
import React, { useContext, useEffect, useCallback, useState } from "react";
import Layout from "../components/layout/Layout";
import classes from "./ProfilePage.module.css";
import { useHistory, useParams } from "react-router-dom";
import { sendRequest } from "../store/extra";
import AuthContext from "../store/auth";
import { ClipLoader } from "react-spinners";
import EditProfile from "../components/profile/EditProfile";
import PostList from "../components/posts/PostList";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [inFriendList, setInFriendList] = useState(false);
    const [inRequestedList, setInRequestedList] = useState(false);
    const [inFollowingList, setInFollowingList] = useState(false);

    const authCtx = useContext(AuthContext);
    const history = useHistory();
    let { id } = useParams();

    const getUser = useCallback(async () => {
        setIsLoading(true);

        const accessToken = authCtx.authTokens.access;
        const response = await sendRequest(
            `api/user/profiles/${id}`,
            "GET",
            null,
            accessToken
        );
        const data = await response.json();
        const currentUser = await authCtx.currentUser;
        console.log(currentUser);
        setIsCurrentUser(currentUser.id === data.id);
        const inFriends =
            typeof currentUser.friends.find(
                (element) => element.id === data.id
            ) !== "undefined";
        const inFollowing =
            typeof currentUser.following.find(
                (element) => element.following_user_id === data.id
            ) !== "undefined";

        const inFriendRequested =
            typeof data.friend_requests.find(
                (element) =>
                    element.user_sender === currentUser.id && !element.accepted
            ) !== "undefined";
        console.log("IN FRIENDS", inFriends);
        console.log("IN Follow", inFollowing);
        console.log("IN REQUESTED", inFriendRequested);
        console.log("DATA", data);
        setInFriendList(inFriends);
        setInFollowingList(inFollowing);
        setInRequestedList(inFriendRequested);

        setUser(data);
        setIsLoading(false);
    }, [authCtx, id]);

    useEffect(() => {
        getUser();
    }, [getUser]);

    const onUpdateProfile = () => {
        history.push(`/profile/${id}`);
        setShowEditProfile(false);
    };

    const onSendFriendRequest = async () => {
        const response = await sendRequest(
            `api/user/friends/add/${id}`,
            "POST",
            null,
            authCtx.authTokens.access
        );
        if (response.ok) {
            setInRequestedList(true);
        }
    };
    const onSendFollowdRequest = async () => {
        const response = await sendRequest(
            `api/user/follow/${id}`,
            "POST",
            null,
            authCtx.authTokens.access
        );
        if (response.ok) {
            setInFollowingList(true);
        }
    };

    const onSendUnFriendRequest = async () => {
        if (window.confirm("Are you sure to unfriend this user?")) {
            const response = await sendRequest(
                `api/user/friends/unfriend/${id}`,
                "DELETE",
                null,
                authCtx.authTokens.access
            );
            if (response.ok) {
                setInFriendList(false);
            }
        }
    };
    const onSendUnFollowRequest = async () => {
        if (window.confirm("Are you sure to unfollow this user?")) {
            const response = await sendRequest(
                `api/user/unfollow/${id}`,
                "DELETE",
                null,
                authCtx.authTokens.access
            );
            if (response.ok) {
                setInFollowingList(false);
            }
        }
    };
    const onDeleteFriendRequest = async () => {
        if (window.confirm("Are you sure to unsend friend request this user?")) {
            const response = await sendRequest(
                `api/user/friends/delreq/${id}`,
                "DELETE",
                null,
                authCtx.authTokens.access
            );
            if (response.ok) {
                setInRequestedList(false);
            }
        }
    };

    return (
        <>
            <Layout>
                <div className={classes.main}>
                    <div className={classes.coverImg}>
                        {!isLoading && (
                            <img
                                src={user ? user.profile.cover_image : null}
                                alt="cover image"
                            />
                        )}
                        {isLoading && <ClipLoader />}
                    </div>
                    <div className={classes.info}>
                        <div className={classes.ava}>
                            {!isLoading && (
                                <img
                                    src={
                                        user ? user.profile.profile_image : null
                                    }
                                    alt="profile_pic"
                                />
                            )}
                            {isLoading && <ClipLoader />}
                        </div>
                        <div className={classes.username}>
                            <div>
                                <h1>
                                    {user
                                        ? `${user.first_name} ${user.last_name}`
                                        : null}
                                </h1>
                                <p>{user && user.friends.length} friends</p>
                            </div>
                            <div className={classes.buttons}>
                                {!isLoading && !isCurrentUser && (
                                    <>
                                        {inFriendList && (
                                            <Button
                                                className={classes.btn}
                                                onClick={onSendUnFriendRequest}
                                            >
                                                Friends ✓
                                            </Button>
                                        )}
                                        {inRequestedList && (
                                            <Button className={classes.btn} onClick={onDeleteFriendRequest}>
                                                Requested
                                            </Button>
                                        )}
                                        {!inFriendList && !inRequestedList && (
                                            <Button
                                                className={classes.btn}
                                                onClick={onSendFriendRequest}
                                            >
                                                Add Friend
                                            </Button>
                                        )}

                                        {inFollowingList ? (
                                            <Button
                                                className={classes.btn}
                                                onClick={onSendUnFollowRequest}
                                            >
                                                Followed
                                            </Button>
                                        ) : (
                                            <Button
                                                className={classes.btn}
                                                onClick={onSendFollowdRequest}
                                            >
                                                Follow
                                            </Button>
                                        )}
                                    </>
                                )}
                                {!isLoading && isCurrentUser && (
                                    <Button
                                        className={classes.btn}
                                        onClick={() => {
                                            setShowEditProfile(true);
                                        }}
                                    >
                                        Edit profile
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <PostList
                            in="profile_page"
                            id={id}
                            current={isCurrentUser}
                        />
                    </div>
                </div>
            </Layout>
            {showEditProfile && (
                <EditProfile
                    onClose={() => setShowEditProfile(false)}
                    user={user}
                    onUpdate={onUpdateProfile}
                />
            )}
        </>
    );
};

export default ProfilePage;
