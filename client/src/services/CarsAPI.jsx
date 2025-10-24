// API for cars
export const getAllCars = async () => {
    const response = await fetch('/api/cars');
    return response.json();
}
export const getCarById = async (id) => {
    const response = await fetch(`/api/cars/${id}`);
    return response.json();
}

export default { getAllCars, getCarById };