import React,{Component} from 'react' 
import UserCard from '../components/UserCard'
import SideBar from '../components/sideBar'


function UsersPage(){
    
    return(
        < div style={{display:"flex", justifyContent:"space-around"}} >  
            <UserCard name="Anish" status="You dropped this Kimg 👑" />
            <UserCard name="Anish" status="You dropped this Kimg 👑" />
            <UserCard name="Anish" status="You dropped this Kimg 👑" />
            <UserCard name="Pranav" status="You dropped this Kimg 👑" />
        </div>
    );
}
export default UsersPage;