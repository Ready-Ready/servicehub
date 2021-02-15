import React, { useRef, useState } from "react"
//import { Form, Button, Card, Alert } from "react-bootstrap"
import {Paper, Grid, Typography, TextField, FormControl as Form, FormGroup, FormControl, FormLabel, Card, CardContent, Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"

export default function Login() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      history.push("/")
    } catch {
      setError("Failed to log in")
    }

    setLoading(false)
  }

  return (
    <div>
    <Card>
      <CardContent>
        <Grid container spacing={0} justify="center" direction="row">
          <Grid item>
            <Grid
            container
            direction="column"
            justify="center"
            spacing={2}
            className="login-form"
            >
              <Paper
              variant="elevation"
              elevation={2}
              className="login-background"
              >
                <Grid item>
                  <Typography component="h1" variant="h5">
                  Sign in
                  </Typography>
                  {error && <Alert severity="error" variant="outlined">{error}</Alert>}
                </Grid>
                <Grid item>
                  <form onSubmit={handleSubmit}>
                    <Grid container direction="column" spacing={2} alignItems="center">
                      <Grid item>
                        <TextField type="email" inputRef={emailRef} placeholder="Email" fullWidth name="username" variant="outlined" required autoFocus
                        />
                      </Grid>
                      <Grid item>
                        <TextField type="password" inputRef={passwordRef} placeholder="Password" fullWidth name="password" variant="outlined" required
                        />
                      </Grid>
                      <Grid item>
                        <Button variant="contained" color="primary" type="submit" className="button-block" disabled={loading}>
                        Submit
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Grid>
                <Grid item>
                  <Link to="/forgot-password" variant="body2">Forgot Password?</Link>
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
          Need an account? <Link to="/signup">Sign Up</Link>
        </Grid>              
      </CardContent>
    </Card>
    </div>
  )
}
