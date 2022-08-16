import React, { useState } from "react";
import Card from "../ui/Card";
import classes from './Post.module.css'
import NewPostForm from "./NewPostForm";
import AuthContext from "../../store/auth";
import { useContext } from "react";

const NewPost = (props) => {
    const [showForm, setShowForm] = useState(false)
    const [user, _] = useState( JSON.parse( localStorage.getItem("user") ? localStorage.getItem("user"): null))

    // useEffect(() => {
    //     const getUser = async () => {
    //         setUser(await authCtx.getCurrentUser() );
    //     }
    //     getUser()
    // }, [ authCtx]);
    console.log(user, 'IN NEW POST');

    return (
        <Card className={classes.listItem}>
            <div className={classes.upper}>
                <div className={classes.ava}>
                    <img src={user ? user.profile ? user.profile.profile_image : null: null} />
                </div>
                <div className={classes.textarea} onClick={() => setShowForm(true)}>
                    <textarea placeholder={`What is on your mind? ${user ? user.first_name: ""}`}/>
                </div>
            </div>
            {showForm && <NewPostForm onClose={() => setShowForm(false)} refresh={props.refresh}></NewPostForm>}
        </Card>
    );
};

export default NewPost;
