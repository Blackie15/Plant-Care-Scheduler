import { getToken } from "./authService";

const API_URL = "http://localhost:8080/api/species";

const authHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const getAllSpecies = async () => {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch species (HTTP ${response.status})`);
    }

    return await response.json();
};

export const getSpeciesById = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch species #${id}`);
    }

    return await response.json();
};

export const createSpecies = async (speciesData) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(speciesData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create species");
    }

    return await response.json();
};

export const updateSpecies = async (id, speciesData) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(speciesData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update species #${id}`);
    }

    return await response.json();
};

export const deleteSpecies = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to delete species #${id}`);
    }

    return true;
};
