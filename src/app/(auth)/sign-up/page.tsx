'use client'
import { useToast } from "@/hooks/use-toast"
import { signUpSchema } from "@/Schemas/signUpSchema"
import {zodResolver} from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useDebounceValue } from 'usehooks-ts'
import * as z from "zod"
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"

const page = () => { 
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // debounce the username to reduce the server load 
    const debouncedusername = useDebounceValue(username, 300);  // debounce the username by 300ms
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchema>>({ // this inference is optional, just for type safety 
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })
    useEffect(()=>  {
        const checkUsenameUnique = async() =>   {
            if(debouncedusername)   {
                setIsCheckingUsername(true);
                setUsernameMessage('')
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${debouncedusername}`)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError.response?.data.message ?? "Error finding unique username" )
                }
            }
        }
        checkUsenameUnique();
    }, [debouncedusername])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) =>    {
        setIsSubmitting(true);
        try {
            const res = await axios.post(`/api/sign-up`, data)
            toast({
                title: 'Success',
                description: res.data.message
            })
            router.replace(`/verify/${username}`)
            setIsSubmitting(false);
        } catch (error) {
            console.log("Error in Sign-up of user", error)
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data?.message
            toast({
                title: "Signup failed!!",
                description: errorMessage,
                variant: "destructive"
            })
        }
        setIsSubmitting(false);
    }

  return (  
    <div></div>
  )
}

export default page



