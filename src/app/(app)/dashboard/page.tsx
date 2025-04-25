import { useToast } from '@/hooks/use-toast'
import { Message } from '@/model/User'
import { acceptMessageSchema } from '@/Schemas/acceptMessageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

const page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [isSwitchLoading, setSwitchLoading] = useState(false)
  const {toast} =useToast();
  const handelDeleteMessage = (messageId : string) => {
    setMessages(messages.filter((message)=> message._id !== messageId))
  }
  const {data : session} = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })
  
  return (
    <>

    </>
  )
}

export default page