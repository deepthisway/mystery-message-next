'use client'

import {useSession, signIn, signOut} from 'next-auth/react'
export default function Component() {
    const {data : session} = useSession();
    if(session) {
        return(
            <>
            Signed in as {session.user.email} <br/>
            <button onClick={() => signOut()}>SignOut</button>
            </>
        )
    }
    return (
        <>
        Not Signed in <br/>
        <button onClick={()=>   {
            signIn()
        }}>SignIn</button>
        </>
    )
        
}