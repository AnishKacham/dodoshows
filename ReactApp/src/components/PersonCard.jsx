import React, { Component, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useHistory, withRouter } from "react-router";
import {
  CheckCircleFill,
  CheckSquareFill,
  PlusCircleFill,
  Trash2Fill,
  TrashFill,
  XCircleFill,
} from "react-bootstrap-icons";
import { Card, Alert, Button, Image } from "react-bootstrap";
function PersonCard(props) {
  let history = useHistory();
  const [friendStyles, setFriendStyles] = useState({
    border: "",
    text: "Add Friend",
    buttonVariant: "success",
    logo: <PlusCircleFill style={{ verticalAlign: "text-bottom" }} />,
  });
  const [friendStatus, setFriendStatus] = useState(props.friendStat);
  useEffect(() => {
    switch (friendStatus) {
      case 0:
        setFriendStyles({
          border: "",
          text: "Add Friend",
          buttonVariant: "success",
          logo: <PlusCircleFill style={{ verticalAlign: "text-bottom" }} />,
        });
        break;
      case 1:
        setFriendStyles({
          border: "warning",
          text: "Cancel Req",
          buttonVariant: "danger",
          logo: <XCircleFill style={{ verticalAlign: "text-bottom" }} />,
        });
        break;
      case 2:
        setFriendStyles({
          border: "success",
          text: "Unfriend",
          buttonVariant: "danger",
          logo: <TrashFill style={{ verticalAlign: "text-bottom" }} />,
        });
        break;
      case 3:
        setFriendStyles({
          border: "warning",
          text: "Accept",
          buttonVariant: "success",
          logo: <CheckSquareFill style={{ verticalAlign: "text-bottom" }} />,
        });
    }
  }, [friendStatus]);
  const accFriend = (id) => {
    console.log(`trying to accept req from ${id}`);
    fetch(`/api/users/accept/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    /*         .then(res=>res.json())
        .then(json=>{
            console.log(json);
            console.log(`friend request accepted from ${id}`);
        }) */
    setFriendStatus(2);
  };
  const addFriend = (id) => {
    /* etFriend(1);
        set({
            text:"Cancel Req",
            logo:<XCircleFill style={{verticalAlign:"text-bottom"}}/>
        });
        console.log("added as friend"); */
    fetch(`/api/users/request/${id}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    /*         .then(res=>res.json())
        .then(json=>{
            console.log(json);
            console.log(`friend request sent to ${id}`);
        }) */
    setFriendStatus(1);
  };
  const removeFriend = (id) => {
    /* setFriend(0);
        set({
            text:"Add Friend",
            logo:<PlusCircleFill style={{verticalAlign:"text-bottom"}}/>
        }); */
    fetch(`/api/users/unfriend/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    /*         .then(res=>res.json())
        .then(json=>{console.log(json);
                        console.log("unfriended")}); */
    console.log(`removed friend ${id}`);
    setFriendStatus(0);
  };

  return (
    <Container>
      <br />
      <Card
        border={friendStyles.border}
        style={{
          width: "12rem",
          borderWidth: "1.5px",
          border: "solid",
          boxShadow: "0 2.8px 2.2px rgba(0, 0, 0, 0.034),0 6.7px 5.3px rgba(0, 0, 0, 0.048),0 12.5px 10px rgba(0, 0, 0, 0.06), 0 22.3px 17.9px rgba(0, 0, 0, 0.072),0 41.8px 33.4px rgba(0, 0, 0, 0.086),0 100px 80px rgba(0, 0, 0, 0.12)",
          borderColor: "#DEE2E6",
          maxHeight: "20rem",
          borderRadius: "15px",
        }}
      >
        <Card.Body>
          <Image
            style={{minHeight:"146px",minWidth:"146px"}}
            src={props.pic}
            roundedCircle
            fluid
            thumbnail
          />
          <br />
          <br />
          <Card.Title onClick={()=>history.push(`/users/${props.personKey}/lists`)}>{props.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {props.city}
          </Card.Subtitle>
          {friendStatus != 3 ? (
            <Button
              size="sm"
              onClick={() =>
                friendStatus === 0
                  ? addFriend(props.personKey)
                  : removeFriend(props.personKey)
              }
              variant={friendStyles.buttonVariant}
            >
              {friendStyles.logo} {friendStyles.text}
            </Button>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                size="sm"
                onClick={() => accFriend(props.personKey)}
                variant="success"
              >
                <CheckCircleFill style={{ verticalAlign: "text-bottom" }} />{" "}
                Accept
              </Button>
              <Button
                onClick={() => {
                  removeFriend(props.personKey);
                }}
                size="sm"
                variant="secondary"
              >
                <TrashFill />
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
export default PersonCard;
