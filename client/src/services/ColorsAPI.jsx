export const getAllColors = async () => {
    const response = await fetch('/api/colors');
    return response.json();
}

export const getColorById = async (id) => {
    const response = await fetch(`/api/colors/${id}`);
    return response.json();
}

export default { getAllColors, getColorById };