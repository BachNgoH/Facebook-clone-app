import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faComment,
    faShareFromSquare,
} from "@fortawesome/free-regular-svg-icons";
import React, { useState } from "react";
import Card from "../ui/Card";
import classes from "./Post.module.css";
import moment from "moment";
import { Link} from "react-router-dom";
import CommentList from "./CommentList";
import Reaction from "../reacts/Reaction";
import NewPostForm from "./NewPostForm";
import Modal from "../ui/Modal";


const Post = (props) => {
    const [showNewShare, setShowNewShare] = useState(false)
    const [commentIsShowed, setCommentIsShowed] = useState(false)
    const [commentCount, setCommentCount] = useState(props.item.comment_count)
    
    return (
        <Card className={classes.listItem}>
            <div className={classes.upper}>
                <div className={classes.ava}><img src={props.item.author.profile.profile_image} /> </div>
                <div className={classes.usr}>
                    <Link to={`/profile/${props.item.author.id}`}>{`${props.item.author.first_name} ${props.item.author.last_name}`}</Link>
                    <div className={classes.timeago}>
                        {moment.utc(props.item.created).local().startOf('seconds').fromNow()}
                    </div>
                </div>
            </div>
            <div className={classes.content}>
                {props.item.content}
            </div>
            {props.item.is_nested && <div className={classes.shared}>{props.children}</div>}
            {!props.inshare && <div className={classes.bottom}>
                <Reaction react_count={props.item.react_count} post_id={props.item.id} user={props.user}/>
                <div onClick={() => {setCommentIsShowed(true)}}>
                <FontAwesomeIcon icon={faComment} className={classes.comment} />
                <span className={classes.count}>
                {commentCount}
                </span>
                </div>
                {commentIsShowed && <CommentList onClose={() => setCommentIsShowed(false)} id={props.item.id} changeCommentCount={setCommentCount}/>}
                
                
                <div onClick={() => setShowNewShare(true)}>
                <FontAwesomeIcon icon={faShareFromSquare} className={classes.share}/>
                <span className={classes.count}>
                {props.item.shared_count}
                </span>
                </div>
                {showNewShare && <NewPostForm onClose={() => setShowNewShare(false)} post={
                    <Post item={props.item.is_nested ? props.children.props.item: props.item} refresh={props.refresh} inshare={true}/>
                } refresh={props.refresh} shared_post_id={props.is_nested ? props.children.props.item.id: props.item.id}/>}
            </div>}
        </Card>
    );
};

export default Post;
