import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { sendRequest } from "./extra";

const AuthContext = React.createContext({
    authTokens: "",
    isLoggedIn: false,
    errorMessage: "",
    currentUser: null,
    login: () => {},
    logout: () => {},
    getCurrentUser: () => {},
});

export default AuthContext;
export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );
    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("authTokens") ? true : false)
    const [currentUser, setCurrentUser] = useState(() => localStorage.getItem("user") ?  localStorage.getItem("user"): null)
    const history = useHistory();

    const loginUser = async (email, password) => {
        const response = await sendRequest('api/login/', "POST", JSON.stringify({
            email: email,
            password: password,
        }));
        const data = await response.json()
        await getUser(data)

        if (response.status === 200) {
            setAuthTokens(data);
            setIsLoggedIn(true);
            localStorage.setItem("authTokens", JSON.stringify(data));

            history.push("/");
        } else {
            const error_message = data.detail
            setErrorMessage(error_message);
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setIsLoggedIn(false)
        setCurrentUser(null)
        localStorage.removeItem("authTokens");
        localStorage.removeItem("user");
    };

    const getCurrentUser = useCallback(async (token_data) => {
        const accessToken = token_data.access;
        const response = await sendRequest(
            "api/user/profiles/current",
            "GET",
            null,
            accessToken
        );
        const data = await response.json();
        return data
    }, []);

    const updateToken = useCallback( async () => {
        const response = await sendRequest('api/login/refresh/', "POST", JSON.stringify({
            refresh: authTokens?.refresh,
        }), null);
        const data = await response.json()

        if (response.status === 200) {
            setAuthTokens(data);
            setIsLoggedIn(true)
            if (authTokens){
                getUser(authTokens)
            }  
            localStorage.setItem("authTokens", JSON.stringify(data));
        } else {
            logoutUser();
        }

        if (loading) {
            setIsLoading(false);
        }
    }, [authTokens, loading]);

    const contextData = {
        authTokens: authTokens,
        isLoggedIn: isLoggedIn,
        errorMessage: errorMessage,
        currentUser: currentUser,
        getCurrentUser: getCurrentUser,
        login: loginUser,
        logout: logoutUser,
    };

    const getUser = useCallback( async (token_data) => {
        const user = await getCurrentUser(token_data) 
        localStorage.setItem("user", JSON.stringify( user) )
        setCurrentUser(user)
    }, [getCurrentUser])

    useEffect(() => {
        if (loading) {
            updateToken();
        }


        const twentyThreeHours = 23 * 60 * 60 * 1000;
        const interval = setInterval(async () => {
            if (authTokens) {
                updateToken();
            }
        }, twentyThreeHours);
        return () => clearInterval(interval);
    }, [authTokens, loading, updateToken, getUser]);
    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};
