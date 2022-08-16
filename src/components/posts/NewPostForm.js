import React, { useContext } from "react";
import Modal from "../ui/Modal";
import classes2 from "./Post.module.css";
import classes from "./NewPostForm.module.css";
import Button from "../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { sendRequest } from "../../store/extra";
import AuthContext from "../../store/auth";
import { useHistory } from "react-router-dom";
import { useResizeableInput } from "../../utils/customHooks";

const NewPostForm = (props) => {

    const authCtx = useContext(AuthContext)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const getUser = async () => {
            setUser(await authCtx.getCurrentUser(authCtx.authTokens) );
        }
        getUser()
    }, []);   

    const [scope, setScope] = useState("PU")
    const [content, input, setContent] = useResizeableInput({placeholder: `What's on your mind? ${user? user.first_name: ""}`})
    const history = useHistory()

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        const body = props.shared_post_id ? {
            content: content,
            scope: scope,
            shared_post: props.shared_post_id
        } : {
            content: content,
            scope: scope,
        } 
        const response = await sendRequest("api/post/", "POST", JSON.stringify(body), authCtx.authTokens.access)
        if (response.ok) {
            setContent("")
            props.onClose()
            props.refresh()
            history.push("/")
        }else {
            alert("Something went wrong")
        }      
    }
    return (
        <Modal onClose={props.onClose}>
            <form onSubmit={onSubmitHandler}>
                <div className={classes.head}>
                    <h1>Create Post</h1>
                </div>
                <div className={classes2.upper}>
                    <div className={classes2.ava}>
                        <img
                            src={
                                user
                                    ? user.profile.profile_image
                                    : null
                            }
                        />
                    </div>
                    <div className={classes2.usr}>
                        <div>{user ? `${user.first_name} ${user.last_name}` : ""}</div>
                        <Button type="button" className={classes.scopeSelector}>
                            <select onChange={(e) => setScope(e.target.value)} value={scope}>
                                <option value="PU">Public</option>
                                <option value="PR">Private</option>
                                <option value="ON">Only me</option>
                            </select>
                        </Button>
                    </div>
                </div>
                <div className={classes.textarea}>
                    {input}
                </div>
                <div>
                    {props.post }
                </div>
                <div className={classes.preBottom}>
                    Add to your post
                    <FontAwesomeIcon icon={faImage} />
                </div>
                <div className={classes.bottom}>
                    <Button className={classes.saveBtn}>POST</Button>
                </div>
            </form>
        </Modal>
    );
};

export default NewPostForm;
