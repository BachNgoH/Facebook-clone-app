import React, { useCallback, useContext, useEffect, useState } from "react";
import Modal from "../ui/Modal";
import classes from "./CommentList.module.css";
import Comment from "./Comment";
import { sendRequest } from "../../store/extra";
import AuthContext from "../../store/auth";
import { ClipLoader } from "react-spinners";
import NewComment from "./NewComment";

const CommentList = (props) => {
    const authCtx = useContext(AuthContext);
    const [comments, setComments] = useState("Write something");
    const [isLoading, setIsLoading] = useState(false);

    const getAllComments = useCallback(async () => {
        setIsLoading(true);
        const response = await sendRequest(
            `api/post/comment/${props.id}`,
            "GET",
            null,
            authCtx.authTokens.access
        );
        const data = await response.json();
        if (!response.ok) {
            alert("Something went wrong!");
            return null;
        } else {
            props.changeCommentCount(data.length);
            const comments_data = data.map((item) => {
                let nested_comments = null;
                if (!item.is_nested) {
                    //console.log(data);
                    nested_comments = item.replies.map((i) => {
                        // console.log( data.find((element) => (element.id = i.id)) )
                        return (
                            <Comment
                                key={i.id}
                                item={data.find(
                                    (element) => (element.id == i.id)
                                )}
                                canReply={false}
                            />
                        );
                    });

                    return (
                        <Comment
                            key={item.id}
                            item={item}
                            canReply={true}
                            updateComments={getAllComments}
                            post_id={props.id}
                        >
                            {nested_comments}
                        </Comment>
                    );
                }
                return null;
            });
            setComments(comments_data);
            setIsLoading(false);
        }
    }, [authCtx.authTokens.access, props.in, props.id]);
    useEffect(() => {
        getAllComments();
    }, []);

    return (
        <Modal onClose={props.onClose}>
            <div className={classes.main}>
                <h2>Comments</h2>
                <NewComment
                    post_id={props.id}
                    updateComments={getAllComments}
                />
                {isLoading && <ClipLoader />}
                {!isLoading && comments}
            </div>
        </Modal>
    );
};

export default CommentList;
