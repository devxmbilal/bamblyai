import { Router, Request, Response } from 'express';
import { User } from '../models/index.js';
import { generateToken, authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'Email already registered' });
            return;
        }

        // Create user
        const user = new User({ name, email, password });
        await user.save();

        // Generate token
        const token = generateToken(user._id.toString());

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Generate token
        const token = generateToken(user._id.toString());

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                brandVoice: user.brandVoice,
                preferredHashtags: user.preferredHashtags
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get current user
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

// Update user profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, brandVoice, preferredHashtags } = req.body;

        const user = await User.findByIdAndUpdate(
            req.userId,
            { name, brandVoice, preferredHashtags },
            { new: true }
        ).select('-password');

        res.json({ user });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Update password
router.put('/password', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            res.status(400).json({ error: 'Current and new password are required' });
            return;
        }

        if (newPassword.length < 6) {
            res.status(400).json({ error: 'New password must be at least 6 characters' });
            return;
        }

        const user = await User.findById(req.userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            res.status(401).json({ error: 'Current password is incorrect' });
            return;
        }

        // Update password (will be hashed by pre-save hook)
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({ error: 'Failed to update password' });
    }
});

// Connect social platform (demo - in real app would use OAuth)
router.put('/connect-platform', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { platform, username } = req.body;

        if (!platform || !username) {
            res.status(400).json({ error: 'Platform and username are required' });
            return;
        }

        const validPlatforms = ['instagram', 'twitter', 'facebook', 'linkedin'];
        if (!validPlatforms.includes(platform)) {
            res.status(400).json({ error: 'Invalid platform' });
            return;
        }

        const updateField: Record<string, unknown> = {};
        updateField[`connectedPlatforms.${platform}`] = {
            accessToken: 'demo_token_' + Date.now(),
            userId: 'demo_user_' + Date.now(),
            username: username
        };

        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set: updateField },
            { new: true }
        ).select('-password');

        res.json({ user, message: `${platform} connected successfully` });
    } catch (error) {
        console.error('Connect platform error:', error);
        res.status(500).json({ error: 'Failed to connect platform' });
    }
});

// Disconnect social platform
router.delete('/disconnect-platform/:platform', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { platform } = req.params;

        const validPlatforms = ['instagram', 'twitter', 'facebook', 'linkedin'];
        if (!validPlatforms.includes(platform)) {
            res.status(400).json({ error: 'Invalid platform' });
            return;
        }

        const updateField: Record<string, unknown> = {};
        updateField[`connectedPlatforms.${platform}`] = null;

        const user = await User.findByIdAndUpdate(
            req.userId,
            { $unset: updateField },
            { new: true }
        ).select('-password');

        res.json({ user, message: `${platform} disconnected successfully` });
    } catch (error) {
        console.error('Disconnect platform error:', error);
        res.status(500).json({ error: 'Failed to disconnect platform' });
    }
});

export default router;
