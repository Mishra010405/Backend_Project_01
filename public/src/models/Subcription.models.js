import mongoose , {Schema } from "mongoose";

const subscriptionscheme = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, // One who is subscribing ... 
        ref: "User"
    },

    channel: {
        type: Schema.type.ObjectId, // one to whom subscriber is subscribing...
        ref: "User"
    }


}, {timestamps: true})

export const Subscription  = mongoose.model("Subscription" , subscriptionscheme)