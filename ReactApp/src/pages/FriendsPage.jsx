import React,{Component,useState} from 'react' 
import PersonCard from "../components/PersonCard"
import SideBar from "../components/sideBar";
import TopBar from "../components/topBar";
import { Form,InputGroup,Button,CardDeck,Row,Col } from 'react-bootstrap';

function FriendsPage(){
    const [image,setImage] = useState("")
    const [photoURL, setPhotoURL ] = useState("");
    const uploadImage= ()=>{
    console.log(image);
    const data = new FormData();
    data.append("upload_preset","pkftr8lo");
    data.append("file",image);   
    fetch("https://api.cloudinary.com/v1_1/dcowmd6uf/image/upload",{
          method:"post",
          body:data
      })
      .then(res=>res.json())
      .then(data=>{
          if(data.error){
            console.log(data.error); 
           }
           else
           {
            console.log("url below");
            console.log(data.url);  
             }})
            }   
    
    return(
        <>  
        <input accept="image/*" id="icon-button-file" type="file" onChange={(e)=>setImage(e.target.files[0])}/>
        <Button onClick={uploadImage}>UPLOAD</Button>       
        <TopBar/> 
        <br/>
        <Row>
            <Col id="sidebar-wrapper">
              <SideBar />
            </Col>
            <Col>
                <PersonCard name="Anish" status="You dropped this Kimg 👑" />
            </Col>
            <Col>
                <PersonCard name="Anish" status="You dropped this Kimg 👑" />
            </Col>
            <Col>
            <PersonCard name="Anish" status="You dropped this Kimg 👑" />                
            </Col>
            <Col><PersonCard name="Pranav" status="You dropped this Kimg 👑" /></Col>            
          </Row>    
        </>
    );
}
export default FriendsPage;
