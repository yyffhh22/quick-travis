import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const useStyles = makeStyles((theme) => ({
    toggleContainer: {
        width:"250px"
    },
    togglebutton:{
        width: "100px"
    }
}));

const ToggleButtons = ({ showGoals, setShowGoals }) => {
    const handleShowGoals = (event, newShowGoals) => {
        if (newShowGoals !== null) {
            setShowGoals(newShowGoals);
        }
    };

    const classes = useStyles();

    return (
        <Grid container spacing={2}>
            <Grid item sm={12} md={6}>
                    <ToggleButtonGroup
                        value={showGoals}
                        exclusive
                        onChange={handleShowGoals}
                        aria-label="text alignment"
                        className={classes.toggleContainer}
                    >
                        <ToggleButton value="ALL" aria-label="centered" >
                            <div className={classes.toggleButton}> Show All </div>
                        </ToggleButton>
                        <ToggleButton value="TODO" aria-label="centered" className={classes.toggleButton}>
                            <div className={classes.toggleButton}> Show To-Do </div>
                        </ToggleButton>
                    </ToggleButtonGroup>
            </Grid>
        </Grid>
    );
}

export default ToggleButtons