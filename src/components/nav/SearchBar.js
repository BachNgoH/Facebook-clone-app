import React, { useContext, useEffect } from "react";
import classes from "./SearchBar.module.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Card from "../ui/Card";
import { useInput } from "../../utils/customHooks";
import { sendRequest } from "../../store/extra";
import AuthContext from "../../store/auth";
import { useHistory } from "react-router-dom";

const SearchBar = () => {

    const [isFocused, setIsFocused] = useState(false);
    const [showResults, setShowResults] = useState(false)
    const [query, queryInput, setQuery] = useInput({type: "text", placeholder: "Search..."})
    const [results, setResults] = useState(null)
    const authCtx = useContext(AuthContext)
    const history = useHistory()

    const onFocusHandler = () => {
        setIsFocused(true);
    };

    const onBlurHandler = () => {
        setIsFocused(false);
    };

    useEffect(() => {
        if (query === ""){
            setShowResults(false)
        }else {
            setShowResults(true)
        }

        const sendQuerry = async () =>{
            if (query !== ""){
                const response = await sendRequest(`api/search/user?q=${query}&n=3`, null, null , authCtx.authTokens.access)
                const data = await response.json()
                setResults(
                    data.map((element) => {
                        return <div key={element.id} className={classes.indieRes} onClick= {() => {
                            history.push(`/profile/${element.id}`)
                            setQuery("")
                            setShowResults(false)
                        }}>
                        <div className={classes.ava}><img src={element.profile.profile_image} /></div>
                        <div>{element.first_name} {element.last_name}</div>
                    </div>
                    })
                )
            }
        }
        sendQuerry()
    }, [query])

    return (
        <form
            className={`${classes.searchBar} ${
                isFocused ? classes.searchBarForcus : ""
            }`}
            onFocus={onFocusHandler}
            onBlur={onBlurHandler}
            onSubmit={(e) => {
                e.preventDefault()
                history.push(`/search/all?q=${query}`)
                setQuery("")
            }}
        >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            {queryInput}
            {showResults && <Card className={classes.res}>
                {results}
             </Card>}
        </form>
    );
};

export default SearchBar;
