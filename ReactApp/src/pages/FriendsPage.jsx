import React, { Component, useState, useEffect, useContext } from "react";
import "../styles/HomePage.css";
import PersonCard from "../components/PersonCard";
import SideBar from "../components/sideBar";
import TopBar from "../components/topBar";
import {
  Form,
  InputGroup,
  CardDeck,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import UserContext from "../contexts/userContext";
import { IconButton,Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import SearchBar from "../components/searchBar";
import ProfielPage from "./ProfilePage";
import "../styles/FriendsPage.css";

function FriendsPage() {
  let user = useContext(UserContext);
  const [image, setImage] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [friends, setFriends] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [friendsIDS, setFriendsIDS] = useState([]);
  const [incomingIDS, setIncomingIDS] = useState([]);
  const [outgoingIDS, setOutgoingIDS] = useState([]);
  useEffect(() => {
    console.log(user);
    if (user.user.user_id != undefined) fetchFriends();
  }, [user]);

  const [hasSelectedSearchUser, setHasSelectedSearchUser] = useState(false);
  const [searchUser, setSearchUser] = useState({});
  const [searchFriendStat, setSearchFriendStat] = useState(0);

  const getSearchUser = (user_id, username, pic, city) => {
    console.log(user_id, username);
    setSearchUser({
      user_id: user_id,
      username: username,
      profile_url: pic,
      city_name: city,
    });
    console.log(friendsIDS);
    console.log(outgoingIDS);
    console.log(incomingIDS);
    console.log(searchUser);
    if (friendsIDS.includes(parseInt(user_id))) {
      console.log("setting 2");
      setSearchFriendStat(2);
    } else if (outgoingIDS.includes(parseInt(user_id))) {
      console.log("setting 1");
      setSearchFriendStat(1);
    } else if (incomingIDS.includes(parseInt(user_id))) {
      console.log("setting 3");
      setSearchFriendStat(3);
    }

    setHasSelectedSearchUser(true);
    console.log(searchFriendStat);
  };

  const UserSearchDisplay = () => {
    if (hasSelectedSearchUser) {
      return (
        <div>
          <PersonCard
            pic={searchUser.profile_url}
            personKey={searchUser.user_id}
            name={searchUser.username}
            city={searchUser.city_name}
            friendStat={searchFriendStat}
          />
          <IconButton
            aria-label="delete"
            onClick={() => {
              setHasSelectedSearchUser(false);
              setSearchFriendStat(0);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      );
    } else {
      return (
        <SearchBar
          entryDialogue={true}
          sendResult={getSearchUser}
          type="user"
        />
      );
    }
  };

  const uploadImage = () => {
    console.log(image);
    const data = new FormData();
    data.append("upload_preset", "pkftr8lo");
    data.append("file", image);
    fetch("https://api.cloudinary.com/v1_1/dcowmd6uf/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          console.log("url below :");
          console.log(data.url);
          postPicture(data.url);
          return data;
        }
      });
  };
  // _Fucntion to post image
  const postPicture = (pic) => {
    console.log(`injecting to DB ${pic}`);
    fetch(
      `http://localhost:5000/api/users/${user.user.user_id}/update/profile`,
      {
        method: "PUT",
        body: JSON.stringify({ profile_url: pic }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );
  };
  //_Function to fetch all friends
  const fetchFriends = () => {
    fetch(`http://localhost:5000/api/users/${user.user.user_id}/friends`, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("am I authorised?");
        console.log(res);
        console.log(res.Friends);
        setFriends(res.Friends);
        setFriendsIDS(res.Friends.map((friend) => friend.user_id));
        setIncoming(res.Incoming);
        setIncomingIDS(res.Incoming.map((friend) => friend.user_id));
        setOutgoing(res.Outgoing);
        setOutgoingIDS(res.Outgoing.map((friend) => friend.user_id));
      });
  };
  return (
    <>
      <TopBar />
      <div className="page-wrapper">
        <div>
          <SideBar />
        </div>
        <div className="sureal-content-wrapper">
          <Row
            style={{
              display: "flex",
              justifyContent: "flex-start",
              width: "95%",
            }}
          >
            {/* <Col xs={2} id="sidebar-wrapper">
                    <SideBar />
                </Col> */}
            <Row
              style={{ width: "100%", marginLeft: "40px", marginTop: "20px", height:"fit-content" }}
            >
              <Col xs={6} style={{padding:"0",margin:"0",height:"fit-content"}}>
                <ProfielPage />
              </Col>
              <Col xs={3}>
              {" "}
              <div className="friend-serach-group">
                <h6>Search for users</h6>
                <UserSearchDisplay />
              </div>
              </Col>
            </Row>
            {/* <Row
              style={{
                marginLeft: "40px",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              
            </Row> */}
            <Row
              style={{
                marginTop:"20px",
                marginLeft: "20px",
                display: "flex",
                justifyContent: "flex-start",
                flexWrap:"wrap",
              }}
            >
              {friends.length > 0
              ? <div className="friend-group">
                <h6>Your Friends</h6>
                <div className="horizontaliser">
                {friends.map((friend) => {
                  return (
                    <Col key={friend.user_id} style={{ maxWidth: "20rem" }}>
                      <PersonCard
                        pic={friend.profile_url}
                        personKey={friend.user_id}
                        name={friend.username}
                        city={friend.city_name}
                        friendStat={2}
                      />
                    </Col>
                  );
                })}
                </div>
              </div>
              : <div/>}
              {outgoing.length>0
              ?<div className="friend-group">
                <h6>Sent Requests</h6>
                <div className="horizontaliser">
                {outgoing.map((outgoingreq) => {
                  return (
                    <Col
                      xs={3}
                      key={outgoingreq.user_id}
                      /* style={{ maxWidth: "20rem" }} */
                    >
                      <PersonCard
                        pic={outgoingreq.profile_url}
                        personKey={outgoingreq.user_id}
                        name={outgoingreq.username}
                        city={outgoingreq.city_name}
                        friendStat={1}
                      />
                    </Col>
                  );
                })}
                </div>
              </div>
              :<div/>}
              { incoming.length > 0 
              ?<div className="friend-group">
                <h6>Pending Requests</h6>
                <div className="horizonatliser">
                {incoming.map((incomingreq) => {
                  return (
                    <Col
                      key={incomingreq.user_id}
                      style={{ maxWidth: "20rem" }}
                    >
                      <PersonCard
                        pic={incomingreq.profile_url}
                        personKey={incomingreq.user_id}
                        name={incomingreq.username}
                        city={incomingreq.city_name}
                        friendStat={3}
                      />
                    </Col>
                  );
                })}
                </div>
              </div>
              : <div/>} 
                  {/* <Col>
            <PersonCard name="Kevon" status="super rixch" friendStat={0} style={{maxWidth:"20rem"}}/>
            </Col>
            <Col style={{maxWidth:"20rem"}}>
            <PersonCard name="Kevon" status="super rixch" friendStat={1}/>
            </Col>
            <Col style={{maxWidth:"20rem"}}>
            <PersonCard name="Kevon" status="super rixch" friendStat={2}/>
            </Col>
            <Col>
            <PersonCard name="Kevon" status="super rixch" friendStat={3} style={{maxWidth:"13rem"}}/>
            </Col>
            <Col>
            <PersonCard name="Kevon" status="super rixch" friendStat={3} style={{maxWidth:"13rem"}}/>
            </Col>
            <Col>
            <PersonCard name="Kevon" status="super rixch" friendStat={3} style={{maxWidth:"13rem"}}/>
            </Col>
            <Col>
            <PersonCard name="Kevon" status="super rixch" friendStat={3} style={{maxWidth:"13rem"}}/>
            </Col> */} 
            </Row>
          </Row>
          {/* <Button variant="contained" color="primary">Material UI button?</Button> */}
        </div>
      </div>
    </>
  );
}
export default FriendsPage;
