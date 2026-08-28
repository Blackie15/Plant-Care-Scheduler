import { getToken } from "./authService";

const API_URL = "http://localhost:8080/api";

const authHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// GET ALL CONSULTATIONS
export const getConsultations = async () => {
    const response = await fetch(`${API_URL}/consultations`, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch consultations (HTTP ${response.status})`);
    }

    return await response.json();
};

// GET REGISTERED SPECIALISTS (From MySQL database with auto-generated IDs)
export const getSpecialists = async () => {
    try {
        const response = await fetch(`${API_URL}/users/specialists`, {
            method: "GET",
            headers: authHeaders(),
        });

        if (response.ok) {
            return await response.json();
        }
    } catch (e) {
        console.warn("Could not load specialists from API:", e);
    }
    return [];
};

// GET CONSULTATIONS FOR USER
export const getConsultationsByUser = async (userId) => {
    const response = await fetch(`${API_URL}/consultations/user/${userId}`, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch user consultations (HTTP ${response.status})`);
    }

    return await response.json();
};

// GET CONSULTATION BY ID
export const getConsultationById = async (id) => {
    const response = await fetch(`${API_URL}/consultations/${id}`, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch consultation #${id}`);
    }

    return await response.json();
};

// CREATE CONSULTATION REQUEST
export const createConsultation = async (consultationData) => {
    const response = await fetch(`${API_URL}/consultations`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(consultationData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to book consultation");
    }

    return await response.json();
};

// UPDATE CONSULTATION
export const updateConsultation = async (id, consultationData) => {
    const response = await fetch(`${API_URL}/consultations/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(consultationData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update consultation #${id}`);
    }

    return await response.json();
};

// DELETE CONSULTATION
export const deleteConsultation = async (id) => {
    const response = await fetch(`${API_URL}/consultations/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to delete consultation #${id}`);
    }

    return true;
};
