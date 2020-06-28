import React, {Component} from "react";
import L from 'leaflet';
import {Map, Marker, Popup, TileLayer} from "react-leaflet";
import Basemap from './Basemaps';
import GeojsonLayer from './GeojsonLayerFunc';
import './Map.css';
import {Button as OButton, Modal} from "react-bootstrap";
import {Button, Container, darkColors} from "react-floating-action-button";
import {FaPlus} from "react-icons/fa";
import Card from "../Card/Card";

L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";

class MapComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lat: 0.00,
            lng: 0.00,
            zoom: 14,
            basemap: 'dark',
            time: Date.now(),
            geojsonvisible: false,
            showModal:false
        };

    }

    onBMChange = (bm) => {
        this.setState({
            basemap: bm
        });
    }

    onGeojsonToggle = (e) => {

        this.setState({
            geojsonvisible: e.currentTarget.checked
        });
    }

    onError = (error) => {
        console.log(error)
    };


    onChange = ({coords}) => {
        this.setState({
            lat: coords.latitude,
            lng: coords.longitude,
        });
        console.log(coords)
    };

    setLocationState() {

         navigator.geolocation.getCurrentPosition((position) => {
            this.setState({lat: position.coords.latitude, lng: position.coords.longitude})
          },
           (error) => {},
           {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000}
          );

    }
    componentDidMount() {
        
        this.setLocationState();

        // TODO: figure out why this causes all points at GeoJsonLayer
        // component to re-render
        this.selfLocationInterval = setInterval(() => {
                                this.setLocationState(); 
                                }, 
                                15000);
      };
     showModal = () => {
        this.setState({showModal: true})
    };
    render() {
        var center = [this.state.lat, this.state.lng];
        var closePointsURL = "http://localhost:8342/api/point?longitude=" + this.state.lng + "&latitude=" + this.state.lat + "&max_distance=5000";


        const basemapsDict = {
            dark: "	https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
            osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            hot: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",

        }

        return (
            <div>
            <Map zoom={this.state.zoom} center={center}>
                <div className="leaflet-bottom leaflet-right buttons-container">
                    <Container>
                        <Button
                            onClick={() => alert('About')}
                            styles={{backgroundColor: darkColors.cyan, color: darkColors.white}}
                            tooltip="About Zulu"
                            icon={FaPlus}/>
                        <Button
                            onClick={() => alert('POST')}
                            styles={{backgroundColor: darkColors.cyan, color: darkColors.white}}
                            tooltip="Add a story with a photo"
                            icon={FaPlus}/>
                        <Button
                            styles={{backgroundColor: darkColors.cyan, color: darkColors.white}}
                            tooltip="Add a new story!"
                            icon="react-icons/fa"
                            rotate={true}
                            onClick={this.showModal}/>
                    </Container>
                </div>
                {this.state.showModal&&  <Popup position={[this.state.lat,this.state.lng]}>
                        <div>
                            <form id="popup-form">
                            <label for="input-post">Post:</label>
                            <input id="input-post" class="popup-input" type="text" />
                            </form>
                        </div>

                </Popup>
                        }

                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url={basemapsDict[this.state.basemap]}
                />
                <Basemap basemap={this.state.basemap} onChange={this.onBMChange}/>


                <GeojsonLayer url={closePointsURL} cluster={true}/>


                };


                <Marker position={center}>
                    <Popup>
                        <div>Your Location - latitude: {Number(this.state.lat).toFixed(4)} - longitude: {Number(this.state.lng).toFixed(4)}</div>
                    </Popup>
                </Marker>
            </Map>
            </div>
        );
    }


    componentWillUnmount() {
        clearInterval(this.selfLocationInterval);
    }
}

export default MapComponent;
