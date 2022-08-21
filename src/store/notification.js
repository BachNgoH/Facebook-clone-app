import { createContext, useContext, useState } from "react";
import AuthContext from "./auth";
import { base_ws_url } from "./extra";
import useWebSocket, { ReadyState } from "react-use-websocket";

const NotificationContext = createContext({
    notificationCount: 0,
    connectionStatusL: "Uninstantiated",
    notificationList: null,
});

export default NotificationContext;

export const NotificationContextProvider = ({ children }) => {
    const { currentUser, authTokens } = useContext(AuthContext);
    const [notificationCount, setNotificationCount] = useState(0);
    const [notificationList, setNotificationList] = useState([])

    const { readyState } = useWebSocket(
        currentUser ? `ws://${base_ws_url}notifications/` : null,
        {
            queryParams: {
                token: authTokens ? authTokens.access : "",
            },
            onOpen: () => {
                console.log("Connected to Notification");
            },
            onClose: () => {
                console.log("Disconnected from Notifications!");
            },
            onMessage: (e) => {
                const data = JSON.parse(e.data);
                switch (data.type) {
                    case "unread_count":
                        const messages_noti = data.unread_messages ? data.unread_messages.map( item => Object({
                            user: item.from_user,
                            message: item
                        })) : []
                        setNotificationList(messages_noti)
                        setNotificationCount(data.unread_count);
                        break;
                    case "new_message_notification":
                        const message = data.message
                        setNotificationList(prev => prev.concat({user: message.from_user, content: message}))
                        setNotificationCount(count => count += 1);
                        break;
                    default:
                        console.error("Unknown message type!");
                        break;
                }
            },
        }
    );

    const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[readyState];
    
    return <NotificationContext.Provider value={{
        notificationCount, connectionStatus, notificationList
    }}>
        {children}
    </NotificationContext.Provider> 
};
