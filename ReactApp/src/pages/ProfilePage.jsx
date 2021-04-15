import React, { useContext } from 'react';
import SideBar from '../components/sideBar';
import TopBar from '../components/topBar';
import '../styles/ProfilePage.css'
import {Button,Grid,Box,Avatar} from '@material-ui/core';
import UserContext from "../contexts/userContext";
function ProfilePage() {
    let user = useContext(UserContext);
    let imgurl = user.user.profile_url;
    let username = user.user.username;
    return ( <>   
            <TopBar/>
            <div className="content-wrapper">
            <div >
                <SideBar/>
            </div>
            <div  className="real-content-wrapper" style={{border:"solid black", width:"100%"}}>
                <div className="profile-card-wrapper">
                    <div className="avatar-row">
                    <div className="avatar-wrapper">
                    <Avatar alt={username} src={imgurl} style={{height:"300px",width:"300px"}}>A</Avatar>
                    </div>
                    <div className="editbutton">
                        <Button variant="contained">Edit Profile Picture</Button>
                    </div>
                    </div>
                    <div id="username">
                        <h1 style={{width:"fit-content"}}>Username</h1><h1 style={{width:"725.25px"}}>{username}</h1>                       
                    </div> 
                    <div className="label-wrapper">
                        <h1 style={{width:"fit-content"}}>Email</h1><h1 style={{width:"fit-content"}}>{user.user.email}</h1>                       
                    </div> 
                    <div className="label-wrapper">
                        <h1 style={{width:"fit-content"}}>City</h1><h1 style={{width:"725.25px"}}>{user.user.city}</h1>                       
                    </div>                
                </div>
                {/* <div clssname="proile-card-wrapper" style={{border:"solid balck"}}>
                    <h1> Hello Kevin</h1>
                </div> */}
            </div>
            </div>
            </>
    );
}

export default ProfilePage;