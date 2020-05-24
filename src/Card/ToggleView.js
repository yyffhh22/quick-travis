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

const ToggleButtonsView = ({ showView, setShowView }) => {
    const handleShowView = (event, newShowView) => {
        if (newShowView !== null) {
            setShowView(newShowView);
        }
    };

    const classes = useStyles();

    return (
        <Grid container spacing={2}>
            <Grid item sm={12} md={6}>
                    <ToggleButtonGroup
                        value={showView}
                        exclusive
                        onChange={handleShowView}
                        aria-label="visualization"
                        className={classes.toggleContainer}
                    >
                        <ToggleButton value="BAR" aria-label="centered" className={classes.toggleButton}>
                            <div className={classes.toggleButton}> Bar </div>
                        </ToggleButton>
                        <ToggleButton value="LINE" aria-label="centered" >
                            <div className={classes.toggleButton}> Line </div>
                        </ToggleButton>
                        <ToggleButton value="AREA" aria-label="centered" className={classes.toggleButton}>
                            <div className={classes.toggleButton}> Area </div>
                        </ToggleButton>
                    </ToggleButtonGroup>
            </Grid>
        </Grid>
    );
}

export default ToggleButtonsView;