import { getToken } from "./authService";

const API_URL = "http://localhost:8080/api";

const authHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// GET USER BY ID
export const getUserById = async (id) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch user #${id}`);
    }

    return await response.json();
};

// GET ALL USERS
export const getAllUsers = async () => {
    const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch users`);
    }

    return await response.json();
};

// GET SPECIALISTS
export const getSpecialists = async () => {
    const response = await fetch(`${API_URL}/users/specialists`, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch specialists`);
    }

    return await response.json();
};

// UPDATE USER BY ID
export const updateUserById = async (id, userData) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(userData),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || `Failed to update user #${id}`);
    }

    return data;
};
