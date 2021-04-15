import React, { useState, useContext } from 'react';
import SideBar from '../components/sideBar';
import TopBar from '../components/topBar';
import '../styles/ProfilePage.css'
import {Button,Grid,Box,Avatar} from '@material-ui/core';
import UserContext from "../contexts/userContext";
function ProfilePage() {
    const [image, setImage] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    let user = useContext(UserContext);
    let imgurl = user.user.profile_url;
    let username = user.user.username;
    const uploadImage = () => {
        console.log(image);
        const data = new FormData();
        data.append("upload_preset", "pkftr8lo");
        data.append("file", image);
        fetch("https://api.cloudinary.com/v1_1/dcowmd6uf/image/upload", {
            method: "post",
            body: data
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                console.log(data.error);
            }
            else {
                console.log("url below :");
                console.log(data.url);
                postPicture(data.url);
                return (data);
            }
        })
    }

    const postPicture = pic => {
        console.log(`injecting to DB ${pic}`);
        fetch(`http://localhost:5000/api/users/${user.user.user_id}/update/profile`, {
            method: "PUT",
            body: JSON.stringify({profile_url:pic}),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        })
    }
    return ( <>   
            {/* <TopBar/> */}
            <div className="content-wrapper">
            {/* <div >
                <SideBar/>
            </div> */}
            <div  className="real-content-wrapper" style={{/* border:"solid black" ,*/ width:"100%"}}>
                <div className="profile-card-wrapper">
                    
                    <div className="avatar-row">
                    <div className
                    ="nondecor">
                    <div className="avatar-wrapper">
                    <Avatar alt={username} src={imgurl} style={{height:"150px",width:"150px"}}>A</Avatar>
                    </div>
                    </div>
                    <div className="editbutton" /* style={{width:"725.25px"}} */>
                    <input accept="image/*" id="icon-button-file" type="file" onChange={(e) => setImage(e.target.files[0])} />
                    <Button variant="contained" onClick={uploadImage}>UPLOAD</Button>
                    </div>
                    </div>
                    
                    
                    <div id="username">
                        <h5 style={{width:"192px"}}>Username</h5><h5 style={{width:"370px"}}>{username}</h5>                       
                    </div> 
                    

                    
                    <div className="label-wrapper">
                        <h5 style={{width:"192px"}}>Email</h5><h5 style={{width:"370px"}}>{user.user.email}</h5>                       
                    </div> 
                    
                    <div className="label-wrapper">
                        <h5 style={{width:"192px"}}>City</h5><h5 style={{width:"370px"}}>{user.user.city}</h5>                       
                    </div> 
                     
                </div>
                {/* <div clssname="proile-card-wrapper" style={{border:"solid balck"}}>
                    <h5> Hello Kevin</h5>
                </div> */}
            </div>
            </div>
            </>
    );
}

export default ProfilePage;