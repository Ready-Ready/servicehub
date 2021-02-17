import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from "react-router-dom";
import { makeStyles } from '@material-ui/styles';
import Modal from '@material-ui/core/Modal';
import {Grid, Card, CardContent, CardActions, Typography, Button } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import firebase from '../../firebase';
import Form from "@rjsf/material-ui";

const useStyles = makeStyles((theme) => ({
    resourceContainer:{
        paddingTop: "20px",
        paddingLeft: "50px",
        paddingRight: "50px",
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      paper: {
        //backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        //boxShadow: theme.shadows[5],
        //padding: theme.spacing(2, 4, 3),
      }    
}));


const displayForm = (form, handleOpen) => {

    return (
        <Grid item xs={12} >
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        {form.type}
                    </Typography>
                    <br />
                    <Typography variant="body2" component="p">
                        {form.status}
                    </Typography>
                    <CardActions>
                            <Button variant="outlined" onClick={(e) => handleOpen(e, JSON.stringify(form.schema))}>
                                Preview Form
                            </Button>                        
                        <NavLink to={{pathname: `/`}}>Back</NavLink>
                    </CardActions>    
                </CardContent>
            </Card>
        </Grid>
    )
}

const Forms = (props) => {
    const classes = useStyles();
    const { match } = props;
    const { params } = match;
    const { program_ID } = params;
    const [forms, setForms] = useState([]);

    useEffect(() => {
        const fetchForms = async () => {
            const db = firebase.firestore();
            const programRef = db.collection("programs");
            const programSnapshot = await programRef.where('externalId', '==', program_ID).get();
            const formsSnapshot = await db.collection("programs").doc(programSnapshot.docs[0].id).collection("forms").get();
            setForms(formsSnapshot.docs.map(doc => doc.data()));
            console.log('record id is: ' + program_ID)
        }
        fetchForms();
    }, []);

    const [open, setOpen] = useState(false);
    const [formJSON, setFormJSON] = useState();
    const handleOpen = (e, schema) => {
        e.preventDefault();
        setFormJSON(schema);
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    return(
        
        <>
            <Grid container spacing={2} className={classes.resourceContainer}>
                    {forms.map((form) =>(
                            displayForm(form, handleOpen)
                        )
                    )}
            </Grid>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={open}>
                <Card>
                    <CardContent>          
                        <Typography variant="h5" component="h2">
                            Form Preview
                        </Typography>          
                        {formJSON?
                            <Form schema={JSON.parse(formJSON)} />
                            :null
                        }
                    </CardContent>
                    <CardActions>
                        <Button variant="outlined" type="button" onClick={() => setOpen(false)}>
                            Close
                        </Button>
                    </CardActions>
                </Card>
                </Fade>
            </Modal>

        </>
    )
}

export default Forms;