import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Goal from './Card/Goal'
import ArchiveCard from './Card/ArchiveCard'
import Invite from './Card/Invite'
import ToggleButtons from './Toggle'

const useStyles = makeStyles((theme) => ({
  gridcontainer: {
    marginTop: "5px"
  },
  griditem: {
    marginTop: "5px",
    marginBottom: "5px"
  },
  carditem: {
    marginLeft: "25px",
    marginRight: "25px"
  },
  inviteitem: {
  }
}));


const GoalGrid = ({ goals, invites, user, gridView}) => {
  let classes = useStyles();
  const [unfinished, setUnfinished] = useState([]);
  const [pending, setPending] = useState([]);
  const [invitelist, setInvitelist] = useState([]);
  const [showGoals, setShowGoals] = React.useState('ALL');

  const getDayOn = (goal) => {
    var startdate = new Date(goal["startDate"]);
    var currentdate = new Date();
    let deltatime = currentdate.getTime() - startdate.getTime();
    let deltadays = Math.floor(deltatime / (1000 * 3600 * 24));
    return deltadays;
  };

  useEffect(() => {
    let unfinished_temp = [];
    let pending_temp = [];
    let invitelist_temp = [];

    Object.values(goals).map(goal => goal.confirmed ? unfinished_temp.push(goal) : pending_temp.push(goal));
    Object.values(invites).map(goal => goal.confirmed ? unfinished_temp.push(goal) : invitelist_temp.push(goal));

    setUnfinished(unfinished_temp);
    setPending(pending_temp);
    setInvitelist(invitelist_temp);
  }, [goals]);

  const checkArchive = (uid, goal) =>{
    if (uid === goal["groupMembers"]["creator"]){
      return goal.archivedCreator
    }
    else{
      return goal.archivedInvitee
    }
  }

  return (
    <React.Fragment>
      {(gridView === "ACTIVE") ?
      <React.Fragment>
        <Grid container className={classes.gridcontainer} spacing={3} direction="row" justify="flex-start">
          
          <Grid item xs={12} className={classes.griditem}>
            <div>
              <div style={{ float: 'left' }}><Typography variant="h4">Active Goals</Typography></div>
              <div style={{ float: 'right' }}>{user ? <ToggleButtons showGoals={showGoals} setShowGoals={setShowGoals}></ToggleButtons> : null}</div></div>
          </Grid>

          {(showGoals === 'ALL') ? 
            unfinished.map(goals => (!checkArchive(user.uid, goals)) ?
              <Grid item className={classes.carditem}>
                <Goal goal={goals} user={user} key={goals.key} />
              </Grid> : null) 
            : 
            unfinished.map(goals => (!checkArchive(user.uid, goals) && (goals['progress'][user.uid][getDayOn(goals)] < goals['minimum'])) ?
              <Grid item className={classes.carditem} >
                <Goal goal={goals} user={user} key={goals.key} />
              </Grid> : null) 
          }
        </Grid>
        <Grid container className={classes.gridcontainer} spacing={3} direction="row" justify="flex-start">
          <Grid item xs={12} className={classes.griditem}><Typography variant="h4">Pending Goals</Typography></Grid>
            {pending.map(goals => (!checkArchive(user.uid, goals))?
              <Grid item className={classes.carditem}>
                <Goal goal={goals} user={user} key={goals.key} />
              </Grid> : null)
            }
        </Grid>
      </React.Fragment>
      : 

      (gridView === "INVITES") ?
      <React.Fragment>
        <Grid container className={classes.gridcontainer} spacing={3} direction="row" justify="flex-start">
          <Grid item xs={10} className={classes.griditem}><Typography variant="h4">New Invites</Typography></Grid>
          {invitelist.map(goals =>
            <Grid item className={classes.carditem}>
              <Invite goal={goals} user={user} key={goals.key} />
            </Grid>
          )}
        </Grid>
      </React.Fragment>
      : 
      <Grid container className={classes.gridcontainer} spacing={3} direction="row" justify="flex-start">
          <Grid item xs={12} className={classes.griditem}><Typography variant="h4">Archive</Typography></Grid>
          {unfinished.map(goals => checkArchive(user.uid, goals) ?
            <Grid item className={classes.carditem}>
              <ArchiveCard goal={goals} user={user} key={goals.key} />
            </Grid> : null)
          }
      </Grid>}

    </React.Fragment >
  );
};

export default GoalGrid;