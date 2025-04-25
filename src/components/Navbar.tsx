'use client'

import { Button } from '@react-email/components';
import { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link';
import React from 'react'

const Navbar = () => {
    const {data : session} = useSession();
    console.log(session);
    const user : User = session?.user as User;


  return (
    <nav>
      <div>
        <a href='#' >Mystry Message</a>
        {
          session ? (
            <>
            <span>Welcome, {user?.username || user?.email}</span>
            <Button onClick={()=> signOut()}>Logout</Button>
            </>
          ) : (
            <Link href='/sign-in'>
              <Button>Login</Button>
            </Link>
          )
        }
      </div>
    </nav>
  )
}

export default Navbar