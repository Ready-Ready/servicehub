import React, { useState } from 'react'


const SearchBox = ({ getQuery }) => {
    const [text, setText] = useState('')

    const onChange = (q) => {
        setText(q)
        getQuery(q)
    }

    return (
       <div style={{display: 'flex',  marginTop: 20, justifyContent:'center', alignItems: 'center'}}>
        <section className="search">
            <form>
                <input 
                    width="100%" 
                    type="text"
                    placeholder="Search Program"
                    value={text}
                    onChange={(e) =>onChange(e.target.value)}
                    autoFocus
                />
            </form>
            
        </section>
     </div> 
    )
}

export default SearchBox
