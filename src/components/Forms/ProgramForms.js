import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from "react-router-dom";
import { makeStyles } from '@material-ui/styles';
import Modal from '@material-ui/core/Modal';
import {
    Grid, Card, CardContent, CardActions, Typography, Box, Button, Paper 
    , Chip, Avatar
} from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import firebase from '../../firebase';
import Form from "@rjsf/material-ui";
const formOfForms = require('./formOfForms.json');

const useStyles = makeStyles((theme) => ({
    resourceContainer:{
        paddingTop: "20px",
        paddingLeft: "50px",
        paddingRight: "50px",
    },
    modal: {
        //display: 'flex',
        position: 'absolute',
        top: '20%',
        left: '20%',
        overflow: 'scroll',
        height: '100%',
        display: 'block',
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


const displayForm = (form, handleOpen, handleOpenEdit) => {

    return (
        <Grid item xs={12} >
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        FORM TYPE: {form.type}
                    </Typography>
                    <br />
                    <Typography variant="body2" component="p">
                        FORM STATUS: {form.status}
                    </Typography>
                    <CardActions>
                            <Button variant="outlined" onClick={(e) => handleOpen(e, JSON.stringify(form.schema))}>
                                Preview Form
                            </Button>                        
                            <Button variant="outlined" onClick={(e) => handleOpenEdit(e, JSON.stringify(form.schema), form.id)}>
                                Edit Form
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
    const [program, setProgram] = useState(null);
    const [activeForm, setActiveForm] = useState(null);

    useEffect(() => {
        const fetchForms = async () => {
            const db = firebase.firestore();
            const programRef = db.collection("programs");
            const programSnapshot = await programRef.where('externalId', '==', program_ID).get();
            setProgram(programSnapshot.docs[0].id);
            const formsSnapshot = await db.collection("programs").doc(programSnapshot.docs[0].id).collection("forms").get();
            //setForms(formsSnapshot.docs.map(doc => doc.data()));
            const aryForms = [];
            formsSnapshot.docs.forEach(doc => {
                let currentID = doc.id;
                let formObj = { ...doc.data(), 'id': currentID};
                aryForms.push(formObj);
            });
            setForms(aryForms);
            //console.log('record id is: ' + program)
        }
        fetchForms();
    }, [program]);

    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [formJSON, setFormJSON] = useState();
    const handleOpen = (e, schema) => {
        e.preventDefault();
        setFormJSON(schema);
        setOpen(true);
    };

    const handleOpenEdit = (e, schema, formID) => {
        e.preventDefault();
        setFormJSON(schema);
        setOpenEdit(true);
        setActiveForm(formID);
    };    
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    const handleFormSubmit = async (e) => {
        //e.preventDefault();
        //create an object to translate the type values used in the UI to actual types that JSON Schema Forms understands
        const typeTrans = {
            "string": "string", 
            "integer": "integer", 
            "date": "string", 
            "email": "string", 
            "web address": "string", 
            "list of values": "string", 
            "list of objects": "array"
        }

        //create an object to translate the type values used in the UI to actual FORMATS that JSON Schema Forms understands
        const formatTrans = {
            "string": "", 
            "integer": "", 
            "date": "date", 
            "email": "email", 
            "web address": "uri", 
            "list of values": "", 
            "list of objects": ""
        }
        console.log('original json');
        console.dir(e.formData);
        const newSchema = {
            title: e.formData.schema.title,
            type: e.formData.schema.type,
            properties: {}
        };
        e.formData.schema.propertiesTemp.forEach(p => {
            //add the field to the properties if it's not an array of objects
            if(p.type != 'list of objects'){
                newSchema.properties[p.apiName] = {
                    title: p.title,
                    type: typeTrans[p.type],
                    format: formatTrans[p.type]
                }
                if(p.type === 'list of values'){
                    newSchema.properties[p.apiName].enum = [];
                    //Loop through the enum values inputed and add them to the enum array
                    p.enum.forEach(e => {
                        newSchema.properties[p.apiName].enum.push(e.value);
                    });
                }
            } else {
                newSchema.properties[p.apiName] = {
                    title: p.title,
                    type: 'array',
                    items: {properties: {}}
                }
                //loop through the array of fields to add to this array form
                p.arrayPropertiesTemp.forEach(i => {
                    newSchema.properties[p.apiName].items.properties[i.apiName] = {
                        title: i.title,
                        type: typeTrans[i.type],
                        format: formatTrans[i.type],
                    }
                    if(i.type === 'list of values'){
                        newSchema.properties[p.apiName].items.properties[i.apiName].enum = [];
                        i.enum.forEach(e => {
                            newSchema.properties[p.apiName].items.properties[i.apiName].enum.push(e.value);
                        });
                    }
                });
            }
        });

        const newJson = {
            type: e.formData.type,
            status: e.formData.status,
            schema: newSchema
        }

        console.log('final json');
        console.log(JSON.stringify(newJson));        

        const db = firebase.firestore();
        const formRef = db.collection("programs").doc(program).collection("forms").doc(activeForm);
        await formRef.set(newJson);

        setActiveForm(null);
        setOpenEdit(false);
    }

    return(
        
        <>
            <Grid container spacing={2} className={classes.resourceContainer}>
                    {forms.map((form) =>(
                            displayForm(form, handleOpen, handleOpenEdit)
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
            <Modal
                aria-labelledby="Edit Form Definition"
                aria-describedby="Edit Form Definition"
                className={classes.modal}
                open={openEdit}
                onClose={handleCloseEdit}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={openEdit}>
                <Card>
                    <CardContent>          
                        <Typography variant="h5" component="h2">
                            Form Edit
                        </Typography>          
                        <Form 
                            schema={formOfForms} 
                            onSubmit={handleFormSubmit}
                        />
                    </CardContent>
                    <CardActions>
                        <Button variant="outlined" type="button" onClick={() => setOpenEdit(false)}>
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