import { Switch } from "react-router-dom";
import Layout from "./components/layout/Layout";
import FriendPage from "./pages/FriendPage";
import HomePage from "./pages/HomePage";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import { AuthProvider } from "./store/auth";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
    return (
        <Switch>
            <AuthProvider>
                <PrivateRoute path="/" exact component={HomePage} />
                <PrivateRoute path="/profile/:id" component={ProfilePage} />
                <PrivateRoute path="/search" component={SearchPage} />
                <PrivateRoute path="/friends" component={FriendPage} />

                <PrivateRoute
                    isForAuth={true}
                    path="/auth"
                    component={LoginRegisterPage}
                />
            </AuthProvider>
        </Switch>
    );
}

export default App;
