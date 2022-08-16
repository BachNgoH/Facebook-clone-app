import React, { useContext, useEffect, useState } from "react";
import classes from "./NewComment.module.css";
import Button from "../ui/Button";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sendRequest } from "../../store/extra";
import AuthContext from "../../store/auth";
import { ClipLoader } from "react-spinners";
import { useResizeableInput } from "../../utils/customHooks";

const NewComment = (props) => {
    const [comment, input, setComment] = useResizeableInput({placeholder: "Write a comment"});
    const [isLoading, setIsLoading] = useState(false)
    const authCtx = useContext(AuthContext)
    const [user, setUser] = useState(authCtx.currentUser);

    useEffect(() => {
        const getUser = async () => {
            setUser(await authCtx.getCurrentUser() );
        }
        getUser()
    }, []);

    
    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        let response = null
        if (props.reply_of){
            response = await sendRequest(`api/post/comment/${props.post_id}`, 'POST', JSON.stringify({
                content: comment,
                reply_of_comment: props.reply_of
            }), authCtx.authTokens.access)
        }else {
            response = await sendRequest(`api/post/comment/${props.post_id}`, 'POST', JSON.stringify({
                content: comment,
            }), authCtx.authTokens.access)     
        }
        const data = await response.json()
        setIsLoading(false)
        if (response.ok){
            setComment("")
            props.updateComments()
        }else {
            alert("Something went wrong")
        }
    }
    
    return (
        <form className={classes.form} onSubmit={onSubmitHandler}>
            <div className={classes.ava}>
                <img src={user ? user.profile.profile_image : null}/>
            </div>
            <div className={classes.input}>
                {input}
            </div>
            <Button className={classes.btn}>
                {!isLoading && <FontAwesomeIcon icon={faPaperPlane} />}
                {isLoading && <ClipLoader />}
            </Button>
        </form>
    );
};

export default NewComment;
