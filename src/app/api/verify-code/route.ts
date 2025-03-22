import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { username, code } = request.json();
    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return NextResponse.json(
        {
          status: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    const isCodeMatched = user.verifyCode === code;
    const isCodeNotExpired = new Date() < user.verifyCodeExpiry;
    if(!isCodeMatched)  {
        return NextResponse.json({
            status: false,
            message: "Code not matched"
        },{
            status: 400
        })
    }
    else if(!isCodeNotExpired)  {
        return NextResponse.json({
            status: false,
            message: "Code expired"
        },{
            status: 400
        })
    }

    else if (isCodeMatched && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return NextResponse.json(
        {
          status: true,
          message: "user verified successfully",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("Error in verify code", error);
    return NextResponse.json(
      {
        status: false,
        message: "Error verifying code",
      },
      {
        status: 500,
      }
    );
  }
}
