
import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import SearchBox from "../SearchBox/SearchBox";
import ResourceGrid from "../ResourceGrid/ResourceGrid";
import { useAuth } from "../../Auth";

const FindResource = () => {
    const[resources, setResources] = useState([]);
    const[isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState('')
    const { currentUser } = useAuth();

    useEffect(() => {
        
        const fetchResources = async () =>{
            setIsLoading(true)
            const db = firebase.firestore()
            const data = await db.collection("programs").orderBy("name").startAt(query).endAt(query + "\uf8ff").get()
            const myData = data.docs.filter((doc, dIdx) => {
                
                if(currentUser.customData[0].programs.findIndex(a => a.id === doc.id)!==-1) {
                    return true;
                } else {
                    return false;
                }
            });
            //setResources(data.docs.map(doc => doc.data()));
            setResources(myData.map(doc => doc.data()));
            //setResources(myData);
            setIsLoading(false);

        }
        fetchResources()
    }, [query]);

    return (
        <div className="container">
            <SearchBox getQuery={(q) => setQuery(q)} />
            <h1>My Approved Programs</h1>
            <ResourceGrid isLoading={isLoading} resources={resources} />
            <h1>My Draft Programs</h1>
        </div>
    )
}

export default FindResource