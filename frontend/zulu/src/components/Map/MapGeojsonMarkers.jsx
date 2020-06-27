import React from "react";
import L from 'leaflet';
import {Map, TileLayer, Marker, Popup} from "react-leaflet";
import Basemap from './Basemaps';
import GeojsonLayer from './GeojsonLayerFunc';
import GeoWikipediaLayer from './GeoWikipediaLayerFunc';
import './Map.css';
import {usePosition} from '../Position_getter/use_position'
import { MyLocationIcon } from "../../Icons/Icon.MyLocation";

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

    render() {
        var center = [this.state.lat, this.state.lng];
        var closePointsURL = "http://localhost:8342/api/point?longitude=" + this.state.lng + "&latitude=" + this.state.lat + "&max_distance=5000";

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


                <GeojsonLayer url={closePointsURL} cluster={true}/>

                <GeoWikipediaLayer lat={center[0]} lng={center[1]} maxDist={5000} cluster={true}/>
                


                <Marker position={center} icon={MyLocationIcon}>
                    <Popup>
                        <div>Your Location - latitude: {Number(this.state.lat).toFixed(4)} - longitude: {Number(this.state.lng).toFixed(4)}</div>
                    </Popup>
                </Marker>
            </Map>
        );
    }


    componentWillUnmount() {
        clearInterval(this.selfLocationInterval);
    }
};

export default MapComponent;