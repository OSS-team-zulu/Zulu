import React, {Component} from 'react';
import logo from './geo_icon.png';
import './App.css';
import MapComponent from "./components/Map/MapGeojsonMarkers.jsx";
import {Buttons, PostModal} from "./components/Map/MapGeojsonMarkers";

class App extends Component {
    render() {
        return (
            <div className="App">
                <MapWidow/>
                <CornerLogo/>
            </div>
        );
    }
}

class MapWidow extends Component {
    render() {
        return(
            <div className="">
                <MapComponent/>
            </div>
        )
    }
}
class CornerLogo extends Component {
    render() {
        return(
            <div className="leaflet-top  leaflet-left">
                <div className="App-header" >
                    <h2>Zulu App</h2>
                    <img src={logo} className="App-logo" alt="logo"  />
                </div>
            </div>
        )
    }
}

export default App;
