import {z} from 'zod';

export const messageSchema = z.object({
    content: z.string().min(10, "Msg must be atleast 10 letters")
    .max(300, "Msg can be atmost 300 letters")
})