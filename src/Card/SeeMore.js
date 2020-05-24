import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ProgressGrid from "./ProgressGrid";
import firebase from "../shared/firebase";

import {
  AreaChart, Area, BarChart, Bar, LineChart, Label, ReferenceLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import ToggleButtonsView from './ToggleView';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
    align: 'right',
  },
  yaxis:{
  	padding:'10px',
  	textAlign: 'center'
  },
}));

export default function SeeMore({ goal, buttonText }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [goalData, setGoalData] = useState([]);
  const [showView, setShowView] = React.useState('BAR');
  const [creatorName, setCreatorName] = useState([]);
  const [inviteeName, setInviteeName] = useState([]);

  const getDayOn = () => {
    var startdate = new Date(goal["startDate"]);
    var currentdate = new Date();
    let deltatime = currentdate.getTime() - startdate.getTime();
    let deltadays = Math.floor(deltatime / (1000 * 3600 * 24));
    return deltadays;
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    let tempData = []; 
    let users = Object.keys(goal["progress"]);
    for(let j = 0; j < goal["progress"][users[0]].length; j++){
      let entry = {
        name: j.toString(), 
        uv: goal["progress"][goal["groupMembers"]["creator"]][j],
        pv: goal["progress"][goal["groupMembers"]["invitee"]][j],
      }
      tempData.push(entry); 
    }
    setGoalData(tempData);
  }, [goal]);

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
  });

  return (
    <React.Fragment>
      <div>
        <div>
          <Button  
            size="medium" 
            variant="contained" 
            color="primary" 
            style={{width:"150px"}}
            onClick={handleClickOpen}>
            {buttonText ? buttonText : 'See More'}
          </Button>
        </div>
        <div>
        </div>
      </div>

      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
        style={{overflow:"scrollbar"}}
      >
        <div>
          <div style={{float:"left"}}>
            <DialogTitle id="max-width-dialog-title">{goal.title}</DialogTitle>
          </div>
          <div style={{float:"right", margin:"10px"}}>
            <ToggleButtonsView showView={showView} setShowView={setShowView}/>
          </div>
        </div>
        <DialogContent>
          <div>
            <div style={{float:'left'}}>
              <DialogContentText>
                {goal.description}
                <br></br>
                Started: {goal.startDate}
                <br></br>
                Days Left: {goal.duration * 7 - getDayOn()}
                <br></br>
              </DialogContentText>
            </div>
            <div style={{float: 'right'}}>
              { (showView === "LINE") ?
              <LineChart
                width={500}
                height={300}
                data={goalData}
                margin={{
                  top: 5, right: 30, left: 30, bottom: 30,
                }}
                className={classes.form}
              >
                <CartesianGrid strokeDasharray="3 3" />
        		    <XAxis dataKey="name">
        	   		  <Label value="Days" offset={0} position="bottom" />
        	  	  </XAxis>  			
        	  	  <YAxis className={classes.yaxis} label={{ value: goal.metric, angle: -90, position: 'left'}} />
                <Tooltip />
        			  <Legend verticalAlign="top" height={36}/>
                <Line name={creatorName} type="monotone" dataKey="uv" stroke="#8884d8" activeDot={{ r: 8 }} />
               	<Line name={inviteeName} type="monotone" dataKey="pv" stroke="#82ca9d" />
               	<ReferenceLine y={goal["minimum"]} label="Goal" stroke="green" strokeDasharray='5 5'  />
              </LineChart>
              :
              (showView === "BAR") ?
              <BarChart 
                width={500} 
                height={300} 
                data={goalData}
                margin={{
                  top: 5, right: 30, left: 30, bottom: 30,
                }}
                className={classes.form}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name">
                  <Label value="Days" offset={0} position="bottom" />
                </XAxis>
                <YAxis className={classes.yaxis} label={{value: goal.metric, angle: -90, position: 'left'}}/>
                <Tooltip />
                <Legend verticalAlign="top" height={36}/>
                <Bar name={creatorName} dataKey="uv" fill="#8884d8" />
                <Bar name={inviteeName} dataKey="pv" fill="#82ca9d" />
                <ReferenceLine y={goal["minimum"]} label="Goal" stroke="green" strokeDasharray='5 5'  />
              </BarChart>
              :
              <AreaChart 
                width={500} 
                height={300} 
                data={goalData}
                margin={{
                  top: 5, right: 30, left: 30, bottom: 30,
                }}
                className={classes.form}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name">
                  <Label value="Days" offset={0} position="bottom" />
                </XAxis>
                <YAxis className={classes.yaxis} label={{value: goal.metric, angle: -90, position: 'left'}}/>
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend verticalAlign="top" height={36}/>
                <Area name={creatorName} type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                <Area name={inviteeName} type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
                <ReferenceLine y={goal["minimum"]} label="Goal" stroke="green" strokeDasharray='5 5'  />
              </AreaChart>}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
