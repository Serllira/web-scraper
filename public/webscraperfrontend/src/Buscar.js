import React, {useState} from 'react';
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default function Buscar() {
    const [inputValue, setInputValue] = useState('');
    const [open, setOpen] = React.useState(false);
    const searchTerm = (inputValue) => {
        setOpen(true);
        axios.post('/api', {q: inputValue});
    };

    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <div>
            <div className="title-search-page">
                <span className="letter">W</span>
                <span className="letter">E</span>
                <span className="letter">B</span>
                <span className="letter"> </span>
                <span className="letter">S</span>
                <span className="letter">C</span>
                <span className="letter">R</span>
                <span className="letter">A</span>
                <span className="letter">P</span>
                <span className="letter">E</span>
                <span className="letter">R</span>
            </div>

            <div className="search-container">
                <form onSubmit={event => {
                    event.preventDefault()
                }} name="search-form" id="search-form" method="">
                    <div>
                        <TextField id="standard-basic" label="Busca una referencia" value={inputValue}
                                   onChange={e => setInputValue(e.target.value)} className="searchField"/>
                    </div>
                    <div className="send-button">
                        <Button variant="contained" color="#2B7A78" onClick={() => searchTerm(inputValue)}>
                            Buscar
                        </Button>
                    </div>
                </form>

                {inputValue ?
                    <Snackbar
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: 'center',
                        }}
                        open={open}
                        autoHideDuration={2500}
                        onClose={handleNotificationClose}
                        variant="success"
                        message={"Iniciando la búsqueda de " + inputValue}
                        className="onSearchMessage">
                    </Snackbar> :

                    <Snackbar
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: 'center',
                        }}
                        open={open}
                        autoHideDuration={2500}
                        onClose={handleNotificationClose}
                        variant="success"
                        message={"Introduce un termino en el buscador"}
                        className="onSearchMessage">
                    </Snackbar>
                }
            </div>
        </div>
    );
}