import { Switch } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import ProfilePage from "./pages/ProfilePage";
import { AuthProvider } from "./store/auth";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
    return (
        <Switch>
            <AuthProvider>
                <PrivateRoute path="/" exact component={HomePage} />
                <PrivateRoute path="/profile/:id" component={ProfilePage} />

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
