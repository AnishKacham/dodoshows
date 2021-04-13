import React,{Component,useEffect,useState} from 'react'
import { Container } from 'react-bootstrap'; 
import {CheckCircleFill, CheckSquareFill, PlusCircleFill,Trash2Fill,TrashFill,XCircleFill} from 'react-bootstrap-icons'
import {Card,Alert,Button,Image} from 'react-bootstrap'
function PersonCard(props){
    const [friendshipStatus,set] = /* props.friendStat===0?  */useState({
        text:"Add Friend",
        logo:<PlusCircleFill style={{verticalAlign:"text-bottom"}}/>
    })/* : props.friendStat===1 ? useState({
        text:"Cancel Req",
        logo:<XCircleFill style={{verticalAlign:"text-bottm"}}/>
    }) : useState({
        text:"Unfriend",
        logo:<Trash2Fill style={{verticalAlign:"text-bottom"}}/>
    }) */
    const [isFriend,setFriend] = useState(props.friendStat);
    useEffect(()=>{
        if(props.friendStat===0){
            setFriend(0);
        set({
            text:"Add Friend",
            logo:<PlusCircleFill style={{verticalAlign:"text-bottom"}}/>
        });
        }
        else if(props.friendStat===1){
            setFriend(1);
            set({
                text:"Cancel Req",
                logo:<XCircleFill style={{verticalAlign:"text-bottom"}}/>
            });
        } else if(props.friendStat===2){
            setFriend(2);
            set({
                text:"Unfriend",
                logo:<TrashFill style={{verticalAlign:"text-bottom"}}/>
            });
        }
        else{
            setFriend(3);
            set({
                text:"Accept",
                logo:<CheckSquareFill style={{verticalAlign:"text-bottom"}}/>
            });
        }
    },[isFriend])
    const accFriend =(id)=>{
        console.log(`trying to accept req from ${id}`);
        fetch(`http://localhost:5000/api/users/accept/${id}`,{
            method:"PUT",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              }
        })
/*         .then(res=>res.json())
        .then(json=>{
            console.log(json);
            console.log(`friend request accepted from ${id}`);
        }) */
        setFriend(2);
    }
    const addFriend = (id)=>{
        /* etFriend(1);
        set({
            text:"Cancel Req",
            logo:<XCircleFill style={{verticalAlign:"text-bottom"}}/>
        });
        console.log("added as friend"); */
        fetch(`http://localhost:5000/api/users/request/${id}`,{
            method:"POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              }
        })
/*         .then(res=>res.json())
        .then(json=>{
            console.log(json);
            console.log(`friend request sent to ${id}`);
        }) */
        setFriend(1);
    }
    const removeFriend = (id)=>{
        /* setFriend(0);
        set({
            text:"Add Friend",
            logo:<PlusCircleFill style={{verticalAlign:"text-bottom"}}/>
        }); */
        fetch(`http://localhost:5000/api/users/unfriend/${id}`,{
        method:"DELETE",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          }
        })
/*         .then(res=>res.json())
        .then(json=>{console.log(json);
                        console.log("unfriended")}); */
        console.log(`removed friend ${id}`);
        setFriend(0);
    }
    
    return(
        <Container>
            <br/>
            <Card border={props.friendStat===2?'success':props.friendStat===1?'warning': props.friendStat===3?'danger':''} style={{ width: '12rem', borderWidth:'1.5px' ,border:'solid',boxShadow:'3px 3px', borderColor:'#DEE2E6', maxHeight:'20rem', borderRadius:'15px'}}>
                <Card.Body>
                    <Image src='https://pbs.twimg.com/profile_images/1209872683791343621/jyNHTtaD_400x400.jpg' roundedCircle fluid thumbnail/>
                    <br/><br/>
                    <Card.Title>
                        {props.name}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{props.status}</Card.Subtitle>
                    {props.friendStat != 3
                    ? <Button  size='sm' onClick={()=>(isFriend===0 ? addFriend(props.personKey) : removeFriend(props.personKey))} variant={isFriend===0 ? 'primary' : isFriend===1 ? 'warning' : 'danger'}>{friendshipStatus.logo} {friendshipStatus.text}</Button>
                    : <div style={{display:"flex",justifyContent:"space-between"}}><Button size='sm' onClick={()=>(accFriend(props.personKey))} variant='success'><CheckCircleFill style={{verticalAlign:"text-bottom"}}/> Accept</Button><Button onClick={()=>{removeFriend(props.personKey)}}size='sm' variant='secondary'><TrashFill/></Button></div>}
                           
                </Card.Body>
            </Card>
        </Container>
    
    );
}
export default PersonCard;