const API_URL = "http://localhost:8080/api";

// LOGIN
export const loginUser = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    if (!response.ok) {
        throw new Error("Invalid email or password");
    }

    const data = await response.json();
    return data.token;
};

// REGISTER
export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Registration failed. Please try again.");
    }

    return data;
};

// TOKEN
export const getToken = () => {
    return localStorage.getItem("token");
};

export const setToken = (token) => {
    localStorage.setItem("token", token);
};

export const removeToken = () => {
    localStorage.removeItem("token");
};

// LOGOUT
export const logoutUser = () => {
    removeToken();
};

// GET CURRENT USER
export const getCurrentUser = async () => {
    const token = getToken();

    if (!token) {
        throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch current user: ${response.status}`);
    }

    return await response.json();
};

// UPDATE CURRENT USER PROFILE
export const updateCurrentUser = async (profileData) => {
    const token = getToken();

    if (!token) {
        throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/auth/me`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || `Failed to update profile (${response.status})`);
    }

    return data;
};