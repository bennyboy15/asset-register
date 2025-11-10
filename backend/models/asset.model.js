import mongoose from "mongoose";

const assetSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    assetImage: {
        type: String
    },
    lastService: {
        type: Date,
    },
    nextService: {
        type: Date,
    },  
    responsible_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {timestamps: true});

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;