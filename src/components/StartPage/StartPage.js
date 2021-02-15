import React from 'react';
import { AuthProvider, useAuth } from "../../contexts/AuthContext"
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import Program from '../ProgramInfo/Program';
import FindResource from '../FindResources/FindResources';
import Signup from "../Auth/Signup";
import Login from "../Auth/Login";
import SignIn from "../../SignIn";
import UpdateProfile from "../Auth/UpdateProfile";

const StartPage = () => {
  //const { currentUser, logout } = useAuth();

    return(
      <>
          <AuthProvider>
            <NavBar />
            <Switch>
                <Route 
                  exact 
                  path="/" 
                  render={(props) => <FindResource {...props} />} 
                />
                <Route 
                  exact
                  path="/programs/:program_ID"
                  render={(props) => <Program {...props} />}
                />
                <Route path="/signup" component={Signup} />
                <Route path="/login" component={Login} />
                <Route path="/signin" component={SignIn} />
                <Route path="/profile" component={UpdateProfile} /> 
            </Switch>
          </AuthProvider>

      </>
    )
}

export default StartPage;