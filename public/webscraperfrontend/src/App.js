import React from 'react';
import './App.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Buscar from "./Buscar";
import VerDetalles from "./VerDetalles";
import Resultados from "./Resultados";
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";

function App() {
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    return (
        <Router>
            <div className="container">
                <div className="sideMenu">
                    <List component="nav" aria-label="main mailbox folders">
                        <Link to="/Buscar">
                            <ListItem
                                button
                                selected={selectedIndex === 0}
                                onClick={() => setSelectedIndex(0)}
                            >
                                <ListItemText primary="Realizar búsqueda"/>
                            </ListItem>
                        </Link>
                        <hr className="listSeparator"/>
                        <Link to="/Resultados">
                            <ListItem
                                button
                                selected={selectedIndex === 1}
                                onClick={() => setSelectedIndex(1)}
                            >
                                <ListItemText primary="Ver todos los resultados"/>
                            </ListItem>
                        </Link>
                    </List>
                </div>
                <Switch>
                    <Route path="/Buscar">
                        <Buscar/>
                    </Route>
                    <Route path="/Resultados">
                        <Resultados/>
                    </Route>
                    <Route path="/VerDetalles">
                        <VerDetalles/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
