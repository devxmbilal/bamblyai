'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './components/AuthProvider';

// API Base URL
const API_URL = 'http://localhost:5000/api';

// Icons as simple SVG components
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ScheduleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const CreateIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const SentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const HelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function Home() {
  const { user, token, logout, isLoading } = useAuth();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [prompt, setPrompt] = useState('');
  const [platforms, setPlatforms] = useState({
    linkedin: true,
    twitter: false,
    instagram: false,
    facebook: false
  });
  const [tags, setTags] = useState(['#AI', '#Automation']);
  const [postImmediately, setPostImmediately] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('Today, 4:00 PM');
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; type: string; preview?: string }>>([]);

  // Dashboard state
  const [dashboardStats, setDashboardStats] = useState({
    stats: { total: 0, drafts: 0, scheduled: 0, published: 0, failed: 0 },
    analytics: { likes: 0, comments: 0, shares: 0, impressions: 0 },
    platformStats: {} as Record<string, number>,
    recentPosts: [] as Array<{
      _id: string;
      topic: string;
      caption: string;
      platforms: string[];
      status: string;
      createdAt: string;
      scheduledAt?: string;
      publishedAt?: string;
      analytics: { likes?: number; comments?: number; shares?: number; impressions?: number };
    }>
  });
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // Scheduled posts state
  const [scheduledPosts, setScheduledPosts] = useState<Array<{
    _id: string;
    topic: string;
    caption: string;
    platforms: string[];
    status: string;
    createdAt: string;
    scheduledAt?: string;
  }>>([]);
  const [scheduledLoading, setScheduledLoading] = useState(false);

  // Sent/Published posts state
  const [sentPosts, setSentPosts] = useState<Array<{
    _id: string;
    topic: string;
    caption: string;
    platforms: string[];
    status: string;
    createdAt: string;
    publishedAt?: string;
    analytics: { likes?: number; comments?: number; shares?: number; impressions?: number };
  }>>([]);
  const [sentLoading, setSentLoading] = useState(false);

  // Fetch dashboard stats
  useEffect(() => {
    if (activeNav === 'dashboard' && token) {
      fetchDashboardStats();
    }
    if (activeNav === 'schedule' && token) {
      fetchScheduledPosts();
    }
    if (activeNav === 'sent' && token) {
      fetchSentPosts();
    }
    if (activeNav === 'drafts' && token) {
      fetchDraftPosts();
    }
    if (activeNav === 'analytics' && token) {
      fetchDashboardStats();
    }
  }, [activeNav, token]);

  const fetchDashboardStats = async () => {
    setDashboardLoading(true);
    try {
      const response = await fetch(`${API_URL}/posts/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setDashboardLoading(false);
    }
  };

  const fetchScheduledPosts = async () => {
    setScheduledLoading(true);
    try {
      const response = await fetch(`${API_URL}/posts?status=scheduled`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setScheduledPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Failed to fetch scheduled posts:', error);
    } finally {
      setScheduledLoading(false);
    }
  };

  const fetchSentPosts = async () => {
    setSentLoading(true);
    try {
      const response = await fetch(`${API_URL}/posts?status=published`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSentPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Failed to fetch sent posts:', error);
    } finally {
      setSentLoading(false);
    }
  };

  // Drafts state
  const [draftPosts, setDraftPosts] = useState<Array<{
    _id: string;
    topic: string;
    caption: string;
    platforms: string[];
    hashtags: string[];
    status: string;
    createdAt: string;
  }>>([]);
  const [draftsLoading, setDraftsLoading] = useState(false);

  // Edit modal state
  const [editModal, setEditModal] = useState<{
    open: boolean;
    post: {
      _id: string;
      topic: string;
      caption: string;
      platforms: string[];
      hashtags: string[];
      scheduledAt?: string;
    } | null;
  }>({ open: false, post: null });

  // Fetch drafts
  const fetchDraftPosts = async () => {
    setDraftsLoading(true);
    try {
      const response = await fetch(`${API_URL}/posts?status=draft`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDraftPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Failed to fetch draft posts:', error);
    } finally {
      setDraftsLoading(false);
    }
  };

  // Delete post
  const handleDeletePost = async (postId: string, postType: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Post deleted successfully!' });
        // Refresh the appropriate list
        if (postType === 'scheduled') fetchScheduledPosts();
        else if (postType === 'draft') fetchDraftPosts();
        else if (postType === 'sent') fetchSentPosts();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete post' });
    }
  };

  // Update post
  const handleUpdatePost = async () => {
    if (!editModal.post) return;

    try {
      const response = await fetch(`${API_URL}/posts/${editModal.post._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          caption: editModal.post.caption,
          hashtags: editModal.post.hashtags,
          platforms: editModal.post.platforms,
          scheduledAt: editModal.post.scheduledAt
        })
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Post updated successfully!' });
        setEditModal({ open: false, post: null });
        fetchScheduledPosts();
        fetchDraftPosts();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to update post' });
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'schedule', label: 'Schedule', icon: <ScheduleIcon /> },
    { id: 'drafts', label: 'Drafts', icon: <CreateIcon /> },
    { id: 'create', label: 'Create Post', icon: <CreateIcon /> },
    { id: 'sent', label: 'Sent Posts', icon: <SentIcon /> },
    { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  const togglePlatform = (platform: keyof typeof platforms) => {
    setPlatforms(prev => ({ ...prev, [platform]: !prev[platform] }));
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addTag = () => {
    const newTag = window.prompt("Enter a new tag:");
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag.startsWith('#') ? newTag : `#${newTag}`]);
    }
  };

  // Generate AI content
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setMessage({ type: 'error', text: 'Please enter a topic first!' });
      return;
    }

    setGenerating(true);
    setMessage({ type: '', text: '' });

    try {
      const selectedPlatforms = Object.entries(platforms)
        .filter(([_, selected]) => selected)
        .map(([platform]) => platform);

      const response = await fetch(`${API_URL}/posts/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          topic: prompt,
          platforms: selectedPlatforms,
          tone: 'professional'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setGeneratedCaption(data.caption);
      setTags(data.hashtags || ['#AI', '#Automation']);
      setMessage({ type: 'success', text: 'Content generated successfully!' });
    } catch (error) {
      console.error('Generate error:', error);
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to generate' });
    } finally {
      setGenerating(false);
    }
  };

  // Save as draft
  const handleSaveDraft = async () => {
    if (!generatedCaption && !prompt) {
      setMessage({ type: 'error', text: 'Nothing to save!' });
      return;
    }

    setSaving(true);
    try {
      const selectedPlatforms = Object.entries(platforms)
        .filter(([_, selected]) => selected)
        .map(([platform]) => platform);

      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          topic: prompt,
          caption: generatedCaption || prompt,
          hashtags: tags,
          platforms: selectedPlatforms,
          status: 'draft'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save draft');
      }

      setMessage({ type: 'success', text: 'Draft saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save draft' });
    } finally {
      setSaving(false);
    }
  };

  // Create/Publish post
  const handleCreatePost = async () => {
    if (!generatedCaption && !prompt) {
      setMessage({ type: 'error', text: 'Please generate content first!' });
      return;
    }

    setSaving(true);
    try {
      const selectedPlatforms = Object.entries(platforms)
        .filter(([_, selected]) => selected)
        .map(([platform]) => platform);

      // First create the post
      const createResponse = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          topic: prompt,
          caption: generatedCaption || prompt,
          hashtags: tags,
          platforms: selectedPlatforms
        })
      });

      const postData = await createResponse.json();

      if (!createResponse.ok) {
        throw new Error('Failed to create post');
      }

      if (postImmediately) {
        // Publish immediately
        await fetch(`${API_URL}/posts/${postData.post._id}/publish`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setMessage({ type: 'success', text: 'Post published successfully! 🎉' });
      } else {
        // Schedule
        await fetch(`${API_URL}/posts/${postData.post._id}/schedule`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ scheduledAt: new Date().toISOString() })
        });
        setMessage({ type: 'success', text: 'Post scheduled successfully! 📅' });
      }

      // Reset form
      setPrompt('');
      setGeneratedCaption('');
      setTags(['#AI', '#Automation']);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create post' });
    } finally {
      setSaving(false);
    }
  };

  // Copy caption
  const handleCopy = () => {
    const textToCopy = `${generatedCaption}\n\n${tags.join(' ')}`;
    navigator.clipboard.writeText(textToCopy);
    setMessage({ type: 'success', text: 'Copied to clipboard!' });
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#FAF5FF'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
          <p style={{ color: '#8B5CF6', fontWeight: '600' }}>Loading Lumu...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="sidebar" style={{ width: '260px', display: 'flex', flexDirection: 'column' }}>
        <div className="sidebar-logo">
          <div className="logo-icon">✨</div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#8B5CF6', margin: 0 }}>Lumu</h1>
            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>PK</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <div
            className="nav-item"
            onClick={logout}
            style={{ color: '#EF4444', marginBottom: '12px' }}
          >
            <span className="nav-icon"><LogoutIcon /></span>
            <span>Logout</span>
          </div>
          <div className="user-profile">
            <div className="avatar">{user.name.split(' ').map(n => n[0]).join('').toUpperCase()}</div>
            <div className="info">
              <div style={{ fontWeight: '600', fontSize: '14px' }}>{user.name}</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{user.email}</div>
            </div>
            <span style={{ marginLeft: 'auto', color: '#9CA3AF', cursor: 'pointer' }}>⋮</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px 40px', background: '#FAF5FF', overflow: 'auto' }}>
        {/* Dashboard View */}
        {activeNav === 'dashboard' && (
          <>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>Dashboard</h1>
                <p style={{ color: '#6B7280', fontSize: '15px' }}>Welcome back, {user.name}! 👋</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setActiveNav('create')} className="btn-primary">
                  <CreateIcon /> New Post
                </button>
              </div>
            </div>

            {dashboardLoading ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
                <p style={{ color: '#8B5CF6', fontWeight: '600' }}>Loading dashboard...</p>
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                  {/* Total Posts */}
                  <div className="card hover-lift" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Total Posts</p>
                        <p style={{ fontSize: '36px', fontWeight: '700' }}>{dashboardStats.stats.total}</p>
                      </div>
                      <div style={{ fontSize: '40px', opacity: 0.3 }}>📊</div>
                    </div>
                  </div>

                  {/* Published */}
                  <div className="card hover-lift" style={{ background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Published</p>
                        <p style={{ fontSize: '36px', fontWeight: '700' }}>{dashboardStats.stats.published}</p>
                      </div>
                      <div style={{ fontSize: '40px', opacity: 0.3 }}>✅</div>
                    </div>
                  </div>

                  {/* Scheduled */}
                  <div className="card hover-lift" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Scheduled</p>
                        <p style={{ fontSize: '36px', fontWeight: '700' }}>{dashboardStats.stats.scheduled}</p>
                      </div>
                      <div style={{ fontSize: '40px', opacity: 0.3 }}>📅</div>
                    </div>
                  </div>

                  {/* Drafts */}
                  <div className="card hover-lift" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Drafts</p>
                        <p style={{ fontSize: '36px', fontWeight: '700' }}>{dashboardStats.stats.drafts}</p>
                      </div>
                      <div style={{ fontSize: '40px', opacity: 0.3 }}>📝</div>
                    </div>
                  </div>
                </div>

                {/* Analytics & Recent Posts Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {/* Analytics Overview */}
                  <div className="card hover-lift">
                    <div className="section-header">
                      <span style={{ fontSize: '18px' }}>📈</span>
                      ANALYTICS OVERVIEW
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                      <div style={{ padding: '16px', background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)', borderRadius: '12px' }}>
                        <p style={{ fontSize: '12px', color: '#DC2626', fontWeight: '600', marginBottom: '4px' }}>❤️ LIKES</p>
                        <p style={{ fontSize: '28px', fontWeight: '700', color: '#991B1B' }}>{dashboardStats.analytics.likes.toLocaleString()}</p>
                      </div>
                      <div style={{ padding: '16px', background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)', borderRadius: '12px' }}>
                        <p style={{ fontSize: '12px', color: '#2563EB', fontWeight: '600', marginBottom: '4px' }}>💬 COMMENTS</p>
                        <p style={{ fontSize: '28px', fontWeight: '700', color: '#1E40AF' }}>{dashboardStats.analytics.comments.toLocaleString()}</p>
                      </div>
                      <div style={{ padding: '16px', background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)', borderRadius: '12px' }}>
                        <p style={{ fontSize: '12px', color: '#059669', fontWeight: '600', marginBottom: '4px' }}>🔄 SHARES</p>
                        <p style={{ fontSize: '28px', fontWeight: '700', color: '#065F46' }}>{dashboardStats.analytics.shares.toLocaleString()}</p>
                      </div>
                      <div style={{ padding: '16px', background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)', borderRadius: '12px' }}>
                        <p style={{ fontSize: '12px', color: '#7C3AED', fontWeight: '600', marginBottom: '4px' }}>👁️ IMPRESSIONS</p>
                        <p style={{ fontSize: '28px', fontWeight: '700', color: '#5B21B6' }}>{dashboardStats.analytics.impressions.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Platform Distribution */}
                  <div className="card hover-lift">
                    <div className="section-header">
                      <span style={{ fontSize: '18px' }}>🌐</span>
                      PLATFORM DISTRIBUTION
                    </div>
                    <div style={{ marginTop: '16px' }}>
                      {['instagram', 'twitter', 'linkedin'].map((platform) => {
                        const count = dashboardStats.platformStats[platform] || 0;
                        const total = dashboardStats.stats.total || 1;
                        const percentage = Math.round((count / total) * 100) || 0;
                        return (
                          <div key={platform} style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>
                                {platform === 'instagram' ? '📷' : platform === 'twitter' ? '𝕏' : '💼'} {platform}
                              </span>
                              <span style={{ color: '#6B7280' }}>{count} posts ({percentage}%)</span>
                            </div>
                            <div style={{ height: '8px', background: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{
                                height: '100%',
                                width: `${percentage}%`,
                                background: platform === 'instagram'
                                  ? 'linear-gradient(135deg, #E4405F 0%, #F77737 100%)'
                                  : platform === 'twitter'
                                    ? '#000'
                                    : 'linear-gradient(135deg, #0077B5 0%, #00A0DC 100%)',
                                borderRadius: '4px',
                                transition: 'width 0.5s ease'
                              }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Recent Posts */}
                <div className="card hover-lift" style={{ marginTop: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div className="section-header" style={{ margin: 0 }}>
                      <span style={{ fontSize: '18px' }}>📋</span>
                      RECENT POSTS
                    </div>
                    <button className="action-btn outline" onClick={fetchDashboardStats}>
                      <RefreshIcon /> Refresh
                    </button>
                  </div>

                  {dashboardStats.recentPosts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
                      <div style={{ fontSize: '48px', marginBottom: '12px' }}>📝</div>
                      <p>No posts yet. Create your first post!</p>
                      <button
                        onClick={() => setActiveNav('create')}
                        className="btn-primary"
                        style={{ marginTop: '16px' }}
                      >
                        <CreateIcon /> Create Post
                      </button>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                            <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Topic</th>
                            <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Platforms</th>
                            <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Status</th>
                            <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardStats.recentPosts.map((post) => (
                            <tr key={post._id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                              <td style={{ padding: '16px' }}>
                                <p style={{ fontWeight: '600', marginBottom: '4px' }}>{post.topic}</p>
                                <p style={{ fontSize: '13px', color: '#9CA3AF', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {post.caption.substring(0, 60)}...
                                </p>
                              </td>
                              <td style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  {post.platforms.map((p) => (
                                    <span key={p} style={{
                                      padding: '4px 8px',
                                      fontSize: '11px',
                                      fontWeight: '600',
                                      borderRadius: '6px',
                                      background: p === 'instagram' ? '#FCE7F3' : p === 'twitter' ? '#F3F4F6' : '#DBEAFE',
                                      color: p === 'instagram' ? '#BE185D' : p === 'twitter' ? '#111' : '#1D4ED8',
                                      textTransform: 'capitalize'
                                    }}>
                                      {p}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td style={{ padding: '16px' }}>
                                <span style={{
                                  padding: '6px 12px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  borderRadius: '20px',
                                  background: post.status === 'published' ? '#D1FAE5'
                                    : post.status === 'scheduled' ? '#FEF3C7'
                                      : post.status === 'failed' ? '#FEE2E2'
                                        : '#E5E7EB',
                                  color: post.status === 'published' ? '#059669'
                                    : post.status === 'scheduled' ? '#D97706'
                                      : post.status === 'failed' ? '#DC2626'
                                        : '#6B7280',
                                  textTransform: 'capitalize'
                                }}>
                                  {post.status}
                                </span>
                              </td>
                              <td style={{ padding: '16px', fontSize: '13px', color: '#6B7280' }}>
                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* Create Post View */}
        {activeNav === 'create' && (
          <>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>Create New Post</h1>
                <div className="status-indicator">
                  <span className="status-dot pulse-dot"></span>
                  AI ENGINE READY
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ background: 'white', border: 'none', borderRadius: '12px', padding: '12px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <BellIcon />
                </button>
                <button style={{ background: 'white', border: 'none', borderRadius: '12px', padding: '12px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <HelpIcon />
                </button>
              </div>
            </div>

            {/* Message Toast */}
            {message.text && (
              <div style={{
                padding: '12px 20px',
                borderRadius: '12px',
                marginBottom: '20px',
                background: message.type === 'error' ? '#FEE2E2' : '#D1FAE5',
                color: message.type === 'error' ? '#DC2626' : '#059669',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>{message.type === 'error' ? '⚠️' : '✅'}</span>
                {message.text}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Topic/Prompt Card */}
                <div className="card hover-lift">
                  <div className="section-header">
                    <span style={{ fontSize: '18px' }}>📝</span>
                    TOPIC / PROMPT
                  </div>
                  <div style={{ position: 'relative' }}>
                    <textarea
                      className="input-field"
                      placeholder="What's the vibe today? (e.g., 'Launch of our new AI feature')"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      style={{ minHeight: '100px', resize: 'vertical', paddingRight: '120px' }}
                    />
                    <button
                      onClick={handleGenerate}
                      disabled={generating}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '12px',
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        cursor: generating ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#8B5CF6',
                        fontWeight: '600',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        opacity: generating ? 0.7 : 1
                      }}
                    >
                      <SparkleIcon />
                      {generating ? 'Generating...' : 'Inspire Me'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '.pdf,.doc,.docx,.txt,.md,.jpg,.jpeg,.png,.gif,.webp';
                          input.multiple = true;
                          input.onchange = (e) => {
                            const files = (e.target as HTMLInputElement).files;
                            if (files && files.length > 0) {
                              Array.from(files).forEach(file => {
                                const isImage = file.type.startsWith('image/');
                                if (isImage) {
                                  const reader = new FileReader();
                                  reader.onload = (evt) => {
                                    setAttachedFiles(prev => [...prev, {
                                      name: file.name,
                                      type: file.type,
                                      preview: evt.target?.result as string
                                    }]);
                                  };
                                  reader.readAsDataURL(file);
                                } else {
                                  setAttachedFiles(prev => [...prev, {
                                    name: file.name,
                                    type: file.type
                                  }]);
                                }
                              });
                              setMessage({ type: 'success', text: `📎 ${files.length} file(s) attached` });
                            }
                          };
                          input.click();
                        }}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          border: '1px solid #E5E7EB',
                          background: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#6B7280',
                          fontWeight: '500',
                          fontSize: '13px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        📎 Add Files
                      </button>
                      <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                        Images, PDF, DOC supported
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
                      {prompt.length}/500
                    </div>
                  </div>

                  {/* Attached Files Preview */}
                  {attachedFiles.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', marginBottom: '8px' }}>
                        📎 ATTACHED FILES ({attachedFiles.length})
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {attachedFiles.map((file, index) => (
                          <div key={index} style={{
                            position: 'relative',
                            width: '80px',
                            height: '80px',
                            borderRadius: '8px',
                            border: '1px solid #E5E7EB',
                            overflow: 'hidden',
                            background: '#F9FAFB'
                          }}>
                            {file.preview ? (
                              <img
                                src={file.preview}
                                alt={file.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <div style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '8px'
                              }}>
                                <span style={{ fontSize: '24px' }}>📄</span>
                                <span style={{ fontSize: '9px', color: '#6B7280', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                                  {file.name.length > 10 ? file.name.slice(0, 10) + '...' : file.name}
                                </span>
                              </div>
                            )}
                            <button
                              onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== index))}
                              style={{
                                position: 'absolute',
                                top: '2px',
                                right: '2px',
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                border: 'none',
                                background: '#DC2626',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                fontWeight: '700'
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '8px' }}>
                    💡 Tip: Use descriptive words like "Witty" or "Professional"
                  </p>
                </div>

                {/* Media Assets Card */}
                <div className="card hover-lift">
                  <div className="section-header">
                    <span style={{ fontSize: '18px' }}>🖼️</span>
                    MEDIA ASSETS
                  </div>
                  <div className="upload-zone">
                    <div className="upload-icon">
                      <UploadIcon />
                    </div>
                    <p style={{ fontWeight: '600', marginBottom: '4px' }}>
                      Drop your media here
                      <span style={{ color: '#8B5CF6', marginLeft: '8px', cursor: 'pointer' }}>Browse Files</span>
                    </p>
                    <p style={{ fontSize: '13px', color: '#9CA3AF' }}>
                      JPG, PNG, MP4 (Max 50MB)
                    </p>
                  </div>
                  <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
                    <span style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: '600' }}>OR</span>
                    <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={generating || !prompt.trim()}
                    style={{
                      width: '100%',
                      marginTop: '16px',
                      padding: '14px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: generating || !prompt.trim() ? 'not-allowed' : 'pointer',
                      opacity: generating || !prompt.trim() ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <SparkleIcon />
                    {generating ? 'Generating Content...' : '✨ Generate AI Content'}
                  </button>
                </div>

                {/* Generated Preview Card */}
                <div className="card hover-lift">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div className="section-header" style={{ margin: 0 }}>
                      <span style={{ fontSize: '18px' }}>👁️</span>
                      GENERATED PREVIEW
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className="action-btn outline" onClick={handleGenerate} disabled={generating}>
                        <RefreshIcon />
                        Regenerate
                      </button>
                      <button className="action-btn outline" onClick={handleCopy}>
                        <CopyIcon />
                        Copy
                      </button>
                    </div>
                  </div>

                  {/* Preview Content */}
                  {!generatedCaption ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
                      borderRadius: '12px',
                      border: '1px dashed #E5E7EB'
                    }}>
                      <div style={{ fontSize: '48px', marginBottom: '12px' }}>✨</div>
                      <p style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>No Content Generated Yet</p>
                      <p style={{ fontSize: '14px', color: '#9CA3AF' }}>Enter a topic and click "Generate AI Content" to create your post</p>
                    </div>
                  ) : (
                    <div className="preview-card">
                      {/* Image Placeholder */}
                      <div style={{
                        width: '100%',
                        height: '200px',
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'rgba(0,0,0,0.1)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}>
                          <span style={{ fontSize: '48px', marginBottom: '8px' }}>🖼️</span>
                          <span style={{ fontWeight: '600' }}>AI Generated Image</span>
                          <span style={{ fontSize: '12px', opacity: 0.8 }}>Coming Soon</span>
                        </div>
                      </div>

                      {/* User Header */}
                      <div className="preview-header">
                        <div className="avatar">{user.name.split(' ').map(n => n[0]).join('').toUpperCase()}</div>
                        <div>
                          <div style={{ fontWeight: '600' }}>{user.name}</div>
                          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                            Just now • <span style={{ color: '#8B5CF6' }}>Lumu AI</span>
                          </div>
                        </div>
                      </div>

                      {/* Caption/Description */}
                      <div style={{ marginTop: '16px' }}>
                        <div style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#9CA3AF',
                          marginBottom: '8px',
                          letterSpacing: '0.5px'
                        }}>
                          📝 CAPTION
                        </div>
                        <p style={{
                          lineHeight: '1.7',
                          color: '#374151',
                          fontSize: '15px',
                          padding: '12px',
                          background: '#F9FAFB',
                          borderRadius: '8px',
                          border: '1px solid #E5E7EB'
                        }}>
                          {generatedCaption}
                        </p>
                      </div>

                      {/* Hashtags */}
                      {tags.length > 0 && (
                        <div style={{ marginTop: '16px' }}>
                          <div style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            color: '#9CA3AF',
                            marginBottom: '8px',
                            letterSpacing: '0.5px'
                          }}>
                            🏷️ HASHTAGS
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {tags.map((tag, index) => (
                              <span key={index} style={{
                                padding: '6px 12px',
                                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                                color: '#8B5CF6',
                                borderRadius: '20px',
                                fontSize: '13px',
                                fontWeight: '600'
                              }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Platforms */}
                      <div style={{ marginTop: '16px' }}>
                        <div style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#9CA3AF',
                          marginBottom: '8px',
                          letterSpacing: '0.5px'
                        }}>
                          🌐 POSTING TO
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {Object.entries(platforms).filter(([, v]) => v).map(([p]) => (
                            <span key={p} style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              background: p === 'instagram' ? '#FCE7F3' : p === 'twitter' ? '#F3F4F6' : p === 'facebook' ? '#EFF6FF' : '#DBEAFE',
                              color: p === 'instagram' ? '#BE185D' : p === 'twitter' ? '#111' : p === 'facebook' ? '#1D4ED8' : '#1D4ED8',
                              fontSize: '12px',
                              fontWeight: '600',
                              textTransform: 'capitalize'
                            }}>
                              {p === 'instagram' ? '📷' : p === 'twitter' ? '𝕏' : p === 'facebook' ? 'f' : '💼'} {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Target Platforms */}
                <div className="card hover-lift">
                  <div className="section-header">
                    TARGET PLATFORMS
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div className="platform-item" onClick={() => togglePlatform('linkedin')}>
                      <div className="platform-icon linkedin">in</div>
                      <span style={{ flex: 1, fontWeight: '500' }}>LinkedIn</span>
                      <div className={`checkbox ${platforms.linkedin ? 'checked' : ''}`}></div>
                    </div>
                    <div className="platform-item" onClick={() => togglePlatform('twitter')}>
                      <div className="platform-icon twitter" style={{ background: '#000' }}>𝕏</div>
                      <span style={{ flex: 1, fontWeight: '500' }}>Twitter / X</span>
                      <div className={`checkbox ${platforms.twitter ? 'checked' : ''}`}></div>
                    </div>
                    <div className="platform-item" onClick={() => togglePlatform('instagram')}>
                      <div className="platform-icon instagram">📷</div>
                      <span style={{ flex: 1, fontWeight: '500' }}>Instagram</span>
                      <div className={`checkbox ${platforms.instagram ? 'checked' : ''}`}></div>
                    </div>
                    <div className="platform-item" onClick={() => togglePlatform('facebook')}>
                      <div className="platform-icon" style={{ background: 'linear-gradient(135deg, #1877F2 0%, #3b5998 100%)' }}>f</div>
                      <span style={{ flex: 1, fontWeight: '500' }}>Facebook</span>
                      <div className={`checkbox ${platforms.facebook ? 'checked' : ''}`}></div>
                    </div>
                  </div>
                </div>

                {/* AI Tags */}
                <div className="card hover-lift">
                  <div className="section-header">
                    AI TAGS
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {tags.map((tag) => (
                      <div key={tag} className="tag">
                        {tag}
                        <span className="close" onClick={() => removeTag(tag)}>×</span>
                      </div>
                    ))}
                    <div
                      className="tag"
                      onClick={addTag}
                      style={{ background: 'white', border: '1px dashed #D1D5DB', cursor: 'pointer' }}
                    >
                      + Add Tag
                    </div>
                  </div>
                </div>

                {/* Publishing */}
                <div className="card hover-lift">
                  <div className="section-header">
                    PUBLISHING
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <span style={{ fontWeight: '500' }}>Post Immediately</span>
                    <div
                      className={`toggle ${postImmediately ? 'active' : ''}`}
                      onClick={() => setPostImmediately(!postImmediately)}
                    ></div>
                  </div>
                  {!postImmediately && (
                    <>
                      <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        SCHEDULED FOR
                      </div>
                      <div className="date-picker">
                        <span style={{ flex: 1 }}>{scheduledTime}</span>
                        <CalendarIcon />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid #E5E7EB'
            }}>
              <div className="footer-status">
                <span className="dot"></span>
                Draft saved <strong style={{ marginLeft: '4px' }}>Just now</strong>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-secondary" onClick={handleSaveDraft} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Draft'}
                </button>
                <button className="btn-primary" onClick={handleCreatePost} disabled={saving}>
                  {saving ? 'Creating...' : 'Create Post'}
                  <span style={{ fontSize: '18px' }}>➤</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Schedule View - Scheduled Posts */}
        {activeNav === 'schedule' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>📅 Scheduled Posts</h1>
                <p style={{ color: '#6B7280', fontSize: '15px' }}>Posts waiting to be published</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={fetchScheduledPosts} className="action-btn outline">
                  <RefreshIcon /> Refresh
                </button>
                <button onClick={() => setActiveNav('create')} className="btn-primary">
                  <CreateIcon /> New Post
                </button>
              </div>
            </div>

            {scheduledLoading ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                <p style={{ color: '#8B5CF6', fontWeight: '600' }}>Loading scheduled posts...</p>
              </div>
            ) : scheduledPosts.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📅</div>
                <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No Scheduled Posts</h2>
                <p style={{ color: '#9CA3AF', marginBottom: '20px' }}>Create a post and schedule it for later!</p>
                <button onClick={() => setActiveNav('create')} className="btn-primary">
                  <CreateIcon /> Create Post
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {scheduledPosts.map((post) => (
                  <div key={post._id} className="card hover-lift" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <span style={{ fontSize: '24px' }}>📅</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>{post.topic}</h3>
                      <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px', lineHeight: '1.5' }}>
                        {post.caption.length > 150 ? post.caption.substring(0, 150) + '...' : post.caption}
                      </p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {post.platforms.map((p) => (
                          <span key={p} style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            fontWeight: '600',
                            borderRadius: '6px',
                            background: p === 'instagram' ? '#FCE7F3' : p === 'twitter' ? '#F3F4F6' : '#DBEAFE',
                            color: p === 'instagram' ? '#BE185D' : p === 'twitter' ? '#111' : '#1D4ED8',
                            textTransform: 'capitalize'
                          }}>
                            {p === 'instagram' ? '📷' : p === 'twitter' ? '𝕏' : '💼'} {p}
                          </span>
                        ))}
                        <span style={{
                          padding: '4px 10px',
                          fontSize: '12px',
                          fontWeight: '600',
                          borderRadius: '6px',
                          background: '#FEF3C7',
                          color: '#D97706'
                        }}>
                          ⏰ {post.scheduledAt ? new Date(post.scheduledAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          }) : 'Pending'}
                        </span>
                      </div>
                    </div>
                    {/* Edit/Delete buttons */}
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button
                        onClick={() => setEditModal({
                          open: true,
                          post: {
                            _id: post._id,
                            topic: post.topic,
                            caption: post.caption,
                            platforms: post.platforms,
                            hashtags: [],
                            scheduledAt: post.scheduledAt
                          }
                        })}
                        style={{
                          padding: '10px 16px',
                          borderRadius: '8px',
                          border: '1px solid #E5E7EB',
                          background: 'white',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#4B5563'
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id, 'scheduled')}
                        style={{
                          padding: '10px 16px',
                          borderRadius: '8px',
                          border: '1px solid #FEE2E2',
                          background: '#FEF2F2',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#DC2626'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Sent Posts View - Published Posts */}
        {activeNav === 'sent' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>✅ Sent Posts</h1>
                <p style={{ color: '#6B7280', fontSize: '15px' }}>Posts published to social media</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={fetchSentPosts} className="action-btn outline">
                  <RefreshIcon /> Refresh
                </button>
                <button onClick={() => setActiveNav('create')} className="btn-primary">
                  <CreateIcon /> New Post
                </button>
              </div>
            </div>

            {sentLoading ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                <p style={{ color: '#8B5CF6', fontWeight: '600' }}>Loading sent posts...</p>
              </div>
            ) : sentPosts.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📤</div>
                <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No Published Posts Yet</h2>
                <p style={{ color: '#9CA3AF', marginBottom: '20px' }}>Create and publish your first post!</p>
                <button onClick={() => setActiveNav('create')} className="btn-primary">
                  <CreateIcon /> Create Post
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {sentPosts.map((post) => (
                  <div key={post._id} className="card hover-lift">
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <span style={{ fontSize: '24px' }}>✅</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>{post.topic}</h3>
                        <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px', lineHeight: '1.5' }}>
                          {post.caption.length > 150 ? post.caption.substring(0, 150) + '...' : post.caption}
                        </p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                          {post.platforms.map((p) => (
                            <span key={p} style={{
                              padding: '4px 10px',
                              fontSize: '12px',
                              fontWeight: '600',
                              borderRadius: '6px',
                              background: p === 'instagram' ? '#FCE7F3' : p === 'twitter' ? '#F3F4F6' : '#DBEAFE',
                              color: p === 'instagram' ? '#BE185D' : p === 'twitter' ? '#111' : '#1D4ED8',
                              textTransform: 'capitalize'
                            }}>
                              {p === 'instagram' ? '📷' : p === 'twitter' ? '𝕏' : '💼'} {p}
                            </span>
                          ))}
                          <span style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            fontWeight: '600',
                            borderRadius: '6px',
                            background: '#D1FAE5',
                            color: '#059669'
                          }}>
                            Published {post.publishedAt ? new Date(post.publishedAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            }) : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Analytics for sent post */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '12px',
                      padding: '16px',
                      background: '#F9FAFB',
                      borderRadius: '12px'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '4px' }}>❤️ LIKES</p>
                        <p style={{ fontSize: '18px', fontWeight: '700', color: '#DC2626' }}>{post.analytics?.likes || 0}</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '4px' }}>💬 COMMENTS</p>
                        <p style={{ fontSize: '18px', fontWeight: '700', color: '#2563EB' }}>{post.analytics?.comments || 0}</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '4px' }}>🔄 SHARES</p>
                        <p style={{ fontSize: '18px', fontWeight: '700', color: '#059669' }}>{post.analytics?.shares || 0}</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '4px' }}>👁️ VIEWS</p>
                        <p style={{ fontSize: '18px', fontWeight: '700', color: '#7C3AED' }}>{post.analytics?.impressions || 0}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Analytics View */}
        {activeNav === 'analytics' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>📈 Analytics</h1>
                <p style={{ color: '#6B7280', fontSize: '15px' }}>Track your social media performance</p>
              </div>
              <button onClick={fetchDashboardStats} className="action-btn outline">
                <RefreshIcon /> Refresh
              </button>
            </div>

            {/* Total Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
              <div className="card hover-lift" style={{ textAlign: 'center', padding: '32px' }}>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>❤️</div>
                <p style={{ fontSize: '36px', fontWeight: '700', color: '#DC2626', marginBottom: '4px' }}>{dashboardStats.analytics.likes.toLocaleString()}</p>
                <p style={{ color: '#9CA3AF', fontWeight: '600', fontSize: '13px' }}>TOTAL LIKES</p>
              </div>
              <div className="card hover-lift" style={{ textAlign: 'center', padding: '32px' }}>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>💬</div>
                <p style={{ fontSize: '36px', fontWeight: '700', color: '#2563EB', marginBottom: '4px' }}>{dashboardStats.analytics.comments.toLocaleString()}</p>
                <p style={{ color: '#9CA3AF', fontWeight: '600', fontSize: '13px' }}>TOTAL COMMENTS</p>
              </div>
              <div className="card hover-lift" style={{ textAlign: 'center', padding: '32px' }}>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>🔄</div>
                <p style={{ fontSize: '36px', fontWeight: '700', color: '#059669', marginBottom: '4px' }}>{dashboardStats.analytics.shares.toLocaleString()}</p>
                <p style={{ color: '#9CA3AF', fontWeight: '600', fontSize: '13px' }}>TOTAL SHARES</p>
              </div>
              <div className="card hover-lift" style={{ textAlign: 'center', padding: '32px' }}>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>👁️</div>
                <p style={{ fontSize: '36px', fontWeight: '700', color: '#7C3AED', marginBottom: '4px' }}>{dashboardStats.analytics.impressions.toLocaleString()}</p>
                <p style={{ color: '#9CA3AF', fontWeight: '600', fontSize: '13px' }}>IMPRESSIONS</p>
              </div>
            </div>

            {/* Platform Performance */}
            <div className="card hover-lift" style={{ marginBottom: '24px' }}>
              <div className="section-header">
                <span style={{ fontSize: '18px' }}>🌐</span>
                PLATFORM PERFORMANCE
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '20px' }}>
                {['instagram', 'twitter', 'linkedin', 'facebook'].map((platform) => {
                  const count = dashboardStats.platformStats[platform] || 0;
                  return (
                    <div key={platform} style={{
                      padding: '24px',
                      borderRadius: '12px',
                      background: platform === 'instagram' ? 'linear-gradient(135deg, #E4405F 0%, #F77737 100%)'
                        : platform === 'twitter' ? '#000'
                          : platform === 'facebook' ? 'linear-gradient(135deg, #1877F2 0%, #3b5998 100%)'
                            : 'linear-gradient(135deg, #0077B5 0%, #00A0DC 100%)',
                      color: 'white',
                      textAlign: 'center'
                    }}>
                      <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px', textTransform: 'capitalize' }}>
                        {platform === 'instagram' ? '📷' : platform === 'twitter' ? '𝕏' : platform === 'facebook' ? 'f' : '💼'} {platform}
                      </p>
                      <p style={{ fontSize: '32px', fontWeight: '700' }}>{count}</p>
                      <p style={{ fontSize: '12px', opacity: 0.8 }}>posts</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Engagement Rate */}
            <div className="card hover-lift">
              <div className="section-header">
                <span style={{ fontSize: '18px' }}>📊</span>
                ENGAGEMENT OVERVIEW
              </div>
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontWeight: '600' }}>Total Posts</span>
                  <span style={{ fontSize: '24px', fontWeight: '700', color: '#8B5CF6' }}>{dashboardStats.stats.total}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontWeight: '600' }}>Published Posts</span>
                  <span style={{ fontSize: '24px', fontWeight: '700', color: '#10B981' }}>{dashboardStats.stats.published}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontWeight: '600' }}>Average Engagement</span>
                  <span style={{ fontSize: '24px', fontWeight: '700', color: '#F59E0B' }}>
                    {dashboardStats.stats.published > 0
                      ? Math.round((dashboardStats.analytics.likes + dashboardStats.analytics.comments + dashboardStats.analytics.shares) / dashboardStats.stats.published)
                      : 0
                    } per post
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Settings View */}
        {activeNav === 'settings' && (
          <>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>⚙️ Settings</h1>
              <p style={{ color: '#6B7280', fontSize: '15px' }}>Manage your account and connected platforms</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Profile Settings */}
              <div className="card hover-lift">
                <div className="section-header">
                  <span style={{ fontSize: '18px' }}>👤</span>
                  PROFILE
                </div>
                <div style={{ marginTop: '16px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '6px' }}>NAME</label>
                    <input className="input-field" value={user?.name || ''} readOnly style={{ background: '#F9FAFB' }} />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '6px' }}>EMAIL</label>
                    <input className="input-field" value={user?.email || ''} readOnly style={{ background: '#F9FAFB' }} />
                  </div>
                </div>
              </div>

              {/* Change Password */}
              <div className="card hover-lift">
                <div className="section-header">
                  <span style={{ fontSize: '18px' }}>🔒</span>
                  CHANGE PASSWORD
                </div>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const currentPassword = (form.elements.namedItem('currentPassword') as HTMLInputElement).value;
                  const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement).value;
                  const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;

                  if (newPassword !== confirmPassword) {
                    setMessage({ type: 'error', text: 'Passwords do not match!' });
                    return;
                  }

                  try {
                    const response = await fetch(`${API_URL}/auth/password`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({ currentPassword, newPassword })
                    });
                    const data = await response.json();
                    if (response.ok) {
                      setMessage({ type: 'success', text: 'Password updated successfully!' });
                      form.reset();
                    } else {
                      setMessage({ type: 'error', text: data.error || 'Failed to update password' });
                    }
                  } catch {
                    setMessage({ type: 'error', text: 'Failed to update password' });
                  }
                }} style={{ marginTop: '16px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '6px' }}>CURRENT PASSWORD</label>
                    <input name="currentPassword" type="password" className="input-field" required placeholder="Enter current password" />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '6px' }}>NEW PASSWORD</label>
                    <input name="newPassword" type="password" className="input-field" required minLength={6} placeholder="Enter new password" />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '6px' }}>CONFIRM PASSWORD</label>
                    <input name="confirmPassword" type="password" className="input-field" required placeholder="Confirm new password" />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%' }}>Update Password</button>
                </form>
              </div>
            </div>

            {/* Connected Platforms */}
            <div className="card hover-lift" style={{ marginTop: '24px' }}>
              <div className="section-header">
                <span style={{ fontSize: '18px' }}>🔗</span>
                CONNECTED SOCIAL ACCOUNTS
              </div>
              <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '20px' }}>Link your social media accounts to publish posts directly</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {[
                  { id: 'instagram', name: 'Instagram', icon: '📷', color: 'linear-gradient(135deg, #E4405F 0%, #F77737 100%)' },
                  { id: 'twitter', name: 'Twitter / X', icon: '𝕏', color: '#000' },
                  { id: 'facebook', name: 'Facebook', icon: 'f', color: 'linear-gradient(135deg, #1877F2 0%, #3b5998 100%)' },
                  { id: 'linkedin', name: 'LinkedIn', icon: 'in', color: 'linear-gradient(135deg, #0077B5 0%, #00A0DC 100%)' }
                ].map((platform) => (
                  <div key={platform.id} style={{
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: platform.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '18px'
                    }}>
                      {platform.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '600', marginBottom: '4px' }}>{platform.name}</p>
                      <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Not connected</p>
                    </div>
                    <button
                      onClick={async () => {
                        const username = window.prompt(`Enter your ${platform.name} username:`);
                        if (username) {
                          try {
                            const response = await fetch(`${API_URL}/auth/connect-platform`, {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                              },
                              body: JSON.stringify({ platform: platform.id, username })
                            });
                            if (response.ok) {
                              setMessage({ type: 'success', text: `${platform.name} connected successfully!` });
                            }
                          } catch {
                            setMessage({ type: 'error', text: 'Failed to connect platform' });
                          }
                        }
                      }}
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Toast */}
            {message.text && (
              <div style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                padding: '16px 24px',
                borderRadius: '12px',
                background: message.type === 'error' ? '#FEE2E2' : '#D1FAE5',
                color: message.type === 'error' ? '#DC2626' : '#059669',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                zIndex: 1000
              }}>
                <span>{message.type === 'error' ? '⚠️' : '✅'}</span>
                {message.text}
              </div>
            )}
          </>
        )}

        {/* Drafts View */}
        {activeNav === 'drafts' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>📝 Draft Posts</h1>
                <p style={{ color: '#6B7280', fontSize: '15px' }}>Posts saved as drafts</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={fetchDraftPosts} className="action-btn outline">
                  <RefreshIcon /> Refresh
                </button>
                <button onClick={() => setActiveNav('create')} className="btn-primary">
                  <CreateIcon /> New Post
                </button>
              </div>
            </div>

            {draftsLoading ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                <p style={{ color: '#8B5CF6', fontWeight: '600' }}>Loading drafts...</p>
              </div>
            ) : draftPosts.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
                <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No Drafts Yet</h2>
                <p style={{ color: '#9CA3AF', marginBottom: '20px' }}>Start creating posts and save them as drafts!</p>
                <button onClick={() => setActiveNav('create')} className="btn-primary">
                  <CreateIcon /> Create Post
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {draftPosts.map((post) => (
                  <div key={post._id} className="card hover-lift" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <span style={{ fontSize: '24px' }}>📝</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>{post.topic}</h3>
                      <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px', lineHeight: '1.5' }}>
                        {post.caption.length > 150 ? post.caption.substring(0, 150) + '...' : post.caption}
                      </p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {post.platforms.map((p) => (
                          <span key={p} style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            fontWeight: '600',
                            borderRadius: '6px',
                            background: p === 'instagram' ? '#FCE7F3' : p === 'twitter' ? '#F3F4F6' : p === 'facebook' ? '#EFF6FF' : '#DBEAFE',
                            color: p === 'instagram' ? '#BE185D' : p === 'twitter' ? '#111' : p === 'facebook' ? '#1D4ED8' : '#1D4ED8',
                            textTransform: 'capitalize'
                          }}>
                            {p === 'instagram' ? '📷' : p === 'twitter' ? '𝕏' : p === 'facebook' ? 'f' : '💼'} {p}
                          </span>
                        ))}
                        <span style={{
                          padding: '4px 10px',
                          fontSize: '12px',
                          fontWeight: '600',
                          borderRadius: '6px',
                          background: '#F3F4F6',
                          color: '#6B7280'
                        }}>
                          Created {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {/* Edit/Delete buttons */}
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button
                        onClick={() => setEditModal({
                          open: true,
                          post: {
                            _id: post._id,
                            topic: post.topic,
                            caption: post.caption,
                            platforms: post.platforms,
                            hashtags: post.hashtags || []
                          }
                        })}
                        style={{
                          padding: '10px 16px',
                          borderRadius: '8px',
                          border: '1px solid #E5E7EB',
                          background: 'white',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#4B5563'
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id, 'draft')}
                        style={{
                          padding: '10px 16px',
                          borderRadius: '8px',
                          border: '1px solid #FEE2E2',
                          background: '#FEF2F2',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#DC2626'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Edit Modal */}
        {editModal.open && editModal.post && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflow: 'auto'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>✏️ Edit Post</h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '8px' }}>TOPIC</label>
                <input
                  className="input-field"
                  value={editModal.post.topic}
                  readOnly
                  style={{ background: '#F9FAFB' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '8px' }}>CAPTION</label>
                <textarea
                  className="input-field"
                  rows={5}
                  value={editModal.post.caption}
                  onChange={(e) => setEditModal(prev => ({
                    ...prev,
                    post: prev.post ? { ...prev.post, caption: e.target.value } : null
                  }))}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '8px' }}>PLATFORMS</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['instagram', 'twitter', 'facebook', 'linkedin'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setEditModal(prev => ({
                        ...prev,
                        post: prev.post ? {
                          ...prev.post,
                          platforms: prev.post.platforms.includes(p)
                            ? prev.post.platforms.filter(x => x !== p)
                            : [...prev.post.platforms, p]
                        } : null
                      }))}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: (editModal.post?.platforms || []).includes(p) ? '#8B5CF6' : '#E5E7EB',
                        background: (editModal.post?.platforms || []).includes(p) ? '#F5F3FF' : 'white',
                        color: (editModal.post?.platforms || []).includes(p) ? '#8B5CF6' : '#6B7280',
                        cursor: 'pointer',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>


              {/* Schedule Time - Always show for drafts */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '8px' }}>SCHEDULE TIME (Optional)</label>
                <input
                  type="datetime-local"
                  className="input-field"
                  value={editModal.post.scheduledAt ? new Date(editModal.post.scheduledAt).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setEditModal(prev => ({
                    ...prev,
                    post: prev.post ? { ...prev.post, scheduledAt: e.target.value || undefined } : null
                  }))}
                />
                <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '6px' }}>Leave empty for instant publish or set a time to schedule</p>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setEditModal({ open: false, post: null })}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    background: 'white',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: '#6B7280'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePost}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    background: '#F9FAFB',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: '#374151'
                  }}
                >
                  💾 Save Draft
                </button>
                {editModal.post.scheduledAt && (
                  <button
                    onClick={async () => {
                      if (!editModal.post) return;
                      try {
                        const response = await fetch(`${API_URL}/posts/${editModal.post._id}`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({
                            caption: editModal.post.caption,
                            platforms: editModal.post.platforms,
                            scheduledAt: editModal.post.scheduledAt,
                            status: 'scheduled'
                          })
                        });
                        if (response.ok) {
                          setMessage({ type: 'success', text: 'Post scheduled successfully!' });
                          setEditModal({ open: false, post: null });
                          fetchScheduledPosts();
                          fetchDraftPosts();
                        }
                      } catch {
                        setMessage({ type: 'error', text: 'Failed to schedule post' });
                      }
                    }}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                      cursor: 'pointer',
                      fontWeight: '600',
                      color: 'white'
                    }}
                  >
                    📅 Schedule
                  </button>
                )}
                <button
                  onClick={async () => {
                    if (!editModal.post) return;
                    try {
                      const response = await fetch(`${API_URL}/posts/${editModal.post._id}`, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                          caption: editModal.post.caption,
                          platforms: editModal.post.platforms,
                          status: 'published',
                          publishedAt: new Date().toISOString()
                        })
                      });
                      if (response.ok) {
                        setMessage({ type: 'success', text: 'Post published successfully! 🎉' });
                        setEditModal({ open: false, post: null });
                        fetchSentPosts();
                        fetchDraftPosts();
                        fetchDashboardStats();
                      }
                    } catch {
                      setMessage({ type: 'error', text: 'Failed to publish post' });
                    }
                  }}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  🚀 Publish Now
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
