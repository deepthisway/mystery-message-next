'use client'
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { signInSchema } from '@/Schemas/signInSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const SignIn = () => {
    const router = useRouter();
    const {toast} = useToast();
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues:{
            username: "",
            password: ""
        }
    })
    const onSubmit = async (data : z.infer<typeof signInSchema>)  =>  {
        try {
            const response = await axios.post('/api/sign-in', data);
            toast({
                title: "Signed in",
                description: response.data.message
            })
            router.replace('/');
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMsg = axiosError.response?.data.message; // holds the API response body.
            toast({
                title: "Error signing in",
                description: errorMsg
            })
        }

    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Sign In
          </h1>
          <p className="mb-4">Enter the sign in details </p>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
            
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
        </div>
        </div>
    </div>
  )
}

export default SignIn