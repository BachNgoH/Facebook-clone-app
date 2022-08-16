import React, { useContext, useState } from "react";
import Button from "../ui/Button";
import classes from "./Form.module.css";
import AuthContext from "../../store/auth";
import { useInput } from "../../utils/customHooks";
import { ClipLoader } from "react-spinners";

const Login = (props) => {
    const authCtx = useContext(AuthContext);
    const [email, emailInput, setEmail] = useInput({type: "text"})
    const [password, passwordInput, setPassword] = useInput({type: "password"})
    const [isLoading, setIsLoading] = useState(false)

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        setIsLoading(true)
        await authCtx.login(email, password)
        setIsLoading(false)
        setEmail("");
        setPassword("");
    }

    return (
        <form className={classes.form} onSubmit={onSubmitHandler}>
            <h1>LOGIN</h1>
            {authCtx.errorMessage && <div className={classes.error}>{authCtx.errorMessage}</div>}
            <div className={classes.mainform}>
                <label htmlFor="email">email</label>
                {emailInput}
                <label htmlFor="password">password</label>
                {passwordInput}
            </div>
            <Button className={classes.button}>Login</Button>
            {isLoading && <div className={classes.loading}>
                <ClipLoader />
            </div>}
        </form>
    );
};

export default Login;
