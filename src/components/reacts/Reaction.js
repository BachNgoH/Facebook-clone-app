import React, { useContext, useEffect, useState } from "react";
import classes from './Reaction.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHeart
} from "@fortawesome/free-regular-svg-icons";
import {
    faHeart as faHeartFill,
    faThumbsUp,
    faFaceGrinSquintTears,
    faFaceSurprise,
    faFaceTired,
    faFaceSadCry
}  from "@fortawesome/free-solid-svg-icons" 
import { sendRequest } from "../../store/extra";
import AuthContext from "../../store/auth";

const Reaction = (props) => {
    const [showReactionOpt, setShowReactionOpt] = useState(false)
    const reactOptions = {
        "NONE": faHeart,
        "LOVE": faHeartFill,
        "LIKE": faThumbsUp,
        "HAHA": faFaceGrinSquintTears,
        "SADD": faFaceSadCry,
        "WOWW": faFaceSurprise,
        "AGRY": faFaceTired,
    }
    const authCtx = useContext(AuthContext)
    const [react, setReact] = useState("NONE")
    const [reactId, setReactId] = useState(null)
    const [reactCount, setReactCount] = useState(props.react_count)

    useEffect(() => {


        const getAllReacts = async () => { 

            if (react === "NONE") {
                if (reactId) {
                    await sendRequest(`api/post/react/delete/${reactId}`, "DELETE", null, authCtx.authTokens.access)
                }
            }else {
                await sendRequest(`api/post/react/`, "POST", JSON.stringify({
                    react_type: react,
                    post: props.post_id
                }), authCtx.authTokens.access)
            }

            
            const response = await sendRequest(`api/post/react/${props.post_id}`, 'GET', null, authCtx.authTokens.access);
            const data = await response.json()
            setReactCount(data.length)
            const currReact = data.find(element => element.author.id === authCtx.currentUser.id)
            if (currReact) {
                setReact(currReact.react_type)
                setReactId(currReact.id)
            }else {
                setReact("NONE")
            }
        }
        getAllReacts()
    }, [react])

    return (
        <div onMouseEnter={()=> {setShowReactionOpt(true)}} onMouseLeave={() => setShowReactionOpt(false) }>
            {showReactionOpt && <div className={classes.reactSelect}>
                <FontAwesomeIcon icon={faHeartFill} className={classes.react} size="2x" style={{"color": "var(--main-red)"}} onClick={() => setReact("LOVE")}/>
                <FontAwesomeIcon icon={faThumbsUp} className={classes.react} size="2x" style={{"color": "#1877F2"}} onClick={() => setReact("LIKE")}/>
                <FontAwesomeIcon icon={faFaceGrinSquintTears} className={classes.react} size="2x" style={{"color": "#fbc204"}} onClick={() => setReact("HAHA")}/>
                <FontAwesomeIcon icon={faFaceSadCry} className={classes.react} size="2x" style={{"color": "#fbc204"}} onClick={() => setReact("SADD")}/>
                <FontAwesomeIcon icon={faFaceSurprise} className={classes.react} size="2x" style={{"color": "#fbc204"}} onClick={() => setReact("WOWW")}/>
                <FontAwesomeIcon icon={faFaceTired} className={classes.react} size="2x" style={{"color": "var(--main-red)"}} onClick={() => setReact("AGRY")}/>
            </div>}
            <FontAwesomeIcon icon={reactOptions[ react ]} className={classes.heart} onClick={() => {
                if(react === "NONE"){
                    setReact("LOVE")
                }else{
                    setReact("NONE")
                }
            }}/>
            <span className={classes.count}>{reactCount}</span>
        </div>
    );
};

export default Reaction;
