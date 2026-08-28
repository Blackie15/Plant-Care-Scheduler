import { getToken } from "./authService";

const API_URL = "http://localhost:8080/api";

const authHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// GET NOTIFICATIONS FOR LOGGED IN USER
export const getNotifications = async (userId = null) => {
    const url = userId ? `${API_URL}/notifications/user/${userId}` : `${API_URL}/notifications`;
    const response = await fetch(url, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch notifications (HTTP ${response.status})`);
    }

    return await response.json();
};

// MARK NOTIFICATION AS READ
export const markAsRead = async (id) => {
    const response = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: "PUT",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to mark notification #${id} as read`);
    }

    return await response.json();
};

// DELETE NOTIFICATION
export const deleteNotification = async (id) => {
    const response = await fetch(`${API_URL}/notifications/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to delete notification #${id}`);
    }

    return true;
};

// CREATE NOTIFICATION (e.g. system alert / custom reminder)
export const createNotification = async (notificationData) => {
    const response = await fetch(`${API_URL}/notifications`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(notificationData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create notification");
    }

    return await response.json();
};
