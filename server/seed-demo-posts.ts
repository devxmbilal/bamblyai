import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Post Schema (same as models/Post.ts)
const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true, trim: true },
    caption: { type: String, required: true },
    hashtags: [{ type: String, trim: true }],
    mediaUrls: [{ type: String }],
    platforms: [{ type: String, enum: ['instagram', 'twitter', 'linkedin'] }],
    status: { type: String, enum: ['draft', 'scheduled', 'published', 'failed'], default: 'draft' },
    scheduledAt: { type: Date },
    publishedAt: { type: Date },
    aiGenerated: { type: Boolean, default: false },
    platformPostIds: { instagram: String, twitter: String, linkedin: String },
    analytics: {
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        impressions: { type: Number, default: 0 }
    }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
const User = mongoose.model('User', new mongoose.Schema({ email: String }));

// Demo posts data
const DEMO_POSTS = [
    // Published posts (for Sent section)
    {
        topic: 'AI Product Launch 🚀',
        caption: 'Excited to announce our new AI-powered social media automation tool! 🎉 This has been months in the making and we can\'t wait for you to try it. The future of content creation is here! #ProductLaunch #AIRevolution',
        hashtags: ['#AI', '#ProductLaunch', '#Innovation', '#TechStartup', '#Automation'],
        platforms: ['instagram', 'linkedin'],
        status: 'published',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        aiGenerated: true,
        analytics: { likes: 1247, comments: 89, shares: 156, impressions: 15420 }
    },
    {
        topic: 'Team Building Event',
        caption: 'Amazing team building session today! 🙌 When your team works together, magic happens. Grateful for these incredible people who make everything possible. #TeamWork #CompanyCulture',
        hashtags: ['#TeamWork', '#CompanyCulture', '#StartupLife', '#WorkLife'],
        platforms: ['instagram', 'twitter'],
        status: 'published',
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        aiGenerated: false,
        analytics: { likes: 856, comments: 42, shares: 78, impressions: 8930 }
    },
    {
        topic: 'Weekly Tech Tips',
        caption: '💡 Tech Tip Tuesday: Did you know you can save 3+ hours per week by automating your social media posts? Here are 5 ways to get started... Thread 🧵',
        hashtags: ['#TechTips', '#Productivity', '#SocialMedia', '#Automation'],
        platforms: ['twitter', 'linkedin'],
        status: 'published',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        aiGenerated: true,
        analytics: { likes: 2341, comments: 167, shares: 423, impressions: 28750 }
    },

    // Scheduled posts (for Schedule section)
    {
        topic: 'Holiday Sale Announcement',
        caption: '🎄 HOLIDAY SALE ALERT! Get 50% off on all premium plans this season. Don\'t miss out on this limited-time offer! Use code: HOLIDAY50 at checkout. #HolidaySale #Discount',
        hashtags: ['#HolidaySale', '#Discount', '#SpecialOffer', '#Christmas'],
        platforms: ['instagram', 'twitter', 'linkedin'],
        status: 'scheduled',
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        aiGenerated: true,
        analytics: { likes: 0, comments: 0, shares: 0, impressions: 0 }
    },
    {
        topic: 'New Feature Teaser',
        caption: '👀 Something exciting is coming next week! Can you guess what it is? Drop your guesses in the comments! Hint: It involves AI and scheduling... 🤖📅',
        hashtags: ['#ComingSoon', '#NewFeature', '#AI', '#Teaser'],
        platforms: ['instagram'],
        status: 'scheduled',
        scheduledAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        aiGenerated: false,
        analytics: { likes: 0, comments: 0, shares: 0, impressions: 0 }
    },
    {
        topic: 'Webinar Invitation',
        caption: '📢 Join us for an exclusive webinar on "Mastering Social Media in 2024"! Learn from industry experts and take your content game to the next level. Register now - link in bio!',
        hashtags: ['#Webinar', '#SocialMediaMarketing', '#LearnWithUs', '#DigitalMarketing'],
        platforms: ['linkedin', 'twitter'],
        status: 'scheduled',
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        aiGenerated: true,
        analytics: { likes: 0, comments: 0, shares: 0, impressions: 0 }
    },

    // Draft posts (for Dashboard recent posts)
    {
        topic: 'Customer Success Story',
        caption: '🌟 Customer Spotlight: How @TechStartupXYZ increased their engagement by 300% using our platform! Read the full case study on our blog... [DRAFT - needs review]',
        hashtags: ['#CustomerSuccess', '#CaseStudy', '#Growth'],
        platforms: ['linkedin'],
        status: 'draft',
        aiGenerated: true,
        analytics: { likes: 0, comments: 0, shares: 0, impressions: 0 }
    },
    {
        topic: 'Behind the Scenes',
        caption: '🎬 Behind the scenes at Lumu HQ! Sneak peek of our development process and the amazing team working hard to bring you the best features. [DRAFT]',
        hashtags: ['#BehindTheScenes', '#StartupLife', '#Development'],
        platforms: ['instagram', 'twitter'],
        status: 'draft',
        aiGenerated: false,
        analytics: { likes: 0, comments: 0, shares: 0, impressions: 0 }
    }
];

async function seedDemoPosts() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/social-media-agent';
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Find a user to associate posts with
        const user = await User.findOne({ email: 'admin@lumu.ai' });
        if (!user) {
            console.log('❌ No user found! Please create a user first using: npx ts-node create-user.ts');
            await mongoose.disconnect();
            process.exit(1);
        }

        console.log(`📝 Found user: ${user.email}`);
        console.log('🗑️  Clearing existing posts...');

        // Clear existing posts for this user
        await Post.deleteMany({ userId: user._id });

        console.log('📝 Creating demo posts...');

        // Create demo posts
        for (const postData of DEMO_POSTS) {
            const post = new Post({
                ...postData,
                userId: user._id
            });
            await post.save();
            console.log(`   ✅ Created: ${postData.topic} (${postData.status})`);
        }

        console.log('');
        console.log('🎉 Demo posts created successfully!');
        console.log('================================');
        console.log(`   Published: ${DEMO_POSTS.filter(p => p.status === 'published').length} posts`);
        console.log(`   Scheduled: ${DEMO_POSTS.filter(p => p.status === 'scheduled').length} posts`);
        console.log(`   Drafts:    ${DEMO_POSTS.filter(p => p.status === 'draft').length} posts`);
        console.log('================================');
        console.log('');
        console.log('Open http://localhost:3000 to see the demo data!');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating demo posts:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

seedDemoPosts();
