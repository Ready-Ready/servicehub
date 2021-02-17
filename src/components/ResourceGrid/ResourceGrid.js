import React from 'react';
import {  Grid, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import ResourceCard from '../ResourceCard/ResourceCard';


const useStyles = makeStyles({
    resourceContainer:{
        paddingTop: "20px",
        paddingLeft: "50px",
        paddingRight: "50px",
    }
})



const ResourceGrid = ({isLoading, resources}) => {
    const classes = useStyles();

    return (
        <Grid container justify="center">
        { isLoading ? (
            <Grid item className={classes.resourceContainer}>
            <CircularProgress />
            </Grid>

            ) : (
                <Grid container spacing={2} className={classes.resourceContainer}>
                    {resources.map((resource, rIdx) => (
                        
                            <ResourceCard key={rIdx} resource={resource}></ResourceCard>
                        
                    )
                    )}

                </Grid>

            )}

        </Grid>
       
    )
}

export default ResourceGrid;