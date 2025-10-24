export const getAllCustomCars = async () => {
    const response = await fetch('/api/customCar');
    return response.json();
}
export const getCustomCarById = async (id) => {
    const response = await fetch(`/api/customCar/${id}`);
    return response.json();
}
export const createCustomCar = async (customCarData) => {
    const response = await fetch('/api/customCar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customCarData),
    });

    let data;
    try {
        data = await response.json();
    } catch (error) {
        data = null;
    }

    if (!response.ok && response.status == 400) {
        const message = data?.error || 'Failed to create custom car';
        const err = new Error(message);
        err.response = response;
        throw err;
    }

    return data;
}
export const updateCustomCar = async (id, customCarData) => {
    const response = await fetch(`/api/customCar/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customCarData),
    });
    return response.json();
}
export const deleteCustomCar = async (id) => {
    const response = await fetch(`/api/customCar/${id}`, {
        method: 'DELETE',
    });
    return response.json();
}

export default { getAllCustomCars, getCustomCarById, createCustomCar, updateCustomCar, deleteCustomCar };