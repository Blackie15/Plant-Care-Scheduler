import { getToken } from "./authService";

const API_URL = "http://localhost:8080/api";

const authHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// GET ALL PLANTS (optionally by ownerId)
export const getPlants = async (ownerId = null) => {
    const url = ownerId ? `${API_URL}/plants?ownerId=${ownerId}` : `${API_URL}/plants`;
    const response = await fetch(url, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch plants (HTTP ${response.status})`);
    }

    return await response.json();
};

// GET SINGLE PLANT
export const getPlantById = async (id) => {
    const response = await fetch(`${API_URL}/plants/${id}`, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch plant #${id}`);
    }

    return await response.json();
};

// CREATE PLANT
export const createPlant = async (plantData) => {
    const response = await fetch(`${API_URL}/plants`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(plantData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create plant`);
    }

    return await response.json();
};

// UPDATE PLANT
export const updatePlant = async (id, plantData) => {
    const response = await fetch(`${API_URL}/plants/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(plantData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update plant`);
    }

    return await response.json();
};

// DELETE PLANT
export const deletePlant = async (id) => {
    const response = await fetch(`${API_URL}/plants/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to delete plant #${id}`);
    }

    return true;
};

// GET ALL SPECIES (Dynamically fetched from backend database)
export const getSpecies = async () => {
    const response = await fetch(`${API_URL}/species`, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch species catalog`);
    }

    return await response.json();
};

// CREATE CUSTOM SPECIES (Auto-generated ID returned by MySQL)
export const createSpecies = async (speciesData) => {
    const response = await fetch(`${API_URL}/species`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(speciesData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create species`);
    }

    return await response.json();
};
