'use Client'

// taken from the documentation of next-auth
// https://next-auth.js.org/getting-started/client
// https://next-auth.js.org/getting-started/client#sessionprovider
import { SessionProvider } from "next-auth/react"
export default function AuthProvider({
    children,
} : {children : React.ReactNode}) {
    return (
        <SessionProvider >
            {children}
        </SessionProvider>
        )
}
