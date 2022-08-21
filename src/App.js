import { Switch } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ChatPage from "./pages/ChatPage";
import FriendPage from "./pages/FriendPage";
import HomePage from "./pages/HomePage";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import { AuthProvider } from "./store/auth";
import { NotificationContextProvider } from "./store/notification";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
    return (
        <Switch>
            <AuthProvider>
                <NotificationContextProvider>
                    <PrivateRoute path="/" exact component={HomePage} />
                    <PrivateRoute path="/profile/:id" component={ProfilePage} />
                    <PrivateRoute path="/search" component={SearchPage} />
                    <PrivateRoute path="/friends" component={FriendPage} />
                    <PrivateRoute path="/chats" component={ChatPage} />

                    <PrivateRoute
                        isForAuth={true}
                        path="/auth"
                        component={LoginRegisterPage}
                    />
                </NotificationContextProvider>
            </AuthProvider>
        </Switch>
    );
}

export default App;
