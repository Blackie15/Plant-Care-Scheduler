import { getToken } from "./authService";

const API_URL = "http://localhost:8080/api";

const authHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// GET ALL TASKS
export const getTasks = async () => {
    const response = await fetch(`${API_URL}/tasks`, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch tasks (HTTP ${response.status})`);
    }

    return await response.json();
};

// GET TASKS FOR A PLANT
export const getTasksByPlant = async (plantId) => {
    const response = await fetch(`${API_URL}/tasks/plant/${plantId}`, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch tasks for plant #${plantId}`);
    }

    return await response.json();
};

// CREATE TASK
export const createTask = async (taskData) => {
    const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(taskData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create care task");
    }

    return await response.json();
};

// UPDATE TASK
export const updateTask = async (id, taskData) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(taskData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update task #${id}`);
    }

    return await response.json();
};

// COMPLETE TASK (1-click action)
export const completeTask = async (id) => {
    const response = await fetch(`${API_URL}/tasks/${id}/complete`, {
        method: "PATCH",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to complete task #${id}`);
    }

    return await response.json();
};

// DELETE TASK
export const deleteTask = async (id) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to delete task #${id}`);
    }

    return true;
};
