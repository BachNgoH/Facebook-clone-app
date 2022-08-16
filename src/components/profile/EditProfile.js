import Modal from "../ui/Modal";
import React, { useState, useContext } from "react";
import ProfilePartAdd from "./ProfilePartAdd";
import classes from "./EditProfile.module.css";
import DatePicker from "react-date-picker";
import Button from "../ui/Button";
import AuthContext from "../../store/auth";

const EditProfile = (props) => {
    const [birthDate, setBirthDate] = useState(
        new Date(props.user.profile.date_of_birth)
    );
    const [gender, setGender] = useState(props.user.profile.gender);
    const [profileImage, setProfileImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [bio, setBio] = useState(props.user.profile.bio);
    const [bioIsShowed, setBioIsShowed] = useState(true);

    const authCtx = useContext(AuthContext);
    console.log(props.user.profile.profile_image, "IN PROFILE");

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (profileImage) formData.append("profile_image", profileImage);
        if (coverImage) formData.append("cover_image", coverImage);
        formData.append("gender", gender);
        formData.append("date_of_birth", birthDate.toISOString().split("T")[0]);
        formData.append("bio", bio);

        const response = await fetch(
            "http://localhost:8000/api/user/profiles/update",
            {
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + authCtx.authTokens.access,
                },
                body: formData,
            }
        );
        
        if (response.ok){
            if (formData.keys.length > 0){
                alert("Edit profile successfully")
            }
            props.onUpdate();
        } else {
            alert("Something went wrong...")
        }
    };

    return (
        <Modal onClose={props.onClose}>
            <form className={classes.main} onSubmit={submitHandler}>
                <h2>EDIT PROFILE</h2>
                <hr></hr>
                <div>
                    <ProfilePartAdd
                        name="profile image"
                        id="profile_img"
                        type="image"
                        onChange={(e) => setProfileImage(e.target.files[0])}
                    />
                    <div className={classes.container}>
                        <div className={classes.ava}>
                            <img src={profileImage ? URL.createObjectURL (profileImage) : props.user.profile.profile_image  } />
                        </div>
                    </div>

                    <ProfilePartAdd
                        name="cover image"
                        id="cover_image"
                        type="image"
                        onChange={(e) => setCoverImage(e.target.files[0])}
                    />
                    <div className={classes.container}>
                        <div className={classes.cover}>
                            <img src={ coverImage ? URL.createObjectURL( coverImage) : props.user.profile.cover_image } />
                        </div>
                    </div>

                    <ProfilePartAdd
                        name="BIO"
                        onClick={() => setBioIsShowed((prev) => !prev)}
                        showbio={bioIsShowed}
                    />
                    <div className={classes.container}>
                        <div className={classes.bio}>
                            {bioIsShowed &&
                                !bio &&
                                "Write something about you..."}
                            {bioIsShowed && bio}
                            {!bioIsShowed && (
                                <textarea
                                    className={classes.biotext}
                                    placeholder="Write something about you..."
                                    onChange={(e) => setBio(e.target.value)}
                                    value={bio ? bio: ""}
                                />
                            )}
                        </div>
                    </div>
                    <div className={classes.dob}>DATE OF BIRTH</div>
                    <div className={classes.container}>
                        <DatePicker
                            className={classes.calendar}
                            onChange={setBirthDate}
                            value={birthDate}
                        ></DatePicker>
                    </div>
                    <div className={classes.gContainer}>
                        <div>GENDER</div>
                        <Button className={classes.gBtn} type="button">
                            <select
                                onChange={(e) => setGender(e.target.value)}
                                value={gender}
                            >
                                <option value="M">MALE</option>
                                <option value="F">FEMALE</option>
                                <option value="O">OTHERS</option>
                            </select>
                        </Button>
                    </div>
                    <div className={classes.sContainer}>
                        <Button className={classes.sBtn}>SAVE</Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default EditProfile;
