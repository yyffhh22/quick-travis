import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Slider from "@material-ui/core/Slider";
import { TextField } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import clsx from 'clsx';
import Badge from '@material-ui/core/Badge';
import ClearIcon from '@material-ui/icons/Clear';
import NotificationsIcon from "@material-ui/icons/Notifications";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import SeeMore from "./SeeMore"
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import firebase from "../shared/firebase";

const db = firebase.database().ref();

const useStyles = makeStyles({
  root: {
    margin: "auto",
    minWidth: "35%",
    boxShadow: "3px 3px 25px 2px rgba(0,0,0,0.5)",
    // marginLeft: "5%",
    // marginRight: "5%",
    // overflow: "auto",
    // marginTop: "50px",
    // display: "inline-block",
    // border: "1px solid black"
  },
  title: {
    fontSize: 14,
  },
  table: {
    tableLayout: "auto",
    width: "99.9%",
    marginTop: "0px",
    marginBottom: "10px",
  },
  marginless: {
    margin: 0,
  },
  tableCont: {
    width: "300",
  },
  progressFilled1: {
    size: "small",
    backgroundColor: "#14ECF5", //our own special blue
    border: "1px solid black",
  },
  progressFilled2: {
    size: "small",
    backgroundColor: "#14F58E", //our own special green
    border: "1px solid black",
  },
  progressUnfilled: {
    size: "small",
    border: "1px solid black",
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
  weekDays: {
    size: "small",
    borderBottom: "1px solid black",
    paddingBottom: "0px",
    paddingTop: "10px",
    textAlign: "center",
    width: "50px",
  },
  onDays: {
    size: "small",
    borderBottom: "1px solid black",
    paddingBottom: "0px",
    paddingTop: "10px",
    textAlign: "center",
    width: "50px",
    backgroundColor: "#14ECF5",
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
    borderRadius: "50%",
  },
  goalCircle: {
    backgroundColor: "white",
  },
  backCircle: {
    backgroundColor: "black",
  },
});

const ArchiveCard = ({ goal, user }) => {
  const [progress, setProgress] = useState(0);
  const [checkedIn, setCheckedIn] = useState(false);
  
  const [circle1Ref, setCircle1Ref] = useState(React.createRef());
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

  const [backCircleRef, setBackCircleRef] = useState(React.createRef());
  const [backCircleLeft, setBackCircleLeft] = useState(0);
  const [backCircleTop, setBackCircleTop] = useState(0);
  const [backCircleRadius, setBackCircleRadius] = useState(0);

  const [fullCardRef, setFullCardRef] = useState(React.createRef());

  const [creatorName, setCreatorName] = useState("");
  const [inviteeName, setInviteeName] = useState("");

  const [lastRemindDay, setLastRemindDay] = useState(-1);
  const [open, setOpen] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    const setGoalUserNames = (snap) => {
      if (snap.val()) {
        setCreatorName(
          snap.val()[goal["groupMembers"]["creator"]]["name"].split(" ")[0]
        );
        setInviteeName(
          snap.val()[goal["groupMembers"]["invitee"]]["name"].split(" ")[0]
        );
      }
    };

    const dbUsers = firebase.database().ref("users");
    dbUsers.on("value", setGoalUserNames, (error) => alert(error));
    return () => {
      dbUsers.off("value", setGoalUserNames);
    };

    let users = Object.keys(goal["progress"]);
    for (let j = 0; j <= getDayOn(); j++) {
      if (goal["progress"][users[0]][j] == undefined) {
        db.child("goals")
          .child(goal["key"])
          .child("progress")
          .child(users[0])
          .child(j)
          .set(0);
        //console.log("updating db for goal " + goal.key + " for user " + users[0]);
      }
      if (goal["progress"][users[1]][j] == undefined) {
        db.child("goals")
          .child(goal["key"])
          .child("progress")
          .child(users[1])
          .child(j)
          .set(0);
        //console.log("updating db for goal " + goal.key + " for user " + users[1]);
      }
    }
  }, []);

  useEffect(() => {
    setProgress(getProgress);
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

  const saveProgress = (event, value) => {
    setProgress(event.target.value);
  };

  const updateProgress = (event, value) => {
    const onDayNum = getDayOn();
    if (progress === "") {
      alert("Not a number");
    } else {
      db.child("goals")
        .child(goal["key"])
        .child("progress")
        .child(user.uid)
        .child(onDayNum)
        .set(parseInt(progress));
      setCheckedIn(true);
    }
  };

  const handleSliderChange = (e, newValue) => {
    const onDayNum = getDayOn();
    db.child("goals")
      .child(goal["key"])
      .child("progress")
      .child(user.uid)
      .child(onDayNum)
      .set(newValue);
  };

  const setReminder = () => {
    alert("You have reminded your friend!");
    const onDayNum = getDayOn();
    if (user.uid === goal.groupMembers.creator) {
      db.child("goals")
        .child(goal["key"])
        .child("lastRemindInvitee")
        .set(onDayNum);
    } else {
      db.child("goals")
        .child(goal["key"])
        .child("lastRemindCreator")
        .set(onDayNum);
    }
  };

  const getReminder = () => {
    const onDayNum = getDayOn();
    if (user.uid === goal.groupMembers.creator) {
      return goal["lastRemindCreator"];
    } else {
      return goal["lastRemindInvitee"];
    }
  };

  const deleteGoal = () => {
    if(user.uid===goal.groupMembers.creator) {
      db.child('users').child(goal.groupMembers.creator).child('goals').child(goal.key).set(null);
      db.child('goals').child(goal.key).child('deleted').set(true);
    }
    else {
      db.child('users').child(goal.groupMembers.invitee).child('invites').child(goal.key).set(null);
      db.child('goals').child(goal.key).child('deleted').set(true);
    }
    // db.child('goals').child(goal.key).set(null);
  }

  const archiveGoal = () => {
    if(user.uid===goal.groupMembers.creator) {
      db.child('goals').child(goal.key).child('archivedCreator').set(true);
    }
    else {
      db.child('goals').child(goal.key).child('archivedInvitee').set(true);
    }
    setOpen(false);
    // db.child('goals').child(goal.key).set(null);
  }

  return (
    <Badge
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      color="secondary"
      badgeContent={<NotificationsIcon fontSize="small" />}
      invisible={
        !(
          getDayOn() === lastRemindDay &&
          goal["progress"][user.uid][getDayOn()] < goal["minimum"]
        )
      }
    >
      <Badge 
      badgeContent={<ClearIcon onClick={()=>setOpen(true)}/>} 
      color="primary"
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      >
        <Dialog open={open} onClose={()=>setOpen(false)}>
          <DialogContent>
            Are you sure you want to delete this goal?
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>setOpen(false)}>Cancel</Button>
            {goal.confirmed? <Button onClick={archiveGoal}>Archive</Button> : null}
            <Button onClick={deleteGoal}>Delete</Button>
          </DialogActions>
        </Dialog>
        <Card className={classes.root}>
          <CardContent>
            <div style={{ width: "80%", display: "inline-block" }}>
              <Typography variant="h5" component="h2">
                {goal["title"]}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                <br></br>
                <br></br>
                Started: {goal["startDate"]}
                <br></br>
                Duration: {goal["duration"] + ' Weeks'}  
                <br></br>
                Ended: {new Date(new Date(goal["startDate"]).getTime() + goal["duration"] * 7 * 24 * 60 * 60 * 1000).getMonth() + 1 + "/" + new Date(new Date(goal["startDate"]).getTime() + goal["duration"] * 7 * 24 * 60 * 60 * 1000).getDate() + "/" + new Date(new Date(goal["startDate"]).getTime() + goal["duration"] * 7 * 24 * 60 * 60 * 1000).getFullYear()}
                
              </Typography>
            </div>
            <div
              style={{ width: "20%", display: "inline-block", float: "right" }}
            >
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className={classes.ourSpecialBlue}>
                      {" "}
                      {creatorName}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.ourSpecialGreen}>
                      {" "}
                      {inviteeName}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div style={{textAlign:'center', display:'inline-block', width:'100%'}}><div style={{textAlign:'center'}}>
            <CheckCircleIcon style={{fontSize:100, color: '#14F58E', marginLeft:'auto', marginRight:'auto'}}/>
            </div></div>
            <br></br>
            

            {/* <Slider
            style={{ width: "95%", marginLeft: "2%", float: "center" }}
            defaultValue={5}
            getAriaValueText={(value) => value}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={1}
            onChange={handleSliderChange}
            marks
            min={0}
            max={15}
            /> */}

            <div style={{textAlign:'center', display:'inline-block', width:'100%'}}><div style={{textAlign:'center'}}>            
                <SeeMore buttonText={'Review Goal'} goal={goal} />
              </div>
              </div>
          </CardContent>
        </Card>
      </Badge>
    </Badge>
  );
};

export default ArchiveCard;
