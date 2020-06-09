import React, {Component} from 'react';
import logo from './geo_icon.png';
import './App.css';
import MapComponent from "./components/Map/MapGeojsonMarkers.jsx";

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header" >
                   <h2>Zulu App</h2>
                    <img src={logo} className="App-logo" alt="logo"  />
                </div>
                <MapComponent/>
            </div>
        );
    }
}

export default App;
