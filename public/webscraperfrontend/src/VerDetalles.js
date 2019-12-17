import React, {useEffect, useState} from "react";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import defaultImage from './imageDefault.png';
import backArrow from './backArrow.png';

export default function VerDetalles() {

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const [rows, setRows] = useState(null);

    async function getDataById() {
        const response = await axios.get('/api/search?id=' + id)
        return response.data;
    }

    useEffect(() => {
        async function fetchData() {
            const result = await getDataById();
            setRows(result);
        }

        fetchData();
    }, [id]);

    if (rows === null) {
        return <CircularProgress/>
    }

    return (
        <div className="details-container">

            <div className="backArrow-container">
                <a href="/Resultados"><img src={backArrow} alt="Volver atrás" className="backArrow"/></a>
            </div>

            <div className="product-imagen">
                {rows.data.imagen ?
                    <img className="image" src={rows.data.imagen} alt="Imagen"/> :
                    <img className="image" src={defaultImage} alt="Imagen"/>
                }
            </div>
            <div className="details-card">
                <div className="details-card-title">
                    <p>Detalles de la búsqueda con ID: {id}</p>
                </div>
                <div className="search-details">
                    <div>
                        <p><span className="details-card-tag">Término buscado:</span> {rows.data.busqueda}</p>
                    </div>
                    <div>
                        <p><span className="details-card-tag">URL: </span><a className="product-details-url"
                                                                             href={rows.data.url}>{rows.data.url}</a>
                        </p>
                    </div>
                    <div>
                        <p><span className="details-card-tag">Tiempo de búsqueda: </span>{rows.data.runtime}</p>
                    </div>
                    <div>
                        <p><span className="details-card-tag">Estado de la búsqueda: </span>{rows.data.estado}</p>
                    </div>
                </div>

                <div className="product-details-title">
                    <p>Detalles del producto con ID: {id}</p>
                </div>
                <div className="product-details">
                    <div>
                        {rows.data.nombre ?
                            <p><span className="details-card-tag">Nombre: </span> {rows.data.nombre}</p> :
                            <p><span className="details-card-tag">Nombre: </span><span
                                className="details-card-no-result"> La búsqueda no obtuvo ningún nombre </span></p>
                        }
                    </div>
                    <div>
                        {rows.data.descripcion ?
                            <p><span className="details-card-tag">Descripción: </span>{rows.data.descripcion}</p> :
                            <p><span className="details-card-tag">Descripción: </span><span
                                className="details-card-no-result">La búsqueda no obtuvo ninguna descripción</span></p>
                        }
                    </div>
                    <div>
                        {rows.data.precio ?
                            <p><span className="details-card-tag">Precio: </span>{rows.data.precio}</p> :
                            <p><span className="details-card-tag">Precio: </span><span
                                className="details-card-no-result">La búsqueda no obtuvo ningún precio</span></p>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}