// the use og this route is that user can toggleusing the button if it is accepting the message or not
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request : NextRequest)   {
    await dbConnect();
       
    try {
         // get the current logged in user from the session
         const session = await getServerSession(authOptions);
         if(!session || !session.user)  {
            return NextResponse.json({
                status:false,
                msg: "Not authenticated, Not logged in"
            })
         }
         const user : User = session?.user as User; // asserted as user
         const userId = user._id;
         
         try {
            // get the user input to accept or turn off message
            const {acceptMessages} = await request.json(); // flag for accepting or turning off the messages

            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                {isAcceptingMessage: acceptMessages},
                {new: true}
                /*
                By default, findByIdAndUpdate returns the old document before the update.
                Setting { new: true } ensures it returns the updated document instead.
                */
            ) 
            if(!updatedUser)    {
                return NextResponse.json({
                    success: false,
                    message: "failed to update user state to update mesages beacuse user not found"
                }, {
                    status:401
                })
            }

            return NextResponse.json({
                success: true,
                message: "Message update state updated successfully!!"
            },{
                status: 200
            })
         } catch (error) {
            return NextResponse.json({
                success: false,
                message: "failed to update user state to update mesagess 1"
            })
         }

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "failed to update user state to update mesagess 2"
        })
    }
}

// to send the status
export async function GET(request: NextRequest) {
    await dbConnect();

    try {
        // get the session
        const session = await getServerSession(authOptions);
        if(!session || !session.user)   {
            return NextResponse.json({
                success: false,
                msg:"Cannot find user to check the message status"
            })
        }
        const user : User = session.user as User;
        const userId = user._id;

        const foundUser = await UserModel.findById({
            userId
        })

        if(!foundUser)   {
            return NextResponse.json({
                success: false,
                msg:"Cannot find user to check the message status"
            })
        }
        else{
            return NextResponse.json({
                success: true,
                msg:"user found and status as well",
                isAcceptingMessage: foundUser.isAcceptingMessage
            })
        }


    } catch (error) {
        return NextResponse.json({
            success: false,
            msg:"Cannot find user to check the message status"
        })
    }
}