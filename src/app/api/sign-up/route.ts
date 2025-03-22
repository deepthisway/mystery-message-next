import dbConnect from "@/lib/dbConnect"; // need dbConnect at each route becuase next works on edge
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest } from "next/server";
import { ApiResponse } from "@/types/ApiResponse";
export async function POST(request : NextRequest) {
    await dbConnect();
    // console.log("request to signup")
    try {
        const {username, email, password} = await request.json();
        // check if the user exist with same username and unverified
        const existingFoundWithUsernameAndVerified = await UserModel.findOne({username,
            isVerified: true
        })

        const OTP = Math.floor(100000 + Math.random() * 9000000).toString();

        const exisitingFoundWithEmail = await UserModel.findOne({email})
        // console.log("existingFoundWithEmail", exisitingFoundWithEmail);
        
        if(exisitingFoundWithEmail)  {
            if(exisitingFoundWithEmail.isVerified)  {
                return Response.json({
                    status: false,
                    message: "Email already exist and verified"
                },{
                    status:400
                })
            }
            // userexist but not verified
            else{
                // send OTP to user again to verify.
                const hashedPassword = await bcrypt.hash(password,10 );
                exisitingFoundWithEmail.password = hashedPassword;
                exisitingFoundWithEmail.verifyCode = OTP;
                exisitingFoundWithEmail.verifyCodeExpiry = new Date(Date.now() + 360000);
                await exisitingFoundWithEmail.save();
            }
        } else{
            const hashedPassword = await bcrypt.hash(password,10);
            // create expiry date
            const codeExpiryDate = new Date();
            codeExpiryDate.setHours(codeExpiryDate.getHours() + 1); // 1hr expiry
            const user = new UserModel({
                username,
                    email,
                    password: hashedPassword,
                    verifyCode: OTP,
                    verifyCodeExpiry: codeExpiryDate,
                    isAcceptingMessage: true,
                    messages: [],
                    isVerified: false
            })
            // console.log("user being saved",user);
            
            try {
                const res = await user.save(); // Add try-catch to handle specific save errors
            } catch (saveError) {
                console.error("Error saving user:", saveError);
                return Response.json({
                    status: false,
                    message: "Error saving user"
                }, {
                    status: 500
                });
            }
        }

        // send verifiacatipn email 

        const emailResponse = await sendVerificationEmail(email, username, OTP )
        if(!emailResponse.success)  {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {
                status: 500
            })
        }
        return Response.json({
            success: true,
            message: "Verification email sent successfully. Please Verify"
        }, {
            status: 200
        })


    } catch (error) {
        console.error("Error registering User");
        return Response.json({
            status: false,
            message: "error registering user"
        }, {
            status: 500
        })
    }
}


