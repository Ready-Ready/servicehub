import React from 'react';
import { NavLink } from "react-router-dom"
import { Card, Grid, CardContent, CardActions, Typography, Button } from '@material-ui/core';
// import { makeStyles } from '@material-ui/styles';
// import firebase from '../../firebase';




const ResourceCard = ({ resource }) => {
    
    return (
        <Grid  item xs={12} sm={6}>
            <Card >
                <CardContent>
                    <Typography variant="h5" component="h2">
                        {resource.name}
                    </Typography>
                    <Typography  color="textSecondary" gutterBottom>
                        A program of {resource.organizationName}
                    </Typography>
                    <Typography variant="body2" component="p">
                        {resource.description}
                    </Typography>
                    <Typography  color="textSecondary">
                        <br />
                        {resource.referral.website}
                    </Typography>
                    <CardActions>
                        <NavLink to={{pathname: `/programs/${resource.externalId}`}}>Learn More</NavLink>
                    </CardActions>    
                </CardContent>
            </Card>
        </Grid>

    )
}

export default ResourceCard;