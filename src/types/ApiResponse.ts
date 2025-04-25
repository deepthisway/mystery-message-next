// whenever there is a response, the res shuld follow the guideline of this type
// i.e res should look like this
import { Message } from "@/model/User"; // can be some API res where only the message has been send by the user
export interface ApiResponse {
    success:  boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>
}