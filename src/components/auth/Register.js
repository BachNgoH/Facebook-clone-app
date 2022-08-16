import React, { useState } from "react";
import Button from "../ui/Button";
import classes from "./Form.module.css";
import { sendRequest } from "../../store/extra";
import { useInput } from "../../utils/customHooks";

import { ClipLoader } from "react-spinners";


const Register = (props) => {
    const [email, emailInput, setEmail] = useInput({type: "text"})
    const [firstName, firstNameInput, setFirstName] = useInput({type: "text"})
    const [lastName, lastNameInput, setLastName] = useInput({type: "text"})
    const [password, passwordInput , setPassword] = useInput({type: "password"})
    const [password2, password2Input , setPassword2] = useInput({type: "password"})
    const [isLoading, setIsLoading] = useState(false)

    const [emailError, setEmailError] = useState([])
    const [firstNameError, setFirstNameError] = useState([])
    const [lastNameError, setLastNameError] = useState([])
    const [passwordError, setPasswordError] = useState([])
    const [password2Error, setPassword2Error] = useState([])

    const onRegisterHandler = async (event) => {

        event.preventDefault();
        setIsLoading(true)
        const response = await sendRequest("api/register/", "POST", JSON.stringify({
            email: email,
            first_name: firstName,
            last_name: lastName,
            password: password,
            password2: password2,
        }))

        const data = await response.json()
        
        setIsLoading(false)
        if (response.ok) {
            
            setEmail("")
            setFirstName("")
            setLastName("")
            setPassword("")
            setPassword2("")
            props.onToConfirm()

        } else{
            console.log("something went wrong");
            console.log(data);
            data.email ? setEmailError(data.email) : setEmailError([]) 
            data.password ? setPasswordError(data.password) : setPasswordError([])
            data.password2 ? setPassword2Error(data.password2) : setPassword2Error([])
            data.first_name ?  setFirstNameError(data.first_name) : setFirstNameError([])
            data.last_name ?  setLastNameError(data.last_name) : setLastNameError([])
        }
    }

    return (
        <form className={classes.form} onSubmit={onRegisterHandler}>
            <h1>Register</h1>
            <div className={classes.mainform}>
                <label htmlFor="email">email</label>
                {emailInput}
                {emailError.length > 0 ? <div className={classes.error}>{emailError[0]}</div> : null}
                <label htmlFor="firstname">First Name</label>
                {firstNameInput}
                {firstNameError.length > 0 ? <div className={classes.error}>{firstNameError[0]}</div> : null}
                <label htmlFor="lastname">Last Name</label>
                {lastNameInput}
                {lastNameError.length > 0 ? <div className={classes.error}>{lastNameError[0]}</div> : null}
                <label htmlFor="password">password</label>
                {passwordInput}
                {passwordError.length > 0 ? <div className={classes.error}>{passwordError[0]}</div> : null}
                <label htmlFor="repeat-password">repeat password</label>
                {password2Input}
                {password2Error.length > 0 ? <div className={classes.error}>{password2Error[0]}</div> : null}

            </div>
            <Button className={classes.button}>Submit</Button>
            {isLoading && <div className={classes.loading}>
                <ClipLoader />
            </div>}
        </form>
    );
};

export default Register;
