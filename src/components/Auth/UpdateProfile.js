import React, { useRef, useState } from "react"
//import { Form, Button, Card, Alert } from "react-bootstrap"
import {Paper, Grid, Typography, TextField, FormControl as Form, FormGroup, FormControl, FormLabel, Card, CardContent, Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
//import { useAuth } from "../../contexts/AuthContext";
import { useAuth } from "../../Auth"
import { Link, useHistory } from "react-router-dom"

export default function UpdateProfile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const displaynameRef = useRef();
  const { currentUser, updatePassword, updateEmail } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  function handleSubmit(e) {
    e.preventDefault()
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    const promises = []
    setLoading(true)
    setError("")

    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value))
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value))
    }

    Promise.all(promises)
      .then(() => {
        history.push("/")
      })
      .catch((err) => {
        console.log(err);
        setError(`Failed to update account: ${err.message}`);
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <Card>
        <CardContent>
          <Grid container spacing={2} justify="center" direction="row">
              <Grid item>
                <Grid
                container
                direction="column"
                justify="center"
                spacing={2}
                className="signup-form"
                >
                  <Paper
                    variant="elevation"
                    elevation={2}
                    className="login-background"                  
                  >
                    <Grid item>
                      <br></br>
                      <Typography component="h1" variant="h5">
                      Update Service Provider Profile
                      </Typography>
                      {error && <Alert severity="error" variant="outlined">{error}</Alert>}
                      <br></br>
                    </Grid>
                    <Grid item>
                      <form onSubmit={handleSubmit}>
                        <Grid container direction="column" spacing={2} alignItems="center">
                          <Grid item>
                            <TextField label="Email" type="email" inputRef={emailRef} required 
                            defaultValue={currentUser.email} variant="outlined" />
                          </Grid>
                          <Grid item>
                            <TextField label="Password" type="password" inputRef={passwordRef} 
                              placeholder="Leave blank to keep the same" variant="outlined" 
                            />
                          </Grid>
                          <Grid item>
                            <TextField label="Password Confirm" type="password" 
                              inputRef={passwordConfirmRef} placeholder="Leave blank to keep the same" 
                              variant="outlined" 
                            />
                          </Grid>                          
                          <Grid item>
                            <TextField label="Name" type="text" inputRef={displaynameRef} 
                              placeholder="First Last" fullWidth name="displayname" variant="outlined" 
                              required>
                            </TextField>
                          </Grid>                             
                          <Grid item>
                            <Button variant="contained" color="primary" type="submit" 
                              className="button-block" disabled={loading}
                            >
                              Update
                            </Button>
                            <br></br>
                            <br></br>
                          </Grid>                        
                        </Grid>
                      </form>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Grid container spacing={0} justify="center" direction="row">      
          <Link to="/">Cancel</Link>
          </Grid>
        </CardContent>
      </Card>      
    </>
  )
}
