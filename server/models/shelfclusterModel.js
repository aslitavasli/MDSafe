import mongoose from "mongoose";

const shelfClusterSchema = new mongoose.Schema(
    {
        x1: {
            type:Number,
            required:true,
        },
        y1: {
            type:Number,
            required:true
        },
        x2: {
            type:Number,
            required:true
        },
        y2: {
            type:Number,
            required:true
        },
        rotate: {
            type:Number,
            required:true
        },
        startCallNumber: {
            type:Number,
            required:true
        },
        floor: {
            type: mongoose.Schema.Types.ObjectId, // Change type to ObjectId
            ref: 'Floor', // Reference the Floor model
            required:true

        },
        endCallNumber: {
            type:Number,
            required:true
        },
        numShelves: {
            type:Number,
            required:true
        },
        callNumberBoundaries: {
            type:Array,
            required:true
        },
        doubleLeft: {
            type:Boolean,
            required:true
        },
        doubleRight: {
            type:Boolean,
            required:true
        }
    },
    {
        timestamps:true,
    }
);

export const Shelfcluster = mongoose.model("shelfCluster", shelfClusterSchema);