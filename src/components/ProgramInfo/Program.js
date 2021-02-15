import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom"
import { makeStyles } from '@material-ui/styles'
import {Grid, Card, CardContent, CardActions, Typography, Button } from '@material-ui/core';
import firebase from '../../firebase';


const useStyles = makeStyles({
    resourceContainer:{
        paddingTop: "20px",
        paddingLeft: "50px",
        paddingRight: "50px",
    }
})


const displayResource = (program) => {

    return (
        <Grid item xs={12} >
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        {program.name}
                    </Typography>
                    <Typography  color="textSecondary" gutterBottom>
                        A program of {program.organizationName}
                        <br />
                    </Typography>
                    <Typography variant='subtitle2'>
                        Program Description:
                    </Typography>
                    
                    <Typography variant="body2" component="p">
                        {program.description}
                    </Typography>
                    <br />
                    <Typography variant='subtitle2'>
                        Program Eligibility:
                    </Typography>
                    <Typography variant="body2" component="p">
                        {program.program_eligibility}
                        
                    </Typography>
                    <br />
                    <Typography variant='subtitle2'>
                        Referral Process:
                    </Typography>
                    <Typography variant="body2" component="p">
                        {program.referral.process}
                       
                    </Typography>
                    <br />
                    <Typography variant='subtitle2'>
                        Referral Contact:
                    </Typography>
                    <Typography variant="body2" component="p">
                        {program.referral.contact}
                        
                    </Typography>
                    <br />
                    <Typography variant='subtitle2'>
                        Referral Email:
                    </Typography>
                    <Typography variant="body2" component="p">
                        {program.referral.email}
                        
                    </Typography>
                    <br />
                    <Typography variant='subtitle2'>
                        Referral Phone:
                    </Typography>
                    <Typography variant="body2" component="p">
                        {program.referral.phone}
                        
                    </Typography>
                    <br />

                    <Typography  color="textSecondary">
                        <br />
                        {program.referral.website}
                        <br />
                    </Typography>
                    <CardActions>
                        <NavLink to={{pathname: `/`}}>Back</NavLink>
                    </CardActions>    
                </CardContent>
            </Card>
        </Grid>
    )
}

const Program = (props) => {
    const classes = useStyles();
    const { match } = props;
    const { params } = match;
    const { program_ID } = params;
    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        const fetchProgram = async () => {
            const db = firebase.firestore()
            const programRef = db.collection("programs")
            //`const snapshot =` await programRef.where('externalId', '==', parseInt(`${externalId}`) ).get()
            const recId = program_ID
            const snapshot = await programRef.where('externalId', '==', recId).get()
            setPrograms(snapshot.docs.map(doc => doc.data()))
            console.log('record id is: ' + program_ID)
        }
        fetchProgram()


    }, [program_ID])

    return(
        
        <>
            <Grid container spacing={2} className={classes.resourceContainer}>
                    {programs.map((program) =>(
                        displayResource(program)
                    )
                    )}

            </Grid>


        </>
    )
}

export default Program;