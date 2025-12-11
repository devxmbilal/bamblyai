import { Router, Response } from 'express';
import { Post } from '../models/index.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { AgentService } from '../services/agent.service.js';

const router = Router();
const agentService = new AgentService();

// Dashboard stats endpoint - MUST be before /:id route
router.get('/stats', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        // Get post counts by status
        const [
            totalPosts,
            draftPosts,
            scheduledPosts,
            publishedPosts,
            failedPosts
        ] = await Promise.all([
            Post.countDocuments({ userId }),
            Post.countDocuments({ userId, status: 'draft' }),
            Post.countDocuments({ userId, status: 'scheduled' }),
            Post.countDocuments({ userId, status: 'published' }),
            Post.countDocuments({ userId, status: 'failed' })
        ]);

        // Get total analytics
        const analyticsAgg = await Post.aggregate([
            { $match: { userId: req.userId } },
            {
                $group: {
                    _id: null,
                    totalLikes: { $sum: '$analytics.likes' },
                    totalComments: { $sum: '$analytics.comments' },
                    totalShares: { $sum: '$analytics.shares' },
                    totalImpressions: { $sum: '$analytics.impressions' }
                }
            }
        ]);

        const analytics = analyticsAgg[0] || {
            totalLikes: 0,
            totalComments: 0,
            totalShares: 0,
            totalImpressions: 0
        };

        // Get recent posts
        const recentPosts = await Post.find({ userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('topic caption platforms status createdAt scheduledAt publishedAt analytics');

        // Get platform distribution
        const platformStats = await Post.aggregate([
            { $match: { userId: req.userId } },
            { $unwind: '$platforms' },
            { $group: { _id: '$platforms', count: { $sum: 1 } } }
        ]);

        res.json({
            stats: {
                total: totalPosts,
                drafts: draftPosts,
                scheduled: scheduledPosts,
                published: publishedPosts,
                failed: failedPosts
            },
            analytics: {
                likes: analytics.totalLikes,
                comments: analytics.totalComments,
                shares: analytics.totalShares,
                impressions: analytics.totalImpressions
            },
            platformStats: platformStats.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {} as Record<string, number>),
            recentPosts
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ error: 'Failed to get dashboard stats' });
    }
});

// Get all posts for user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status, platform } = req.query;

        const query: Record<string, unknown> = { userId: req.userId };
        if (status) query.status = status;
        if (platform) query.platforms = platform;

        const posts = await Post.find(query).sort({ createdAt: -1 });
        res.json({ posts });
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ error: 'Failed to get posts' });
    }
});

// Get single post
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const post = await Post.findOne({ _id: req.params.id, userId: req.userId });
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        res.json({ post });
    } catch (error) {
        console.error('Get post error:', error);
        res.status(500).json({ error: 'Failed to get post' });
    }
});

// Generate AI content
router.post('/generate', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { topic, platforms, tone } = req.body;

        if (!topic) {
            res.status(400).json({ error: 'Topic is required' });
            return;
        }

        // Use agent to generate content
        const generated = await agentService.generateContent({
            topic,
            platforms: platforms || ['instagram'],
            tone: tone || 'professional'
        });

        res.json({
            caption: generated.caption,
            hashtags: generated.hashtags,
            aiGenerated: true
        });
    } catch (error) {
        console.error('Generate content error:', error);
        res.status(500).json({ error: 'Failed to generate content' });
    }
});

// Create draft post
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { topic, caption, hashtags, mediaUrls, platforms } = req.body;

        const post = new Post({
            userId: req.userId,
            topic,
            caption,
            hashtags: hashtags || [],
            mediaUrls: mediaUrls || [],
            platforms: platforms || ['instagram'],
            status: 'draft',
            aiGenerated: false
        });

        await post.save();
        res.status(201).json({ post });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Update post
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { caption, hashtags, mediaUrls, platforms, scheduledAt } = req.body;

        const post = await Post.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { caption, hashtags, mediaUrls, platforms, scheduledAt },
            { new: true }
        );

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        res.json({ post });
    } catch (error) {
        console.error('Update post error:', error);
        res.status(500).json({ error: 'Failed to update post' });
    }
});

// Schedule post
router.post('/:id/schedule', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { scheduledAt } = req.body;

        if (!scheduledAt) {
            res.status(400).json({ error: 'Scheduled time is required' });
            return;
        }

        const post = await Post.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { scheduledAt: new Date(scheduledAt), status: 'scheduled' },
            { new: true }
        );

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        // TODO: Add to BullMQ queue
        // await queueService.schedulePost(post);

        res.json({ post, message: 'Post scheduled successfully' });
    } catch (error) {
        console.error('Schedule post error:', error);
        res.status(500).json({ error: 'Failed to schedule post' });
    }
});

// Publish post immediately
router.post('/:id/publish', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const post = await Post.findOne({ _id: req.params.id, userId: req.userId });

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        // TODO: Implement actual publishing via platform APIs
        // const result = await agentService.publishPost(post, req.userId);

        post.status = 'published';
        post.publishedAt = new Date();
        await post.save();

        res.json({ post, message: 'Post published successfully' });
    } catch (error) {
        console.error('Publish post error:', error);
        res.status(500).json({ error: 'Failed to publish post' });
    }
});

// Delete post
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const post = await Post.findOneAndDelete({ _id: req.params.id, userId: req.userId });

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

export default router;
