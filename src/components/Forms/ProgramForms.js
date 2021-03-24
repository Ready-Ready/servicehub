import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from "react-router-dom";
import { makeStyles } from '@material-ui/styles';
import Modal from '@material-ui/core/Modal';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
        top: '20px',
        left: '20px',
        overflowY: 'scroll',
        height: '80%',
        width: '60%',
        display: 'block',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '5%'        
      },
    paper: {
        //backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        //boxShadow: theme.shadows[5],
        //padding: theme.spacing(2, 4, 3),
    }    
}));


const displayForm = (form, handleOpen, handleOpenEdit, handleOpenView) => {

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
                            <Button variant="outlined" onClick={(e) => handleOpenEdit(e, form, form.id)}>
                                Edit Form
                            </Button>
                            <Button variant="outlined" onClick={(e) => handleOpenView(e, form.id)}>
                                View Submissions
                            </Button>                                                                                
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
    const [formsState, setFormsState] = useState([]);
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
            setFormsState(aryForms);
            //console.log('record id is: ' + program)
        }
        fetchForms();
    }, [program]);

    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [formJSON, setFormJSON] = useState();
    const [formEditData, setFormEditData] = useState();
    const handleOpen = (e, schema) => {
        e.preventDefault();
        setFormJSON(schema);
        setOpen(true);
    };

    const handleOpenView = (e, formID) => {
        e.preventDefault();
    }

    const handleOpenEdit = (e, form, formID) => {
        e.preventDefault();
        //pre-fill the form of forms with the definitions as it is saved so far

        //this object will translate the concatenated type and format from JSON schema to the 
        //values we allow provider to select for a field type
        const typeformatTrans = {
            "string~": "string",
            "string~date": "date",
            "integer~": "integer",
            "string~email": "email",
            "string~web address": "web address",
            "array~": "list of objects",
            "string~enum": "list of values"
        }

        const formData = {};
        if(form) {
            formData.type = form.type;
            formData.status = form.status;
            formData.schema = {};
            formData.schema.title = form.schema.title;
            formData.schema.type = form.schema.type;
            formData.schema.propertiesTemp = [];
            Object.keys(form.schema.properties).forEach((p, pIdx) => {
                const formatVal = form.schema.properties[p].enum?"enum":form.schema.properties[p].format?form.schema.properties[p].format:'';
                formData.schema.propertiesTemp.push(
                    {
                        apiName: p,
                        type: typeformatTrans[`${form.schema.properties[p].type}~${formatVal}`],
                        title: form.schema.properties[p].title,
                        format: form.schema.properties[p].format
                    }
                );
                if(formatVal === "enum"){
                    formData.schema.propertiesTemp[pIdx].enum = [];
                    form.schema.properties[p].enum.forEach(v => {
                        formData.schema.propertiesTemp[pIdx].enum.push(
                            {
                                value: v
                            }
                        )                
                    })
                }

                if(typeformatTrans[`${form.schema.properties[p].type}~${formatVal}`] === 'list of objects') {
                    formData.schema.propertiesTemp[pIdx].arrayPropertiesTemp = [];
                    const tempProp = form.schema.properties[p].items.properties;
                    Object.keys(tempProp).forEach((pa, paIdx) => {
                        if(pa !== 'type'){
                            const formatVal2 = tempProp[pa].enum?"enum":tempProp[pa].format?tempProp[pa].format:'';
                            formData.schema.propertiesTemp[pIdx].arrayPropertiesTemp.push(
                                {
                                    apiName: pa,
                                    type: typeformatTrans[`${tempProp[pa].type}~${formatVal2}`],
                                    title: tempProp[pa].title,
                                    format: tempProp[pa].format
                                }
                            );
                            if(formatVal2 === "enum"){
                                formData.schema.propertiesTemp[pIdx].arrayPropertiesTemp[paIdx].enum = [];
                                tempProp[pa].enum.forEach(v => {
                                    formData.schema.propertiesTemp[pIdx].arrayPropertiesTemp[paIdx].enum.push(
                                        {
                                            value: v
                                        }
                                    )                
                                })
                            }
                        }
                    });        
                }

            });
            //console.log(formData);
            //formData.schema.propertiesTemp.push({apiName: "mikeAPI"});
        }

        setFormEditData(formData);
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
                    items: {properties: {"type": "object"}}
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
        if(activeForm){
            const formRef = db.collection("programs").doc(program).collection("forms").doc(activeForm);
            await formRef.set(newJson);
        } else {
            await db.collection("programs").doc(program).collection("forms").add(newJson);
        }


        setActiveForm(null);
        setOpenEdit(false);
    }

    return(
        
        <>
            <Grid container spacing={2} className={classes.resourceContainer}>
            <Grid item xs={12} >
                    <Card>
                        <CardContent>                    
                            <Button variant="outlined" type="button" onClick={(e) => handleOpenEdit(e, null, null)}>
                                New Form
                            </Button>
                            &nbsp;&nbsp;
                            <NavLink to={{pathname: `/`}}>Back</NavLink>
                        </CardContent>
                    </Card>
                </Grid>
                {formsState.map((form) =>(
                        displayForm(form, handleOpen, handleOpenEdit)
                    )
                )}

            </Grid>

            <Dialog // turn modal into dialog 
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                maxWidth='lg'
                open={open}
                onClose={handleClose}
                //closeAfterTransition
                //BackdropComponent={Backdrop}
               disableBackdropClick={true}
            >
                <DialogTitle id="form-preview-title">Preview Form</DialogTitle>
                <DialogActions>
                    <Button variant="outlined" type="button" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </DialogActions>
                <DialogContent  scroll={'paper'} dividers>                   
                        {formJSON?
                            <Form schema={JSON.parse(formJSON)} />
                            :null
                        }
                </DialogContent>
            </Dialog>
            <Dialog
                aria-labelledby="Edit Form Definition"
                aria-describedby="Edit Form Definition"
                //className={classes.modal}
                open={openEdit}
                onClose={handleCloseEdit}
                disableBackdropClick={true}
                maxWidth='lg'
            >
                <DialogTitle id="form-edit">Form Edit</DialogTitle>
                <DialogActions>
                    <Button variant="outlined" type="button" onClick={() => setOpenEdit(false)}>
                        Close
                    </Button>
                </DialogActions>
                <DialogContent  scroll={'paper'} dividers>        
                    <Form 
                        schema={formOfForms} 
                        formData={formEditData}
                        onSubmit={handleFormSubmit}
                    />

                </DialogContent>
            </Dialog>
        </>
    )
}

export default Forms;