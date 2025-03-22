import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../api/auth/[...nextauth]/options";
import mongoose from "mongoose";

async function GET(request : NextRequest)   {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({
            success: false,
            msg: "Cannot get the user"
        })
    }

    const user : User = session.user as User;
    const userId = user._id;
    const parsedUserId= new mongoose.Types.ObjectId;  //  we have stored ID in string, so we parse it into a real mongoose ID
                                                      // beacause that may create a problem in message aggregation
    try {
        // aggregation pipelines for smooth flow of high amount of messages
        const user = await UserModel.aggregate([
            {$match: {id:userId}},
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt' : -1}},
            {$group: {_id: '$id', messages: {$push: '$messages'}}}
        ])

        if(!user || user.length == 0)   {
            return NextResponse.json({
                success:  false,
                msg: "Cannot get messages, length is 0"
            })
        }
        return NextResponse.json({
            Success: true,
            messages: user[0].messages

        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            msg:"failed to get the user in get-messages route"
        })
    }

}