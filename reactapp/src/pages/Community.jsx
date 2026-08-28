import { useState, useEffect } from "react";
import {
    getPosts,
    searchPostsByTitle,
    createPost,
    updatePost,
    deletePost,
    getCommentsByPost,
    addComment,
    deleteComment,
} from "../services/communityService";
import { getCurrentUser } from "../services/authService";
import "./Community.css";

const PRESET_PLANT_IMAGES = [
    { label: "Lush Monstera", url: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80" },
    { label: "Succulent Arrangement", url: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80" },
    { label: "Trailing Pothos", url: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=800&q=80" },
    { label: "Peace Lily Bloom", url: "https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?auto=format&fit=crop&w=800&q=80" },
];

function Community() {
    const [posts, setPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchQuery, setSearchQuery] = useState("");

    const [postComments, setPostComments] = useState({});
    const [expandedComments, setExpandedComments] = useState({});
    const [newCommentText, setNewCommentText] = useState({});
    const [submittingComment, setSubmittingComment] = useState({});

    const [likedPostIds, setLikedPostIds] = useState(() => {
        try {
            const saved = localStorage.getItem("plantcare_liked_posts");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPostId, setEditingPostId] = useState(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
    });

    const loadPosts = async () => {
        setLoading(true);
        setError("");
        try {
            const userData = await getCurrentUser();
            setCurrentUser(userData);

            const allPosts = await getPosts().catch(() => []);
            allPosts.sort((a, b) => new Date(b.createdDate || 0) - new Date(a.createdDate || 0));
            setPosts(allPosts);
        } catch (err) {
            console.error("Error loading community posts:", err);
            setError(err.message || "Failed to load community posts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (!query.trim()) {
            loadPosts();
            return;
        }

        try {
            const results = await searchPostsByTitle(query.trim());
            setPosts(results);
        } catch (err) {
            console.warn("Search failed, filtering locally:", err);
            setPosts((prev) =>
                prev.filter(
                    (p) =>
                        p.title?.toLowerCase().includes(query.toLowerCase()) ||
                        p.description?.toLowerCase().includes(query.toLowerCase())
                )
            );
        }
    };

    const handleOpenModal = (post = null) => {
        if (post) {
            setEditingPostId(post.postId);
            setFormData({
                title: post.title || "",
                description: post.description || "",
                image: post.image || "",
            });
        } else {
            setEditingPostId(null);
            setFormData({
                title: "",
                description: "",
                image: "",
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPostId(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingPostId) {
                const payload = {
                    ...formData,
                    userId: currentUser?.id,
                };
                const updated = await updatePost(editingPostId, payload);
                setPosts(posts.map((p) => (p.postId === editingPostId ? updated : p)));
            } else {
                const payload = {
                    ...formData,
                    userId: currentUser?.id,
                };
                const created = await createPost(payload);
                setPosts([created, ...posts]);
            }
            handleCloseModal();
        } catch (err) {
            alert("Failed to save post: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeletePost = async (postId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await deletePost(postId);
                setPosts(posts.filter((p) => p.postId !== postId));
            } catch (err) {
                alert("Failed to delete post: " + err.message);
            }
        }
    };

    const handleToggleComments = async (postId) => {
        const isOpen = expandedComments[postId];
        setExpandedComments((prev) => ({ ...prev, [postId]: !isOpen }));

        if (!isOpen && !postComments[postId]) {
            try {
                const comments = await getCommentsByPost(postId);
                setPostComments((prev) => ({ ...prev, [postId]: comments }));
            } catch (err) {
                console.warn("Failed to load comments:", err);
            }
        }
    };

    const handleAddComment = async (e, postId) => {
        e.preventDefault();
        const text = newCommentText[postId]?.trim();
        if (!text) return;

        if (!currentUser?.id) {
            alert("Please log in to comment.");
            return;
        }

        setSubmittingComment((prev) => ({ ...prev, [postId]: true }));
        try {
            const payload = {
                postId: postId,
                userId: currentUser.id,
                comment: text,
            };

            const savedComment = await addComment(payload);
            const completeComment = {
                ...savedComment,
                username: savedComment.username || currentUser.username || "You",
            };

            setPostComments((prev) => ({
                ...prev,
                [postId]: [...(prev[postId] || []), completeComment],
            }));

            setNewCommentText((prev) => ({ ...prev, [postId]: "" }));
        } catch (err) {
            alert("Failed to post comment: " + err.message);
        } finally {
            setSubmittingComment((prev) => ({ ...prev, [postId]: false }));
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        if (window.confirm("Delete this reply?")) {
            try {
                await deleteComment(commentId);
                setPostComments((prev) => ({
                    ...prev,
                    [postId]: prev[postId].filter((c) => c.commentId !== commentId),
                }));
            } catch (err) {
                alert("Failed to delete comment: " + err.message);
            }
        }
    };

    const handleToggleLike = (postId) => {
        const isCurrentlyLiked = likedPostIds.includes(postId);
        let updated;
        if (isCurrentlyLiked) {
            updated = likedPostIds.filter((id) => id !== postId);
        } else {
            updated = [...likedPostIds, postId];
        }
        setLikedPostIds(updated);
        try {
            localStorage.setItem("plantcare_liked_posts", JSON.stringify(updated));
        } catch (e) {
            console.warn("Could not save liked posts:", e);
        }
    };

    return (
        <div className="community-page">
            <div className="community-header">
                <div className="community-title-wrap">
                    <span className="community-tagline">Botanical Knowledge & Social</span>
                    <h1>Our Green Community</h1>
                    <p>Share plant progress, exchange care advice, and connect with fellow growers worldwide</p>
                </div>

                <button className="create-post-btn" onClick={() => handleOpenModal()}>
                    Create Community Post
                </button>
            </div>

            <div className="community-search-bar">
                <input
                    type="text"
                    className="community-search-input"
                    placeholder="Search discussions by topic, plant name, symptoms..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            {error && <div className="alert-message alert-error">{error}</div>}

            {loading ? (
                <div className="dashboard-loading">
                    <div className="dashboard-spinner"></div>
                    <h3>Loading community discussions...</h3>
                </div>
            ) : posts.length === 0 ? (
                <div className="empty-plants-container">
                    <h3>No community discussions yet</h3>
                    <p>Be the first green thumb to share a plant story, propagation success, or question!</p>
                    <button className="create-post-btn" style={{ margin: "0 auto" }} onClick={() => handleOpenModal()}>
                        Write First Post
                    </button>
                </div>
            ) : (
                <div className="posts-feed">
                    {posts.map((post) => {
                        const isAuthor = currentUser?.id === post.userId;
                        const isAdmin = currentUser?.role === "ADMIN";
                        const canModify = isAuthor || isAdmin;
                        const isLiked = likedPostIds.includes(post.postId);
                        const baseLikes = typeof post.likes === "number" ? post.likes : 0;
                        const totalLikes = baseLikes + (isLiked ? 1 : 0);
                        const commentsList = postComments[post.postId] || [];
                        const isCommentsOpen = expandedComments[post.postId];

                        return (
                            <div key={post.postId} className="post-card">
                                <div className="post-card-header">
                                    <div className="post-author-wrap">
                                        <div className="post-author-avatar">
                                            {post.username ? post.username.charAt(0).toUpperCase() : "G"}
                                        </div>
                                        <div className="post-author-details">
                                            <h4>{post.username || `Gardener #${post.userId || "Member"}`}</h4>
                                            <span className="post-timestamp">
                                                {post.createdDate
                                                    ? new Date(post.createdDate).toLocaleDateString(undefined, {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })
                                                    : "Recently"}
                                            </span>
                                        </div>
                                    </div>

                                    {canModify && (
                                        <div className="post-admin-actions">
                                            <button
                                                className="health-btn-action"
                                                onClick={() => handleOpenModal(post)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="health-btn-action delete"
                                                onClick={() => handleDeletePost(post.postId)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="post-content-body">
                                    <h3 className="post-title">{post.title}</h3>
                                    <p className="post-description">{post.description}</p>
                                </div>

                                {post.image && (
                                    <div className="post-image-box">
                                        <img src={post.image} alt={post.title} loading="lazy" />
                                    </div>
                                )}

                                <div className="post-actions-bar">
                                    <div className="post-interactive-buttons">
                                        <button
                                            className={`action-pill-btn ${isLiked ? "liked" : ""}`}
                                            onClick={() => handleToggleLike(post.postId)}
                                        >
                                            {totalLikes} {totalLikes === 1 ? "Likes" : "Like"}
                                        </button>

                                        <button
                                            className="action-pill-btn"
                                            onClick={() => handleToggleComments(post.postId)}
                                        >
                                            {commentsList.length > 0 ? `${commentsList.length} Comments` : "Comment"}
                                        </button>
                                    </div>
                                </div>

                                {isCommentsOpen && (
                                    <div className="comments-section">
                                        <div className="comment-list">
                                            {commentsList.length === 0 ? (
                                                <p style={{ color: "#80a58e", fontSize: "13px", margin: 0 }}>
                                                    No replies yet. Be the first to share your thoughts!
                                                </p>
                                            ) : (
                                                commentsList.map((c) => {
                                                    const isCommentAuthor = currentUser?.id === c.userId || isAdmin;
                                                    return (
                                                        <div key={c.commentId} className="comment-item">
                                                            <div>
                                                                <div className="comment-author">
                                                                    @{c.username || `User #${c.userId}`}
                                                                </div>
                                                                <p className="comment-text">{c.comment}</p>
                                                                <div className="comment-time">
                                                                    {c.createdDate
                                                                        ? new Date(c.createdDate).toLocaleTimeString([], {
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                        })
                                                                        : ""}
                                                                </div>
                                                            </div>

                                                            {isCommentAuthor && (
                                                                <button
                                                                    className="btn-delete-comment"
                                                                    title="Delete reply"
                                                                    onClick={() =>
                                                                        handleDeleteComment(post.postId, c.commentId)
                                                                    }
                                                                >
                                                                    ✕
                                                                </button>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>

                                        <form
                                            onSubmit={(e) => handleAddComment(e, post.postId)}
                                            className="comment-input-form"
                                        >
                                            <input
                                                type="text"
                                                placeholder="Write a constructive botanical reply..."
                                                value={newCommentText[post.postId] || ""}
                                                onChange={(e) =>
                                                    setNewCommentText({
                                                        ...newCommentText,
                                                        [post.postId]: e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                            <button
                                                type="submit"
                                                className="btn-post-comment"
                                                disabled={submittingComment[post.postId]}
                                            >
                                                {submittingComment[post.postId] ? "Posting..." : "Reply"}
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingPostId ? "Edit Community Post" : "Create Community Post"}</h2>
                            <button className="modal-close-btn" onClick={handleCloseModal}>
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Post Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="e.g. Common Pothos Mistakes to Avoid or Best Lighting for Succulents"
                                    value={formData.title}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Your Plant Story / Question *</label>
                                <textarea
                                    name="description"
                                    rows="5"
                                    placeholder="Share your watering schedule, light conditions, propagation results, or ask for guidance..."
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Plant Image URL (Optional)</label>
                                <input
                                    type="text"
                                    name="image"
                                    placeholder="https://images.unsplash.com/..."
                                    value={formData.image}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="plant-selector-group">
                                <label style={{ fontSize: "12px", color: "#80a58e" }}>Or select a botanical image preset:</label>
                                <div className="plant-tags-container">
                                    {PRESET_PLANT_IMAGES.map((preset, idx) => (
                                        <span
                                            key={idx}
                                            className={`plant-select-chip ${formData.image === preset.url ? "selected" : ""}`}
                                            onClick={() => setFormData({ ...formData, image: preset.url })}
                                        >
                                            {preset.label}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save" disabled={saving}>
                                    {saving ? "Posting..." : editingPostId ? "Update Post" : "Publish Post"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Community;
