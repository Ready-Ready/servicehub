import React, { useRef, useState } from "react"
//import { Form, Button, Card, Alert } from "react-bootstrap"
import {Paper, Grid, Typography, TextField, FormControl as Form, FormGroup, FormControl, FormLabel, Card, CardContent, Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const displaynameRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    try {
      setError("")
      setLoading(true)
      await signup(
        emailRef.current.value
        , passwordRef.current.value
        , displaynameRef.current.value
      );
      history.push("/")
    } catch {
      setError("Failed to create an account");
    }

    setLoading(false)
  }

  return (
    <>
      <Card>
        <CardContent>
          <Grid container spacing={0} justify="center" direction="row">
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
                    <Typography component="h1" variant="h5">
                    Sign Up
                    </Typography>
                    {error && <Alert severity="error" variant="outlined">{error}</Alert>}
                  </Grid>
                  <Grid item>
                    <form onSubmit={handleSubmit}>
                      <Grid container direction="column" spacing={2} alignItems="center">
                        <Grid item>
                          <TextField type="email" inputRef={emailRef} placeholder="Email" 
                            fullWidth name="username" variant="outlined" required autoFocus>
                          </TextField>
                        </Grid>
                        <Grid item>
                          <TextField type="password" inputRef={passwordRef} placeholder="Password" 
                            fullWidth name="password" variant="outlined" required>
                          </TextField>
                        </Grid>
                        <Grid item>
                          <TextField type="password" inputRef={passwordConfirmRef} placeholder="Confirm Password" 
                            fullWidth name="password" variant="outlined" required>
                          </TextField>
                        </Grid>
                        <Grid item>
                          <TextField type="text" inputRef={displaynameRef} placeholder="Name" 
                            fullWidth name="displayname" variant="outlined" required autoFocus>
                          </TextField>
                        </Grid>                             
                        <Grid item>
                          <Button variant="contained" color="primary" type="submit" className="button-block" disabled={loading}>
                            Sign Up
                          </Button>
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
            Already have an account? <Link to="/login">Log In</Link>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}
