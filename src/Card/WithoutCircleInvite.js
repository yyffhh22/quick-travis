import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
//import clsx from 'clsx';
import firebase from "../shared/firebase";

const db = firebase.database().ref();

const useStyles = makeStyles({
  root: {
    width:"100%"
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  ourSpecialBlue: {
    backgroundColor: "#14ECF5", //our own special blue
    padding: "5px",
  },
  ourSpecialGreen: {
    backgroundColor: "#14F58E", //our own special green
    padding: "5px",
  },
  shape1: {
    backgroundColor: "#14ECF5",
    opacity: 0.5,
  },
  shape2: {
    backgroundColor: "#14F58E",
    opacity: 0.5,
  },
  shapeCircle: {
    borderRadius: '50%',
  },
  goalCircle: {
    backgroundColor: "white",
  },
  backCircle: {
    backgroundColor: "black", 
  },
});

const Invite = ({ goal, user }) => {
  const [progress, setProgress] = useState(0);
  const [creatorName, setCreatorName] = useState('');
  
  /*const [circle1Ref, setCircle1Ref] = useState(React.createRef());
  const [circle2Ref, setCircle2Ref] = useState(React.createRef());
  const [circle1Left, setCircle1Left] = useState(0);
  const [circle1Top, setCircle1Top] = useState(0);
  const [circle1Radius, setCircle1Radius] = useState(0);
  
  const [circle2Left, setCircle2Left] = useState(0);
  const [circle2Top, setCircle2Top] = useState(0);
  const [circle2Radius, setCircle2Radius] = useState(0);
  
  const [goalCircleRef, setGoalCircleRef] = useState(React.createRef());
  const [goalCircleLeft, setGoalCircleLeft] = useState(0);
  const [goalCircleTop, setGoalCircleTop] = useState(0);
  const [goalCircleRadius, setGoalCircleRadius] = useState(0);

  const [backCircleLeft, setBackCircleLeft] = useState(0);
  const [backCircleTop, setBackCircleTop] = useState(0);
  const [backCircleRadius, setBackCircleRadius] = useState(0);

  const [fullCardRef, setFullCardRef] = useState(React.createRef());
  */

  const classes = useStyles();
  
  useEffect(() => {
    let users = Object.keys(goal["progress"]);
    for(let j = 0; j <= getDayOn(); j++){
      if(goal["progress"][users[0]][j] == undefined){
        db.child("goals")
          .child(goal["key"])
          .child("progress")
          .child(users[0])
          .child(j)
          .set(0);
          //console.log("updating db for goal " + goal.key + " for user " + users[0])
      }
      if(goal["progress"][users[1]][j] == undefined){
        db.child("goals")
          .child(goal["key"])
          .child("progress")
          .child(users[1])
          .child(j)
          .set(0);
          //console.log("updating db for goal " + goal.key + " for user " + users[1])

      }
    }
  }, []);

  useEffect(() => {
    setProgress(getProgress);
    {/*const fullCardWidth = fullCardRef.current.offsetWidth;
    const circle1Radius = (fullCardWidth*0.30) * (goal["progress"][user.uid][getDayOn()] / goal["minimum"])
    //console.log("lebelo cinco: " + goal["progress"][user.uid][getDayOn()])
    //console.log("lebelo sixo: " + goal["progress"]['minimum'])
    const goalRadius =  fullCardWidth * 0.3;
    const backRadius = fullCardWidth * 0.31; 

    setBackCircleRadius(backRadius)
    setBackCircleTop(0) 
    setBackCircleLeft(fullCardWidth / 2 - backRadius / 2)

    setGoalCircleRadius(goalRadius);
    setGoalCircleTop(0 - goalRadius / 2 + backRadius / 2) 
    setGoalCircleLeft(fullCardWidth / 2 - goalRadius / 2)

    const circle2Radius = (fullCardWidth * 0.3) * (goal["groupMembers"]["invitee"][getDayOn()] / goal['minimum'])
    setCircle1Radius(circle1Radius);
    setCircle2Radius(circle2Radius);
    setCircle1Left(fullCardWidth / 2 - circle1Radius / 2);
    setCircle1Top(0 - circle1Radius / 2 + backRadius / 2);
    setCircle2Left(fullCardWidth / 2 - circle2Radius / 2);
    setCircle2Top(0 - circle2Radius / 2 + backRadius / 2);*/}
  }, [goal]);

  const getDayOn = () => {
    var startdate = new Date(goal["startDate"]);
    var currentdate = new Date();
    let deltatime = currentdate.getTime() - startdate.getTime();
    let deltadays = Math.floor(deltatime / (1000 * 3600 * 24));
    return deltadays;
  };

  const getProgress = () => {
    const onDayNum = getDayOn();
    const checkedIn = goal["progress"][user.uid][onDayNum];
    return checkedIn;
  };

  const accept = () => {
    db.child("goals").child(goal["key"]).child("confirmed").set(true);
    alert("accept!");
  };

  const reject = () => {
    //delete goals
    alert("reject!");
  };

  useEffect(() => {
    const setCreatorNameCallback = (snap) => {
      if (snap.val()) {
        setCreatorName(
          snap.val()[goal["groupMembers"]["creator"]]["name"]//.split(" ")[0]
        )
      }
    };
    const dbUsers = firebase.database().ref("users");
    dbUsers.on("value", setCreatorNameCallback, (error) => alert(error));
    return () => {
      dbUsers.off("value", setCreatorNameCallback);
    };
  }, []);

  return (
    <Card className={classes.root}>
      <CardContent>
        <div style={{ width: "70%", display: "inline-block" }}>
          <Typography variant="h5" component="h2">
            {goal["title"]}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            <br></br>
            Invite From: {creatorName}
            <br></br>
            Start Date: {goal["startDate"]}
            <br></br>
            Duration: {goal["duration"]}
            <br></br>
            Daily Goal: {goal["minimum"]} {goal["metric"]}
          </Typography>
        </div>
        {/*<div ref={fullCardRef} style={{position: "relative", height: backCircleRadius * 1.05, width: '100%'}}>
            <div style={{overflow: "visible", position: "absolute", left: backCircleLeft, top:backCircleTop, width: backCircleRadius, height: backCircleRadius}} className={clsx(classes.backCircle, classes.shapeCircle)} />
            <div ref={goalCircleRef} style={{overflow: "visible", position: "absolute", left: goalCircleLeft, top:goalCircleTop, width: goalCircleRadius, height: goalCircleRadius}} className={clsx(classes.goalCircle, classes.shapeCircle)} />
            <div ref={circle1Ref} style={{overflow: "visible", position: "absolute", left: circle1Left, top:circle1Top, width: circle1Radius, height: circle1Radius}} className={clsx(classes.shape1, classes.shapeCircle)} />
            <div ref={circle2Ref} style={{overflow: "visible", position: "absolute", left: circle2Left, top:circle2Top, width: circle2Radius, height: circle2Radius}} className={clsx(classes.shape2, classes.shapeCircle)} />      
        </div>*/}
        <Container style={{ marginLeft: "auto", marginRight: "auto", display: "inline-block"}}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            style={{float: "left", marginBottom: "10px" }}
            onClick={accept}
          >
            Accept
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            style={{float: "right", marginBottom: "10px"}}
            onClick={reject}
          >
            Reject
          </Button>
        </Container>
      </CardContent>
    </Card>
  );
};

export default Invite;
