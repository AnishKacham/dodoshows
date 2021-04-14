import React,{Component,useState} from 'react'
import { Container } from 'react-bootstrap'; 
import {PlusCircleFill,TrashFill,XCircleFill} from 'react-bootstrap-icons'
import {Card,Alert,Button,Image} from 'react-bootstrap'
function UserCard(props){
    const [friendshipStatus,set] = useState({
        text:"Add Friend",
        logo:<PlusCircleFill style={{verticalAlign:"text-bottom"}}/>
    })
    const [isFriend,setFriend] = useState(0);
    const addFriend = ()=>{
        setFriend(1);
        set({
            text:"Cancel Req",
            logo:<XCircleFill style={{verticalAlign:"text-bottom"}}/>
        });
        console.log("added as friend");
    }
    const removeFriend = ()=>{
        setFriend(0);
        set({
            text:"Add Friend",
            logo:<PlusCircleFill style={{verticalAlign:"text-bottom"}}/>
        });
        console.log("removed as friend");
    }
    
    return(
        <Container>
            <br/>
            <Card style={{ width: '11rem', borderWidth:'1.5px' ,border:'solid',boxShadow:'3px 3px #DEE2E6', borderColor:'#DEE2E6', maxHeight:'20rem', borderRadius:'15px'}}>
                <Card.Body>
                    <Image src='https://pbs.twimg.com/profile_images/1209872683791343621/jyNHTtaD_400x400.jpg' roundedCircle fluid thumbnail/>
                    <br/><br/>
                    <Card.Title>
                        {props.name}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{props.status}</Card.Subtitle>
                    <Button onClick={isFriend===0 ? addFriend : removeFriend} variant={isFriend===0 ? 'primary' : isFriend===1 ? 'warning' : 'success'}>{friendshipStatus.logo} {friendshipStatus.text}</Button>        
                </Card.Body>
            </Card>
        </Container>
    
    );
}
export default UserCard;