import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Goal from './Card/Goal'
import AddGoal from './AddGoal';
import GoalGrid from './GoalGrid';
import firebase from './shared/firebase'
import ToggleButtons from './Toggle'
import Badge from '@material-ui/core/Badge'; 
import MailIcon from '@material-ui/icons/Mail'; 
import HomeIcon from '@material-ui/icons/Home'; 
import ArchiveIcon from '@material-ui/icons/Archive'; 
import IconButton from '@material-ui/core/IconButton'; 
import Tooltip from '@material-ui/core/Tooltip';


const db = firebase.database().ref();

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  icons:{
    margin:"5px",
    color: "white"
  }
}));

const Welcome = ({ user, invites, setGridView}) => {
  const classes = useStyles();
  let count = 0;
  Object.values(invites).map(goal=>goal.confirmed?null:count++);

  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" className={classes.title} onClick={() => {window.location.reload(false)}}>
            Work2Gather
          </Typography>
          <Tooltip title="Home">
            <IconButton onClick={() => setGridView("ACTIVE")}>
              <HomeIcon className={classes.icons} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Invites">
            <IconButton onClick={() => setGridView("INVITES")}>
              <Badge 
                anchorOrigin={{
                   vertical: 'top',
                  horizontal: 'left',
                }} 
                badgeContent={count} 
                color="secondary"
                className={classes.icons}>
                <MailIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Archive">
            <IconButton  onClick={() => setGridView("ARCHIVE")}>
              <ArchiveIcon className={classes.icons}/>
            </IconButton>
          </Tooltip>
          
          <Typography variant="h6" style={{ marginLeft:"10px", float: "center", marginRight: 30 }}>
            Welcome, {user.displayName ? user.displayName.split(' ')[0] : ""}
          </Typography>
          <Button style={{ fontSize: 21 }} color="inherit" onClick={() => { setGridView("ACTIVE"); firebase.auth().signOut() }}>
            Log out
          </Button>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

const SignIn = () => (
  <StyledFirebaseAuth
    uiConfig={uiConfig}
    firebaseAuth={firebase.auth()}
  />
);

const Banner = ({ user, invites, title, setGridView }) => (
  <React.Fragment>
    {user ? <Welcome user={user} invites={invites} setGridView={setGridView}/> : <SignIn />}
  </React.Fragment>
);

const App = () => {
  const [goalsJSON, setGoals] = useState({});
  const [invites, setInvite] = useState({});
  const [user, setUser] = useState({});
  const [emailTouid, setEmailTouid] = useState({});
  const [open, setOpen] = useState(false);
  const [gridView, setGridView] = useState("ACTIVE");

  var goals = Object.values(goalsJSON);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  useEffect(() => {
    const handleData = snap => {
      if (user) {
        if (snap.val()) {
          let re = /\./gi;
          let email = user.email.replace(re, ',')
          db.child('emailTouid/' + email).set(user.uid);
          setEmailTouid(snap.val().emailTouid);
          if (!snap.val().users[user.uid]) {
            db.child("users").child(user.uid).child("name").set(user.displayName);
          }
          if (snap.val().users[user.uid] && snap.val().users[user.uid].goals) {
            let goals_arr = snap.val().users[user.uid].goals;
            setGoals(Object.values(goals_arr).map(goal => snap.val().goals[goal]));
          }
          else {
            setGoals({});
          }
          if (snap.val().users[user.uid] && snap.val().users[user.uid].invites) {
            let invites_arr = snap.val().users[user.uid].invites;
            setInvite(Object.values(invites_arr).map(goal => snap.val().goals[goal]));
          }
          else {
            setInvite({});
          }
        }
      } else {
        setGoals({});
        setEmailTouid({});
      }
    };
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData); };
  }, [user]);

  return (
    <div>
      <Banner user={user} invites={invites} title="Work2Gather" setGridView={setGridView}>
      </Banner>
      <br></br>
      {user ? <AddGoal open={open} user={user} setOpen={setOpen} emailTouid={emailTouid} /> : null}
      {user ? <Container maxWidth="xl">
        <GoalGrid goals={goals} invites={invites} user={user} gridView={gridView}/>
      </Container> : null}
    </div>
  );
}

export default App;