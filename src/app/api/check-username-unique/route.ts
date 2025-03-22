import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import {usernameValidation} from '@/Schemas/signUpSchema'
import { z } from "zod";
import { response } from "express";
import UserModel from "@/model/User";

export async function GET(request: NextRequest) {
    // check if the request method is GET
    await dbConnect();

   try {
    // to extract the query params from the request
    const {searchParams} = new URL(request.url);
    const username = searchParams.get('username');
    // console.log("username", username);
    // validate the username
    const result = usernameValidation.safeParse(username);
    if(!result.success){
        return Response.json({
            error: result.error.format()._errors || []
        })
    }
    console.log("result", result);
    // check if the username is unique
    const exisitingUser = await UserModel.findOne({
        username, isVerified: true
    })

    if(exisitingUser)   {
        return Response.json({
            error: ["Username already taken"]
        },{
            status: 400
        })
    }
    return Response.json({
        message: "Username is Unique and available"
    });


   } catch (error) {
        console.log("Error in check username unique", error);
        return Response.json({
            status: false,
            message: "Error checking username"
        }, {
            status: 500
        })
   }


}