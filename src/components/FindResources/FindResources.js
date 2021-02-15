
import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import SearchBox from "../SearchBox/SearchBox";
import ResourceGrid from "../ResourceGrid/ResourceGrid";



const FindResource = () => {
    const[resources, setResources] = useState([]);
    const[isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState('')

    useEffect(() => {
        
        const fetchResources = async () =>{
            setIsLoading(true)
            const db = firebase.firestore()
            const data = await db.collection("programs").orderBy("name").startAt(query).endAt(query + "\uf8ff").get()
           // await db.collection("programs").orderBy("name").startAt(query).endAt(query + "\uf8ff").get()  
            setResources(data.docs.map(doc => doc.data()))
            setIsLoading(false)

        }
        fetchResources()
    }, [query])

    return (
        <div className="container">
            <SearchBox getQuery={(q) => setQuery(q)} />
            <ResourceGrid isLoading={isLoading} resources={resources} />
        </div>
    )
}

export default FindResource