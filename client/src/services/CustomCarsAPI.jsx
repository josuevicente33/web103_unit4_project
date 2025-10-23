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
    return response.json();
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