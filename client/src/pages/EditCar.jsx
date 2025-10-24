import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';

import '../App.css'
import customCarAPI from '../services/CustomCarsAPI.jsx'
import colorsAPI from '../services/ColorsAPI.jsx'
import wheelsAPI from '../services/WheelsAPI.jsx'
import carsAPI from '../services/CarsAPI.jsx'

const EditCar = () => {
    const [carModels, setCarModels] = useState([]);
    const [colors, setColors] = useState([]);
    const [wheelsOptions, setWheelsOptions] = useState([]);

    const [selectedModel, setSelectedModel] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedWheels, setSelectedWheels] = useState('');
    const [customCarName, setCustomCarName] = useState('');

    const [carData, setCarData] = useState(null);
    const [error, setError] = useState(null);
    const { id } = useParams()
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;
        let cancelled = false;

        (async () => {
            try {
                const data = await customCarAPI.getCustomCarById(id);
                if (!cancelled) setCarData(data);
                console.log('Fetched Car Data for Editing:', data);
            } catch (e) {
                console.error(e);
                if (!cancelled) setError('Failed to load car');
            }
        })();
        if (carData) {
            setSelectedModel(carData.car_id);
            setSelectedColor(carData.color);
            setSelectedWheels(carData.wheels);
            setCustomCarName(carData.name);
        }
        return () => { cancelled = true; };
    }, [id]);

    useEffect(() => {
        carsAPI.getAllCars().then(setCarModels);
        colorsAPI.getAllColors().then(setColors);
        wheelsAPI.getAllWheels().then(setWheelsOptions);

        console.log('Fetched Car Models:', carModels);
        console.log('Fetched Colors:', colors);
        console.log('Fetched Wheels Options:', wheelsOptions);
    }, [id]);

    useEffect(() => {
        if (!carData) return;

        const carId   = carData.car_id   ?? carData.carId   ?? carData.car?.id;
        const colorId = carData.color_id ?? carData.colorId ?? carData.color?.id ?? carData.color;
        const wheelId = carData.wheels_id ?? carData.wheelId ?? carData.wheels?.id ?? carData.wheels;
        setCustomCarName(carData.name ?? '');

        if (carId != null && carModels.some(m => String(m.id) === String(carId))) {
            setSelectedModel(String(carId));
        }
        if (colorId != null && colors.some(c => String(c.id) === String(colorId))) {
            setSelectedColor(String(colorId));
        }
        if (wheelId != null && wheelsOptions.some(w => String(w.id) === String(wheelId))) {
            setSelectedWheels(String(wheelId));
        }
    }, [carData, carModels, colors, wheelsOptions]);
    
    const handlePriceCalculation = () => {
        let price = 0;
        const selectedCar = carModels.find(car => car.id === parseInt(selectedModel));
        const selectedColorObj = colors.find(color => color.id === parseInt(selectedColor));
        const selectedWheelsObj = wheelsOptions.find(wheels => wheels.id === parseInt(selectedWheels)); 
        if (selectedCar) price += parseFloat(selectedCar.base_price);
        if (selectedColorObj) price += parseFloat(selectedColorObj.price);
        if (selectedWheelsObj) price += parseFloat(selectedWheelsObj.price);
        return price.toFixed(2);
    }

    const handleUpdate = (event) => {
        event.preventDefault();
        if (!id) {
            alert('Missing car id for update.');
            return;
        }

        console.log('Updating custom car with data:', {
            name: customCarName,
            car_id: carModels.find(car => car.id === parseInt(selectedModel)).id,
            color_id: colors.find(color => color.id === parseInt(selectedColor)).id,
            wheels_id: wheelsOptions.find(wheels => wheels.id === parseInt(selectedWheels)).id,
            image_url: carModels.find(car => car.id === parseInt(selectedModel)).image_url
        });

        customCarAPI.updateCustomCar(id, {
            name: customCarName,
            total_price: handlePriceCalculation(),
            car_id: carModels.find(car => car.id === parseInt(selectedModel)).id,
            color_id: colors.find(color => color.id === parseInt(selectedColor)).id,
            wheels_id: wheelsOptions.find(wheels => wheels.id === parseInt(selectedWheels)).id,
            image_url: carModels.find(car => car.id === parseInt(selectedModel)).image_url
        }).then((data) => {
            console.log('Custom car updated:', data);
            navigate(`/customcars/${id}`);
        }).catch((error) => {
            console.error('Error updating custom car:', error);
        });
    }

    useEffect(() => {
        handlePriceCalculation();
    }, [selectedModel, selectedColor, selectedWheels]);

    if (!id) return <p>Missing car id in URL. Did you define the route like <code>&lt;Route path="/edit/:id" .../&gt;</code>?</p>;
    if (error) return <p>{error}</p>;
    if (!carData) return <p>Loading…</p>;

    return (
        <div className="container">
            <form >
                <div className="form-group">
                    <label htmlFor="customCarName">Custom Car Name:</label>
                    <input
                        type="text"
                        id="customCarName"
                        value={customCarName}
                        onChange={(e) => setCustomCarName(e.target.value)}
                    />

                    <label htmlFor="modelSelect">Car Model:</label>
                    <select
                        id="modelSelect"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                    >
                        <option value="">Select a model</option>
                        {carModels.map((model) => (
                            <option key={model.id} value={model.id}>
                                {model.model} (${model.base_price})
                            </option>
                        ))}
                    </select>

                    <label htmlFor="colorSelect">Color:</label>
                    <select
                        id="colorSelect"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                    >
                        <option value="">Select a color</option>
                        {colors.map((color) => (
                            <option key={color.id} value={color.id}>
                                {color.name} (${color.price})
                            </option>
                        ))}
                    </select>

                    <label htmlFor="wheelsSelect">Wheels:</label>
                    <select
                        id="wheelsSelect"
                        value={selectedWheels}
                        onChange={(e) => setSelectedWheels(e.target.value)}
                    >
                        <option value="">Select wheels</option>
                        {wheelsOptions.map((wheels) => (
                            <option key={wheels.id} value={wheels.id}>
                                {wheels.name} (${wheels.price})
                            </option>
                        ))}
                    </select>
                </div>
                <p>Total Price: ${handlePriceCalculation()}</p>
                <button type="submit" onClick={handleUpdate}>Save Changes</button>
            </form>

            <button className="secondary" onClick={() => navigate(-1)}>Back</button>



            {/* all the images of the items selected */}
            <div className="car-preview">
                {selectedModel && (
                    <div className='car'>
                        <h3>Car Model Preview:</h3>
                        <img src={carModels.find(car => car.id === parseInt(selectedModel)).image_url} alt={selectedModel.model} />
                    </div>
                )}
                {selectedColor && (
                    <div className='color'>
                        <h3>Color Preview:</h3>
                        <img src={colors.find(color => color.id === parseInt(selectedColor)).image_url} alt={colors.find(color => color.id === parseInt(selectedColor)).name} />
                    </div>
                )}
                {selectedWheels && (
                    <div className='wheels'>
                        <h3>Wheels Preview:</h3>
                        <img src={wheelsOptions.find(wheels => wheels.id === parseInt(selectedWheels)).image_url} alt={wheelsOptions.find(wheels => wheels.id === parseInt(selectedWheels)).name} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditCar;