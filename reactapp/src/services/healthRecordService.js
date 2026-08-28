import { getToken } from "./authService";

const API_URL = "http://localhost:8080/api";

const authHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// GET ALL HEALTH RECORDS
export const getHealthRecords = async () => {
    const response = await fetch(`${API_URL}/health-records`, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch health records (HTTP ${response.status})`);
    }

    return await response.json();
};

// GET HEALTH RECORDS FOR SPECIFIC PLANT
export const getHealthRecordsByPlant = async (plantId) => {
    const response = await fetch(`${API_URL}/health-records/plant/${plantId}`, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch health records for plant #${plantId}`);
    }

    return await response.json();
};

// GET HEALTH RECORD BY ID
export const getHealthRecordById = async (id) => {
    const response = await fetch(`${API_URL}/health-records/${id}`, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch health record #${id}`);
    }

    return await response.json();
};

// CREATE HEALTH RECORD
export const createHealthRecord = async (recordData) => {
    const response = await fetch(`${API_URL}/health-records`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(recordData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create health record");
    }

    return await response.json();
};

// UPDATE HEALTH RECORD
export const updateHealthRecord = async (id, recordData) => {
    const response = await fetch(`${API_URL}/health-records/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(recordData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update health record #${id}`);
    }

    return await response.json();
};

// DELETE HEALTH RECORD
export const deleteHealthRecord = async (id) => {
    const response = await fetch(`${API_URL}/health-records/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to delete health record #${id}`);
    }

    return true;
};
