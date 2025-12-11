import mongoose, { Document, Schema } from 'mongoose';

export interface IMedia extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    altText?: string;
    aiAnalysis?: string;
    createdAt: Date;
}

const mediaSchema = new Schema<IMedia>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    altText: {
        type: String
    },
    aiAnalysis: {
        type: String
    }
}, {
    timestamps: true
});

mediaSchema.index({ userId: 1 });

export const Media = mongoose.model<IMedia>('Media', mediaSchema);
