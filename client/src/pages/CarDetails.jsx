import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import '../App.css'
import customCarAPI from '../services/CustomCarsAPI.jsx'
import colorsAPI from '../services/ColorsAPI.jsx'
import wheelsAPI from '../services/WheelsAPI.jsx'
import carsAPI from '../services/CarsAPI.jsx'

const CarDetails = () => {
    const [carData, setCarData] = useState(null);
    const [selectedColor, setSelectedColor] = useState([]);
    const [selectedWheels, setSelectedWheels] = useState([]);
    const [selectedCarModel, setSelectedCarModel] = useState([]);

    const { id } = useParams()

    useEffect(() => {
        customCarAPI.getCustomCarById(id).then(setCarData);
    }, [id]);

    useEffect(() => {
        if (!carData) return;
        colorsAPI.getColorById(carData.color_id).then(setSelectedColor);
        wheelsAPI.getWheelsById(carData.wheels_id).then(setSelectedWheels);
        carsAPI.getCarById(carData.car_id).then(setSelectedCarModel);
    }, [carData]);

    const handleDelete = () => {
        customCarAPI.deleteCustomCar(id).then(() => {
            console.log('Custom car deleted:', id);
        });
    };

    return (
        <div>
            {carData ? (
                <div>
                    <h1>{carData.name}</h1>
                    <img src={carData.image_url} alt={carData.name} />
                    <div className="car-details-info">
                        <p>Model: {selectedCarModel.model}</p>
                        <p>Color: {selectedColor.name}</p>
                        <p>Wheels: {selectedWheels.name}</p>
                        <p>Total Price: ${carData.total_price}</p>
                    </div>
                    <div className="car-details-description">
                        <h2>Description</h2>
                        <p>{selectedCarModel.description}</p>
                    </div>

                    <div className="options">
                        <button onClick={handleDelete}>Delete</button>
                        <Link to={`/edit/${carData.id}`}><button>Edit</button></Link>
                    </div>
                </div>
            ) : (
                <p>Loading…</p>
            )}
        </div>
    )
}

export default CarDetails