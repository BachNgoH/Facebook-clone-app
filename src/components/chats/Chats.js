import React, { useContext, useEffect, useRef, useState } from "react";
import classes from "./Chats.module.css";
import { base_ws_url, sendRequest } from "../../store/extra";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useInput, useOnScreen } from "../../utils/customHooks";
import Button from "../ui/Button";
import AuthContext from "../../store/auth";
import Message from "./Message";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import InfiniteScroll from "react-infinite-scroll-component";
import { ClipLoader } from "react-spinners";
import { useHotkeys } from "react-hotkeys-hook";
import Typing from "./Typing";
import { base_url } from "../../store/extra";

const Chats = () => {
    const [meTyping, setMeTyping] = useState(false);
    const timeout = useRef();

    const timeoutFunction = () => {
        setMeTyping(false);
        sendJsonMessage({ type: "typing", typing: false });
    };

    const onType = () => {
        if (meTyping === false) {
            setMeTyping(true);
            sendJsonMessage({ type: "typing", typing: true });
            timeout.current = setTimeout(timeoutFunction, 5000);
        } else {
            clearTimeout(timeout.current);
            timeout.current = setTimeout(timeoutFunction, 5000);
        }
    };

    useEffect(() => () => clearTimeout(timeout.current), []);

    const inputReference = useHotkeys(
        "enter",
        () => {
            handleSubmit();
        },
        {
            enableOnTags: ["INPUT"],
        }
    );
    const [message, messageInput, setMessage] = useInput({
        type: "text",
        placeholder: "message",
        required: false,
        ref: inputReference,
        additionalFunc: onType,
    });
    const [messageHistory, setMessageHistory] = useState([]);
    const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
    const authCtx = useContext(AuthContext);
    const { conversationName } = useParams();
    const [page, setPage] = useState(2);
    const [hasMoreMessages, setHasMoreMessages] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [conversation, setConversation] = useState(null);
    const [typing, setTyping] = useState(false);
    const bottomRef = useRef(null);
    const [showScrollToBotButton, setShowToBotButton] = useState(false);
    const isBottomVisible = useOnScreen(bottomRef);

    useEffect(() => {
        inputReference.current.focus();
    }, [inputReference]);

    useEffect(() => {
        const fetchConversation = async () => {
            const apiRes = await sendRequest(
                `api/chats/conversations/${conversationName}/`,
                null,
                null,
                authCtx.authTokens.access
            );
            if (apiRes.ok) {
                const data = await apiRes.json();
                console.log(data);
                setConversation(data);
            }
        };
        fetchConversation();
    }, [conversationName]);

    const updateTyping = (event) => {
        if (event.user !== user.id) {
            setTyping(event.typing);
        }
    };

    const fetchMessages = async () => {
        const apiRes = await sendRequest(
            `api/chats/messages/?conversation=${conversationName}&page=${page}`,
            null,
            null,
            authCtx.authTokens.access
        );
        if (apiRes.ok) {
            const data = await apiRes.json();
            setHasMoreMessages(data.next !== null);
            setPage((page) => page + 1);
            setMessageHistory((prev) => prev.concat(data.results));
        }
    };

    const { readyState, sendJsonMessage } = useWebSocket(
        user ? `ws://${base_ws_url}chats/${conversationName}/` : null,
        {
            queryParams: {
                token: authCtx.authTokens.access,
            },
            onOpen: () => {
                setPage(2);
                console.log("Connected!");
            },
            onClose: () => {
                console.log("Disconnected!");
            },
            onMessage: (e) => {
                const data = JSON.parse(e.data);
                switch (data.type) {
                    case "chat_message_echo":
                        bottomRef.current?.scrollIntoView({
                            behavior: "smooth",
                        });
                        sendJsonMessage({ type: "read_messages" });
                        setMessageHistory((prev) => [data.message, ...prev]);
                        break;

                    case "last_50_messages":
                        setMessageHistory(data.messages);
                        setHasMoreMessages(data.has_more);
                        break;
                    case "user_join":
                        setParticipants((pcpts) => {
                            if (pcpts && pcpts.includes(data.user)) {
                                return [...pcpts, data.user];
                            }
                            return pcpts;
                        });
                        break;
                    case "user_leave":
                        setParticipants((pcpts) => {
                            const newPtcpts = pcpts.filter(
                                (x) => x !== data.user
                            );
                            return newPtcpts;
                        });
                        break;
                    case "online_user_list":
                        setParticipants(data.users);
                        break;
                    case "typing":
                        // bottomRef.current?.scrollIntoView({ behavior: "smooth" });
                        updateTyping(data);
                        break;
                    default:
                        console.error("Unkown message type!");
                        break;
                }
            },
        }
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.length === 0) return;
        if (message.length > 512) return;
        sendJsonMessage({
            type: "chat_message",
            message,
        });
        setMessage("");
        clearTimeout(timeout.current);
        timeoutFunction();
    };

    const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[readyState];

    useEffect(() => {
        if (connectionStatus === "Open") {
            sendJsonMessage({
                type: "read_messages",
            });
        }
    }, [connectionStatus, sendJsonMessage]);

    // useEffect(() => {
    //     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    // }, [messageHistory]);

    useEffect(() => {
        if (!isBottomVisible) {
            setShowToBotButton(true);
        } else {
            setShowToBotButton(false);
        }
    }, [isBottomVisible]);

    const imageUrlHelper = (img_url) => {
        if (!img_url.startsWith(base_url)) {
            return base_url + img_url.slice(1);
        }
        return img_url;
    };

    return (
        <div className={classes.main}>
            {conversation && (
                <div className={classes.topbar}>
                    <div className={classes.ava}>
                        <img
                            src={imageUrlHelper(
                                conversation.other_user.profile.profile_image
                            )}
                        />
                    </div>
                    <h3>
                        {conversation.other_user.first_name}{" "}
                        {conversation.other_user.last_name}
                    </h3>
                </div>
            )}
            <ul>
                <div id="scrollableDiv" className={classes.scrollDiv}>
                    {typing && <Typing />}
                    <span ref={bottomRef} />
                    {showScrollToBotButton && (
                        <div
                            className={classes.downBtn}
                            onClick={() =>
                                bottomRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                })
                            }
                        >
                            <FontAwesomeIcon icon={faChevronDown} />
                        </div>
                    )}
                    <InfiniteScroll
                        dataLength={messageHistory.length}
                        next={fetchMessages}
                        inverse={true}
                        hasMore={hasMoreMessages}
                        loader={
                            <ClipLoader
                                className={classes.loader}
                                color="#ccc"
                            />
                        }
                        scrollableTarget="scrollableDiv"
                        className={classes.scroll}
                    >
                        {messageHistory &&
                            messageHistory.map((message, index) => {
                                let isLastOfBlock = false;
                                let showTimestamp = false;
                                if (index === 0) {
                                    isLastOfBlock = true;
                                } else if (
                                    message.from_user.id ===
                                    messageHistory[index - 1].to_user.id
                                ) {
                                    isLastOfBlock = true;
                                } else {
                                    const date_1 = new Date(message.timestamp);
                                    const date_2 = new Date(
                                        messageHistory[index - 1].timestamp
                                    );

                                    if (
                                        Math.round(
                                            Math.abs(date_1 - date_2) / 60000
                                        ) > 15
                                    ) {
                                        isLastOfBlock = true;
                                    }
                                }
                                if (index === messageHistory.length - 1) {
                                    showTimestamp = true;
                                } else if (messageHistory[index + 1]) {
                                    const date_1 = new Date(message.timestamp);
                                    const date_2 = new Date(
                                        messageHistory[index + 1].timestamp
                                    );
                                    if (
                                        Math.round(
                                            Math.abs(date_1 - date_2) / 60000
                                        ) > 15
                                    ) {
                                        showTimestamp = true;
                                    }
                                }
                                return (
                                    <Message
                                        key={message.id}
                                        message={message}
                                        isLastOfBlock={isLastOfBlock}
                                        showTimestamp={showTimestamp}
                                    />
                                );
                            })}
                    </InfiniteScroll>
                </div>
            </ul>
            <form className={classes.input}>
                {messageInput}
                <Button
                    type="submit"
                    onClick={handleSubmit}
                    className={classes.btn}
                >
                    <FontAwesomeIcon icon={faPaperPlane} />
                </Button>
            </form>
        </div>
    );
};

export default Chats;
