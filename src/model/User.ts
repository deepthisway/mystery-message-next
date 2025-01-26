import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date
}

const MessageSchema : Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isAcceptingMessage: boolean;
    messages: Message[];
    isVerified: boolean
}

const UserSchema : Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required!!"],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required!!"],
        match: [/.+\@.+\..+/, 'Please user a valid email']
    },
    password: {
        type: String,
        required: [true, "Password is required!!"]
    },
    verifyCode: {
        type: String, 
        required: true
        },
    verifyCodeExpiry: {
        type: Date,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        required: true,
        default: false
        },
    messages: [MessageSchema]       // message schema is a custom data type now, so it can be assignned;

})

// in next js, as it works on Edge, we need to apply 2 condtioons to export model. 
// there are two conditions, first check that if it already exists, second-> if doesnt exist, create it again. 

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UserSchema);

export default UserModel;
