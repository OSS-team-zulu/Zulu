import React, {Component, useState} from 'react';
import logo from './geo_icon.png';
import './App.css';
import MapComponent from "./components/Map/MapGeojsonMarkers.jsx";
import { Fab } from "material-ui"
import { Container, Button, Link, darkColors} from 'react-floating-action-button'
import { Modal, Button as OButton} from 'react-bootstrap'
import { FaPlus} from 'react-icons/fa';

class App extends Component {
    render() {
        return (
            <div className="App">
                <MapWidow/>
                <Buttons/>
                <PostModal/>
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

class Buttons extends Component {

    showModal = () => {this.setState({ show: true });};

    hideModal = () => {this.setState({ show: false });};

    render() {
        return(
            <div className="leaflet-bottom leaflet-right buttons-container" >
                 <Container>
                    <Button
                        onClick={() => alert('About')}
                        styles={{backgroundColor: darkColors.cyan, color: darkColors.white}}
                        tooltip="About Zulu"
                        icon={<FaPlus/>} />
                    <Button
                        onClick={() => alert('POST')}
                        styles={{backgroundColor: darkColors.cyan, color: darkColors.white}}
                        tooltip="Add a story with a photo"
                        icon={<FaPlus/>} />
                    <Fab
                        styles={{backgroundColor: darkColors.cyan, color: darkColors.white}}
                        tooltip="Add a new story!"
                        icon="fa fa-plus"
                        rotate={true}
                        onClick={this.showModal} />
                </Container>
            </div>
        )
    }
}

class PostModal extends Component {

    render() {
        return(
            <div className="leaflet-bottom leaflet-left buttons-container" >
              <Modal show={false} onHide={null} >
                <Modal.Header closeButton>
                  <Modal.Title>Post a story</Modal.Title>
                </Modal.Header>
                <Modal.Body>Enter your post!</Modal.Body>
                <Modal.Footer>
                  <OButton variant="primary" onClick={this.hideModal} styles={{backgroundColor: darkColors.cyan, color: darkColors.white}}>
                    Close
                  </OButton>
                  <OButton variant="secondary" onClick={this.hideModal} styles={{backgroundColor: darkColors.cyan, color: darkColors.white}}>
                    Post
                  </OButton>
                </Modal.Footer>
              </Modal>
            </div>
        )
    }
}




class CornerLogo extends Component {
    render() {
        return(
            <div className="leaflet-top leaflet-left" >
                <div className="App-header" >
                    <h2>Zulu App</h2>
                    <FaPlus/>
                    <img src={logo} className="App-logo" alt="logo"  />
                </div>
            </div>
        )
    }
}

export default App;
