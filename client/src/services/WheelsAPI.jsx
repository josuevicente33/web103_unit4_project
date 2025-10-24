export const getAllWheels = async () => {
    const response = await fetch('/api/wheels');
    return response.json();
}
export const getWheelsById = async (id) => {
    const response = await fetch(`/api/wheels/${id}`);
    return response.json();
}

export default { getAllWheels, getWheelsById };