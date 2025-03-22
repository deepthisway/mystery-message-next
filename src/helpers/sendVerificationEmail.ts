import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifycode: string
) : Promise< ApiResponse > {     // Promise< ApiResponse > is the return type of this fxn 
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: ['delivered@resend.dev'],
            subject: 'Verification Code from Mystery Message',
            react: VerificationEmail({username, otp: verifycode }) // the email template you have created
          });
          
          return {
            success: true,
            message: "Email sent successfully"
          }

    } catch (emailError) {
        console.log("Error sending Verif Email", emailError);
        return {
            success: false,
            message: "Error sending verification email"}; // response has to be of type API response to make all the response standard
        }
        
    }






