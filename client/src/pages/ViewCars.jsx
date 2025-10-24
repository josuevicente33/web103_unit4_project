import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../App.css'
import '../css/ViewCars.css'
import customCarAPI from '../services/CustomCarsAPI.jsx'


const ViewCars = () => {

    const [customCars, setCustomCars] = useState([]);
    useEffect(() => {
        customCarAPI.getAllCustomCars().then((data) => {
            setCustomCars(data);
            console.log('Fetched Custom Cars:', data);
        });
    }, []);

    const handleDelete = (id) => {
        customCarAPI.deleteCustomCar(id).then(() => {
            setCustomCars(customCars.filter(car => car.id !== id));
        });
    }

    return (
        <div>
            <h1>Custom Cars</h1>
            <div className="custom-cars-grid">
                {customCars.map((car) => (
                    <div key={car.id} className="custom-car-card">
                        <img src={car.image_url} alt={car.name} className="custom-car-image" />
                        <h2>{car.name}</h2>
                        <p>Total Price: ${car.total_price}</p>

                        <div className="options">
                            <p> Delete | Edit </p>
                            <button onClick={() => handleDelete(car.id)}>Delete</button>
                            <Link to={`/edit/${car.id}`}><button>Edit</button></Link>
                            <Link to={`/customcars/${car.id}`}><button>View</button></Link>
                        </div>

                    </div>
                ))}
            </div>
            
        </div>
    )
}

export default ViewCars