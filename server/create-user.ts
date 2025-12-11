import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// User Schema (same as models/User.ts)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: '' },
    brandVoice: { type: String, default: 'professional' },
    preferredHashtags: [{ type: String }],
    connectedPlatforms: {
        instagram: { accessToken: String, userId: String, username: String },
        twitter: { accessToken: String, accessSecret: String, userId: String, username: String }
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// ============================================
// CONFIGURE YOUR USER HERE
// ============================================
const NEW_USER = {
    name: 'Admin User',           // <-- Change this
    email: 'admin@lumu.ai',       // <-- Change this
    password: 'admin123'          // <-- Change this (min 6 characters)
};

async function createUser() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/social-media-agent';
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Check if user already exists
        const existingUser = await User.findOne({ email: NEW_USER.email });
        if (existingUser) {
            console.log('⚠️  User with this email already exists!');
            console.log(`   Email: ${existingUser.email}`);
            console.log(`   Name: ${existingUser.name}`);
            await mongoose.disconnect();
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(NEW_USER.password, salt);

        // Create user
        const user = new User({
            name: NEW_USER.name,
            email: NEW_USER.email,
            password: hashedPassword
        });

        await user.save();

        console.log('');
        console.log('✅ User created successfully!');
        console.log('================================');
        console.log(`   Name:     ${NEW_USER.name}`);
        console.log(`   Email:    ${NEW_USER.email}`);
        console.log(`   Password: ${NEW_USER.password}`);
        console.log('================================');
        console.log('');
        console.log('You can now login at http://localhost:3000/login');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating user:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

createUser();
