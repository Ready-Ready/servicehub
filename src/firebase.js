
import firebase from 'firebase/app';
import "firebase/auth"


const firebaseConfig = {
  apiKey: "AIzaSyBcW8OkeZrG-2fVqPyvkBCXfaIM_fFzNI8",  
  authDomain: "portal-resource.firebaseapp.com",
  projectId: "portal-resource",
  storageBucket: "portal-resource.appspot.com",
  messagingSenderId: "459932923016",
  appId: "1:459932923016:web:feb2c527f58f746d455b3d"
};



// initialize Firebase
if (!firebase.apps.length) 
{
    firebase.initializeApp(firebaseConfig);
}
else 
{
    firebase.app(); // if already initialized, use this one
}

export const auth = firebase.auth()
export default firebase