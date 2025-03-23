import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";
import { NextRequest, NextResponse } from "next/server";


export async function POST (request: NextRequest)   {
    await dbConnect();

    const {username, content} = await request.json();

    // is user accepting messages
    try {
        const user = await UserModel.findOne({username});
        if(!user)   {
            return NextResponse.json({
                success: false,
                msg: "Cannot find user"
            }, 
        {status: 404})
        }
        
        // is user accepting msg
        if(!user.isAcceptingMessage) {
            return NextResponse.json({
                success: "false",
                msg : "User is not accepting messages"
            }, {
                status: 400
            })
        }

        const newMessage = {content, createdAt: new Date};
        user.messages.push(newMessage as Message);      // asserting that this is of type message, typescript issue

        await user.save();

        return NextResponse.json({
            success: true,
            msg: "Message send successfully"
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            msg: "Issue in adding messages"
        })
    }

}