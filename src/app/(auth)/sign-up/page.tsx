'use client'
import { useToast } from "@/hooks/use-toast"
import { signUpSchema } from "@/Schemas/signUpSchema"
import {zodResolver} from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import * as z from "zod"
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"

const page = () => { 
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // debounce the username to reduce the server load 
    const debounced = useDebounceCallback(setUsername , 300);  // debounce the username by 300ms
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
            if(username)   {
                setIsCheckingUsername(true);
                setUsernameMessage('')
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`)
                    setUsernameMessage(response.data.message)
                    setIsCheckingUsername(false);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError.response?.data.message ?? "Error finding unique username" )
                }
                finally{
                  
                }
            }
        }
        checkUsenameUnique();
    }, [username])

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
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input placeholder="Username"
                    {...field}
                    onChange={(e)=> { // dont need this in raw react-hook-0form, we need username thats why did it
                        field.onChange(e)
                        debounced(e.target.value) // for the custom state we are managing
                    }}
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin"/>}
                  <p className={`text-sm ${usernameMessage === "Username is Unique" ? 'text-green-500' : "text-red-600"} `}>{usernameMessage}</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input placeholder="Email"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input placeholder="Password"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled= {isSubmitting}>
              {isSubmitting ? (<>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait
              </>) : ("Signup")}
              </Button>
            </form>
        </Form> 
        <div className="text-center mt-4">
                <p>
                  Already a member?{" "} 
                  <Link href="/sign-in" className="text-blue-500"> Sign In</Link>
                </p>
        </div>
        </div>
    </div>
  )
}

export default page



