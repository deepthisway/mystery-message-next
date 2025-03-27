import { verifySchema } from '@/Schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const VerifyOtp = () => {
    const params = useParams();
    const route  = useRouter();
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })
    const onSubmit = async(data : z.infer<typeof verifySchema>) => {
        const res = axios.post('/api/verify-code', {
            username: params.username,
            otp: data.otp
        });
    }
  return (
    <div>VerifyOtp</div>
  )
}

export default VerifyOtp