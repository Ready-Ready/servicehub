import React, { useContext, useEffect, useState } from 'react';
import firebase from './firebase';

export const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext)
}

const getUserProvider = (db, user) => {

    return new Promise(async (resolve, reject) => {
        try {
            var data = await db.collection("userProviders").where("createdByUser", "==", user.uid).get();

            if (data.empty) {

                reject('unable to get userProvider custom data');    

            } else {
                resolve(data);
            }
            
        } catch(err) {
            reject('error getting userProvider data');
        }

    })
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser ] = useState(null);
    const [pending, setPending ] = useState(true);

    function logout() {
        setCurrentUser();
        return firebase.auth.signOut();
    }

    function updateEmail(email) {
        //console.log('got into update email');
        try {
            return currentUser.updateEmail(email);
        } catch(err) {
            return (`error updating email: ${err}`, null);
        }
        
    }    

    function updatePassword(password) {
        return currentUser.updatePassword(password)
    }    

    useEffect(() => {
        firebase.auth().onAuthStateChanged(async (user) =>{
            //look up service providers custom fields
            const db = firebase.firestore();
            if(user){
                //const data = await db.collection("userProviders").where("createdByUser", "==", user.uid).get();
                try{
                    const data = await getUserProvider(db, user);
                    user.customData = [];
                    if (data.empty) {
                        console.log('No matching userProviders documents.');
                        return;
                    }  

                    data.forEach(doc => {
                        //console.log(doc.id, '=>', doc.data());
                        user.customData.push(doc.data());
                    });                    
                } catch(err) {
                    console.log('Error with getUserProvider promise');
                    console.log(err);                    
                }               

            }

            setCurrentUser(user)
            setPending(false)
        });
    }, []);

    if(pending){
        return <>Loading... </>
    }

    const value = {
        currentUser,
        logout,
        updateEmail,
        updatePassword
      }    

    return(
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>


    );
};