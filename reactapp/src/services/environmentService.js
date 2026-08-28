import { getToken } from "./authService";

const API_URL = "http://localhost:8080/api/environment-data";

const authHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const getAllEnvironmentData = async () => {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch environment telemetry (HTTP ${response.status})`);
    }

    return await response.json();
};

export const getEnvironmentDataByPlant = async (plantId) => {
    const response = await fetch(`${API_URL}/plant/${plantId}`, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch environment data for plant #${plantId}`);
    }

    return await response.json();
};

export const createEnvironmentData = async (data) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to log environment reading");
    }

    return await response.json();
};

export const updateEnvironmentData = async (id, data) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update reading #${id}`);
    }

    return await response.json();
};

export const deleteEnvironmentData = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to delete reading #${id}`);
    }

    return true;
};
