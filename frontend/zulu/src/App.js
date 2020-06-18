import React, {Component} from 'react';
import logo from './geo_icon.png';
import './App.css';
import MapComponent from "./components/Map/MapGeojsonMarkers.jsx";
import { Container, Button, Link, darkColors} from 'react-floating-action-button'
import { FaPlus} from 'react-icons/fa';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header/>
                <MapWidow/>
                <Buttons/>
            </div>
        );
    }
}

class Header extends Component {
    render() {
        return(
            <div className="App-header" >
                <h2>Zulu App</h2>
                <img src={logo} className="App-logo" alt="logo"  />
            </div>
        )
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

class Buttons extends Component {
    render() {
        return(
            <div className="leaflet-bottom leaflet-right buttons-container" >
                 <Container>
                    <Button
                        onClick={() => alert('POST')}
                        styles={{backgroundColor: darkColors.cyan, color: darkColors.white}}
                        tooltip="Create note link"
                        icon={FaPlus} />
                    <Button
                        onClick={() => alert('POST')}
                        styles={{backgroundColor: darkColors.cyan, color: darkColors.white}}
                        tooltip="Add user link"
                        icon={FaPlus} />
                    <Button
                        styles={{backgroundColor: darkColors.cyan, color: darkColors.white}}
                        tooltip="Add a new post!"
                        icon="react-icons/fa"
                        rotate={true}
                        onClick={() => alert('POST')} />
                </Container>
            </div>
        )
    }
}


export default App;
