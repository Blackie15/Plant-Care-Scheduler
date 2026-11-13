import { getToken } from "./authService";

const BACKEND_ORIGIN = "http://localhost:8080";
const API_URL = `${BACKEND_ORIGIN}/api`;

const authHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// Resolve relative backend upload paths ("/uploads/...") against BACKEND_ORIGIN while keeping full URLs intact.
export const resolvePostImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (
        imagePath.startsWith("http://") ||
        imagePath.startsWith("https://") ||
        imagePath.startsWith("blob:") ||
        imagePath.startsWith("data:")
    ) {
        return imagePath;
    }
    return imagePath.startsWith("/")
        ? `${BACKEND_ORIGIN}${imagePath}`
        : `${BACKEND_ORIGIN}/${imagePath}`;
};

// UPLOAD POST IMAGE
export const uploadPostImage = async (file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);

    // Omit Content-Type so fetch automatically sets multipart/form-data with the boundary.
    const response = await fetch(`${API_URL}/community-posts/upload-image`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to upload image");
    }

    const data = await response.json();
    return data.imageUrl;
};

// GET ALL POSTS
export const getPosts = async () => {
    const response = await fetch(`${API_URL}/community-posts`, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch community posts (HTTP ${response.status})`);
    }

    return await response.json();
};

// GET POST BY ID
export const getPostById = async (id) => {
    const response = await fetch(`${API_URL}/community-posts/${id}`, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch post #${id}`);
    }

    return await response.json();
};

// SEARCH POSTS BY TITLE
export const searchPostsByTitle = async (title) => {
    const response = await fetch(`${API_URL}/community-posts/search?title=${encodeURIComponent(title)}`, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to search community posts`);
    }

    return await response.json();
};

// CREATE POST
export const createPost = async (postData) => {
    const response = await fetch(`${API_URL}/community-posts`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(postData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create post");
    }

    return await response.json();
};

// UPDATE POST
export const updatePost = async (id, postData) => {
    const response = await fetch(`${API_URL}/community-posts/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(postData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update post #${id}`);
    }

    return await response.json();
};

// DELETE POST
export const deletePost = async (id) => {
    const response = await fetch(`${API_URL}/community-posts/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to delete post #${id}`);
    }

    return true;
};

// GET COMMENTS FOR POST
export const getCommentsByPost = async (postId) => {
    const response = await fetch(`${API_URL}/comments/post/${postId}`, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch comments for post #${postId}`);
    }

    return await response.json();
};

// ADD COMMENT
export const addComment = async (commentData) => {
    const response = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(commentData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add comment");
    }

    return await response.json();
};

// DELETE COMMENT
export const deleteComment = async (commentId) => {
    const response = await fetch(`${API_URL}/comments/${commentId}`, {
        method: "DELETE",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to delete comment #${commentId}`);
    }

    return true;
};
