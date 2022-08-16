import React, { useState } from "react";
import classes from "./Comment.module.css";
import Card from "../ui/Card";
import moment from "moment";
import NewComment from "./NewComment";

const Comment = (props) => {
    
    const [showNewReply, setShowNewReply] = useState(false)

    return (
        <div className={classes.main}>
            <div className={classes.com}>
                <div className={classes.ava}>
                    <img src={props.item.author.profile.profile_image}/>
                </div>
                <div className={classes.container}>
                    <Card className={classes.mainComment}>
                        <div className={classes.usr}>{`${props.item.author.first_name} ${props.item.author.last_name}`}</div>
                        <div className={classes.cmt}>
                            {props.item.content}
                        </div>
                    </Card>
                    <div className={classes.bot}>
                        {props.canReply ? <div className={classes.a} onClick={() => setShowNewReply(true)}>Reply</div>: <span style={{"margin": "0 0.5rem"}}></span>}
                        <p className={classes.ago}>
                        {moment.utc(props.item.created).local().startOf('seconds').fromNow()}</p>
                    </div>
                </div>
            </div>
            <div className={classes.children}>
                {props.children}
                {showNewReply ? <NewComment post_id={props.post_id} updateComments={props.updateComments} reply_of={props.item.id}/> : null}
            </div>
        </div>
    );
};

export default Comment;
