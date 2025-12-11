import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    avatar?: string;
    brandVoice?: string;
    preferredHashtags?: string[];
    connectedPlatforms: {
        instagram?: {
            accessToken: string;
            userId: string;
            username: string;
        };
        twitter?: {
            accessToken: string;
            accessSecret: string;
            userId: string;
            username: string;
        };
    };
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    avatar: {
        type: String,
        default: ''
    },
    brandVoice: {
        type: String,
        default: 'professional'
    },
    preferredHashtags: [{
        type: String
    }],
    connectedPlatforms: {
        instagram: {
            accessToken: String,
            userId: String,
            username: String
        },
        twitter: {
            accessToken: String,
            accessSecret: String,
            userId: String,
            username: String
        },
        facebook: {
            accessToken: String,
            userId: String,
            pageName: String
        },
        linkedin: {
            accessToken: String,
            userId: String,
            profileName: String
        }
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
