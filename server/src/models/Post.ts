import mongoose, { Document, Schema } from 'mongoose';

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';
export type Platform = 'instagram' | 'twitter' | 'linkedin' | 'facebook';

export interface IPost extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    topic: string;
    caption: string;
    hashtags: string[];
    mediaUrls: string[];
    platforms: Platform[];
    status: PostStatus;
    scheduledAt?: Date;
    publishedAt?: Date;
    aiGenerated: boolean;
    platformPostIds: {
        instagram?: string;
        twitter?: string;
        linkedin?: string;
        facebook?: string;
    };
    analytics: {
        likes?: number;
        comments?: number;
        shares?: number;
        impressions?: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new Schema<IPost>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    topic: {
        type: String,
        required: [true, 'Topic is required'],
        trim: true
    },
    caption: {
        type: String,
        required: [true, 'Caption is required']
    },
    hashtags: [{
        type: String,
        trim: true
    }],
    mediaUrls: [{
        type: String
    }],
    platforms: [{
        type: String,
        enum: ['instagram', 'twitter', 'linkedin', 'facebook']
    }],
    status: {
        type: String,
        enum: ['draft', 'scheduled', 'published', 'failed'],
        default: 'draft'
    },
    scheduledAt: {
        type: Date
    },
    publishedAt: {
        type: Date
    },
    aiGenerated: {
        type: Boolean,
        default: false
    },
    platformPostIds: {
        instagram: String,
        twitter: String,
        linkedin: String
    },
    analytics: {
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        impressions: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

// Index for efficient queries
postSchema.index({ userId: 1, status: 1 });
postSchema.index({ scheduledAt: 1 });

export const Post = mongoose.model<IPost>('Post', postSchema);
