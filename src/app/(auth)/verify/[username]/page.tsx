'use client'
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/Schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { NextResponse } from 'next/server';
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const VerifyOtp = () => {
    const params = useParams();
    const route  = useRouter();
    const {toast} = useToast();
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })
    const onSubmit = async(data : z.infer<typeof verifySchema>) => {
        try {
            const res = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code
            });
            toast({
                title: "OTP verified",
                description: res.data.message
            })
            route.replace('/sign-in');
        } catch (error) {
            console.log("Error in verify code", error);
            const axiosError = error as AxiosError<ApiResponse>
            const errorMsg = axiosError.response?.data.message
            toast({
                title: "Error verifying code",
                description: errorMsg
            })
        }
    }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-800'>
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify your account
          </h1>
          <p className="mb-4">Enter the verification code</p>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage/>
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

export default VerifyOtp