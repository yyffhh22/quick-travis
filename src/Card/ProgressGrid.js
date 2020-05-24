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
import Paper from "@material-ui/core/Paper";
import firebase from "../shared/firebase";
import Slider from "@material-ui/core/Slider";
import { TextField } from "@material-ui/core";
import Container from "@material-ui/core/Container";

const db = firebase.database().ref();

const useStyles = makeStyles({
  root: {
    width: "35%",
    marginLeft: "10%",
    overflow: "auto",
    marginTop: "50px",
    display: "inline-block",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
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
    backgroundColor: "#14F58E", //our own special red
    padding: "5px",
  },
  weekDays: {
    size: "small",
    borderBottom: "1px solid black",
    paddingBottom: "0px",
    paddingTop: "10px",
    textAlign: "center",
  },
});

const ProgressGrid = ({goal}) => {
  let classes = useStyles();
  let user1Rows = [];
  let user2Rows = [];
  let user1Cells = [];
  let user2Cells = [];

  let i = 0;
  for (i = 0; i < goal["duration"] * 7; i++) {
    if (user1Cells.length < 7) {
      user1Cells.push(
        <TableCell
          className={
            goal["progress"][goal["groupMembers"]["creator"]][i] >= goal["minimum"]
              ? classes.progressFilled1
              : classes.progressUnfilled
          }
          key={i}
        >
        i
        </TableCell>
      );
      user2Cells.push(
        <TableCell
          className={
            goal["progress"][goal["groupMembers"]["invitee"]][i] >= goal["minimum"]
              ? classes.progressFilled2
              : classes.progressUnfilled
          }
          key={i}
        ></TableCell>
      );
    } else {
      user1Rows.push(<TableRow>{user1Cells}</TableRow>);
      user1Cells = [];
      user1Cells.push(
        <TableCell
          className={
            goal["progress"][goal["groupMembers"]["creator"]][i] >= goal["minimum"]
              ? classes.progressFilled1
              : classes.progressUnfilled
          }
          key={i}
        ></TableCell>
      );
      user2Rows.push(<TableRow>{user2Cells}</TableRow>);
      user2Cells = [];
      user2Cells.push(
        <TableCell
          className={
            goal["progress"][goal["groupMembers"]["invitee"]][i] >= goal["minimum"]
              ? classes.progressFilled2
              : classes.progressUnfilled
          }
          key={i}
        ></TableCell>
      );
    }
  }
  user1Rows.push(<TableRow>{user1Cells}</TableRow>);
  user2Rows.push(<TableRow>{user2Cells}</TableRow>);

  let table = [];
  let daysOfTheWeek = (
    <TableRow>
      <TableCell className={classes.weekDays}>SUN</TableCell>
      <TableCell className={classes.weekDays}>MON</TableCell>
      <TableCell className={classes.weekDays}>TUE</TableCell>
      <TableCell className={classes.weekDays}>WED</TableCell>
      <TableCell className={classes.weekDays}>THU</TableCell>
      <TableCell className={classes.weekDays}>FRI</TableCell>
      <TableCell className={classes.weekDays}>SAT</TableCell>
    </TableRow>
  );
  for (let i = 0; i < user1Rows.length; i++) {
    table.push(
      <React.Fragment key={"tablefragment" + i}>
        <Typography className={classes.marginless} variant="body2">
          {"Week " + (i + 1)}
        </Typography>
        <Table className={classes.table}>
          <TableBody>
            {daysOfTheWeek}
            {user1Rows[i]}
            {user2Rows[i]}
          </TableBody>
        </Table>
      </React.Fragment>
    );
  }

  return (
    <TableContainer className={classes.table} aria-label="simple table">
      {table}
    </TableContainer>
  );
};

export default ProgressGrid;