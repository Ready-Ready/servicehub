import React from 'react';
//import { AuthProvider, useAuth } from "../../contexts/AuthContext"
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import Program from '../ProgramInfo/Program';
import ProgramForms from '../Forms/ProgramForms';
import FindResource from '../FindResources/FindResources';
import Signup from "../Auth/Signup";
import Login from "../Auth/Login";
import SignIn from "../../SignIn";
import UpdateProfile from "../Auth/UpdateProfile";
import PrivateRoute from "../Auth/PrivateRoute";

const StartPage = () => {
  //const { currentUser, logout } = useAuth();

    return(
      <>
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
            <Route 
              exact
              path="/programs/:program_ID/forms"
              render={(props) => <ProgramForms {...props} />}
            />            
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/signin" component={SignIn} />
            <PrivateRoute path="/profile" component={UpdateProfile} /> 
        </Switch>
      </>
    )
}

export default StartPage;