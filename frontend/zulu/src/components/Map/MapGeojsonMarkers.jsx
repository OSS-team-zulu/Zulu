import React from "react";
import L from 'leaflet';
import {Map, TileLayer, Marker, Popup} from "react-leaflet";
import Basemap from './Basemaps';
import GeojsonLayer from './GeojsonLayerFunc';
import './Map.css';
import {usePosition} from '../Position_getter/use_position'

L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";

class MapComponent extends React.Component {
    state = {
        lat: 31.8181237,
        lng: 35.2072444,
        zoom: 14,
        basemap: 'dark',
        time: Date.now(),
        geojsonvisible: false,

    };


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


    componentDidMount() {

        const geo = navigator.geolocation;

        const watcher = geo.watchPosition(this.onChange, this.onError);
    }


    render() {
        var center = [this.state.lat, this.state.lng];

        navigator.geolocation.getCurrentPosition(function (position) {

            this.setState({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
            this.interval = setInterval(() => this.setState({time: Date.now()}), 1000);
            console.log("Latitude is :", position.coords.latitude);
            console.log("Longitude is :", position.coords.longitude);
        });

        const basemapsDict = {
            dark: "	https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
            osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            hot: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",

        }

        return (
            <Map zoom={this.state.zoom} center={center}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url={basemapsDict[this.state.basemap]}
                />
                <Basemap basemap={this.state.basemap} onChange={this.onBMChange}/>


                <GeojsonLayer url="places2.json" cluster={true}/>


                };


                <Marker position={center}>
                    <Popup>
                        <div>צדיק כתמר יפרח</div>

                    </Popup>
                </Marker>
            </Map>
        );
    }


    componentWillUnmount() {
        clearInterval(this.interval);
    }
};

export default MapComponent;