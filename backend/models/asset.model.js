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
}, {timestamps: true});

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;