import { useState, useEffect } from 'react'
import '../App.css'
import '../css/CreateCar.css'
import customCarAPI from '../services/CustomCarsAPI.jsx'
import colorsAPI from '../services/ColorsAPI.jsx'
import wheelsAPI from '../services/WheelsAPI.jsx'
import carsAPI from '../services/CarsAPI.jsx'

const CreateCar = () => {
    const [carModels, setCarModels] = useState([]);
    const [colors, setColors] = useState([]);
    const [wheelsOptions, setWheelsOptions] = useState([]);

    const [selectedModel, setSelectedModel] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedWheels, setSelectedWheels] = useState('');
    const [customCarName, setCustomCarName] = useState('');

    // log everything selected
    useEffect(() => {
        console.log('Selected Model:', selectedModel);
        console.log('Selected Color:', selectedColor);
        console.log('Selected Wheels:', selectedWheels);
        console.log('Custom Car Name:', customCarName);
    }, [selectedModel, selectedColor, selectedWheels, customCarName]);

    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // fetch available car models, colors, wheels, etc. from APIs
        carsAPI.getAllCars().then(setCarModels);
        colorsAPI.getAllColors().then(setColors);
        wheelsAPI.getAllWheels().then(setWheelsOptions);

        // log fetched data
        console.log('Fetched Car Models:', carModels);
        console.log('Fetched Colors:', colors);
        console.log('Fetched Wheels Options:', wheelsOptions);

    }, []);


    const handleSumit = (event) => {
        event.preventDefault();

        if (customCarName.trim() === '') {
            alert('Please enter a name for your custom car.');
            return;
        }

        customCarAPI.createCustomCar({
            name: customCarName,
            car_id: carModels.find(car => car.id === parseInt(selectedModel)).id,
            color_id: colors.find(color => color.id === parseInt(selectedColor)).id,
            wheels_id: wheelsOptions.find(wheels => wheels.id === parseInt(selectedWheels)).id,
            total_price: totalPrice,
            image_url: carModels.find(car => car.id === parseInt(selectedModel)).image_url
        }).then((data) => {
            console.log('Custom car created:', data);
        }).catch((error) => {
            console.error('Error creating custom car:', error);
        });
    }

    const handlePriceCalculation = () => {
        let price = 0;
        const selectedCar = carModels.find(car => car.id === parseInt(selectedModel));
        const selectedColorOption = colors.find(color => color.id === parseInt(selectedColor));
        const selectedWheelsOption = wheelsOptions.find(wheels => wheels.id === parseInt(selectedWheels));  
        if (selectedCar) price += parseFloat(selectedCar.base_price);
        if (selectedColorOption) price += parseFloat(selectedColorOption.price);
        if (selectedWheelsOption) price += parseFloat(selectedWheelsOption.price);
        setTotalPrice(price);
    }

    useEffect(() => {
        handlePriceCalculation();
    }, [selectedModel, selectedColor, selectedWheels]);

    return (
        <div>

            <div className="create-car-page">
                <h1>Create Your Custom Car</h1>
                {/* Selection menu to choose the options to view right now from wheels, cars, colors */}
                <div className="selection-menus">
                    <div className="menu">
                        <label>Car Model:</label>
                        <select onChange={(e) => setSelectedModel(e.target.value)} value={selectedModel}>
                            <option value="">Select a model</option>
                            {carModels.map((car) => (
                                <option key={car.id} value={car.id}>
                                    {car.model} - ${car.base_price}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="menu">
                        <label>Color:</label>
                        <select onChange={(e) => setSelectedColor(e.target.value)} value={selectedColor}>
                            <option value="">Select a color</option>
                            {colors.map((color) => (
                                <option key={color.id} value={color.id}>
                                    {color.name} - ${color.price}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="menu">
                        <label>Wheels:</label>
                        <select onChange={(e) => setSelectedWheels(e.target.value)} value={selectedWheels}>
                            <option value="">Select wheels</option>
                            {wheelsOptions.map((wheels) => (
                                <option key={wheels.id} value={wheels.id}>
                                    {wheels.name} - ${wheels.price}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>


            <div className="total-price">
                <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
            </div>

            <div> 
                <input
                    id="car-name"
                    type="text"
                    placeholder="Custom Car Name"
                    value={customCarName}
                    onChange={(e) => setCustomCarName(e.target.value)}
                />                
                <button onClick={handleSumit}>Create Custom Car</button>
            </div>

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
    )
}

export default CreateCar