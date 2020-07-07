import React, {Component} from "react";
import L from 'leaflet';
import {Map, TileLayer, Marker, Popup} from "react-leaflet";
import Basemap from './Basemaps';
import GeojsonLayer from './GeojsonLayerFunc';
import GeoWikipediaLayer from './GeoWikipediaLayerFunc';
import StoryService from '../../services/story.service';
import './Map.css';
import {Container} from "react-floating-action-button";
import {Fab} from '@material-ui/core';
import {FaPlus} from "react-icons/fa";
import { MyLocationIcon } from "../../Icons/Icon.MyLocation";
import axios from "axios";

L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";

class MapComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lat: 0.00,
            lng: 0.00,
            zoom: 14,
            basemap: 'dark',
            time: Date.now(),
            geojsonvisible: false,
            showModal:false,
            storyTitle: "",
            storyBody: "",
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileInput = React.createRef();
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
    };

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

    handleChange(event) {
      var target = event.target;
      var value = target.value;
      var name = target.name;

      this.setState({
        [name]: value
      });
    }

    handleSubmit(event) {
      event.preventDefault();
      let fileName = this.fileInput?.current?.files[0]?.name;
      let hasFile = (typeof fileName !== 'undefined');

      let debug = false;

      if (debug) {
        alert('A story was submitted:\ntitle:\n' + this.state.storyTitle +'\nbody\n'+ this.state.storyBody +'\n\nlat: '+ this.state.lat +'\nlong:'+ this.state.lng);
        if (hasFile) {
          alert(`Selected file - ${fileName}`);
        }
      }

      let imageId = null;

      if (hasFile) { // todo get photo id
        var bodyFormData = new FormData();
        bodyFormData.set('image', fileName);

        StoryService.postImage(
          fileName
        ).then(function (response) {
            //handle success
            imageId = response.id;
            console.log(response);
        })
        .catch(function (response) {
            //handle error
            console.log(response);
            alert('there was a problem adding your image, please try again soon.');
        });
      }

      let lng = this.state.lng;
      let lat = this.state.lat;
      let title = this.state.storyTitle;
      let content = this.state.storyBody;

      StoryService.postUserStory(
        lng, lat, title, content, imageId
      ).then(function (response) {
        //handle success
        alert('Successfully posted story!');
        console.log(response);
      })
      .catch(function (response) {
        //handle error
        alert('there was a problem posting this story, please try again soon.');
        console.log(response);
      });

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

        const basemapsDict = {
            dark: "	https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
            osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            hot: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",

        }

        return (
            <Map zoom={this.state.zoom} center={center}>
                <div className="leaflet-bottom leaflet-right buttons-container">
                    <Container>
                      <Fab
                        color="primary"
                        aria-label="edit"
                        tooltip="Add a new story!"
                        onClick={this.showModal}>
                        <FaPlus/>
                      </Fab>
                    </Container>
                </div>
                {this.state.showModal&&
                <Popup position={[this.state.lat,this.state.lng]}>
                  <form onSubmit={this.handleSubmit}>
                    <h3> Add your Story. </h3>
                    <label>
                      <br/>
                      Title:
                      <br/>
                      <input name="storyTitle" type="text" defaultValue={this.state.storyTitle} onChange={this.handleChange}/>
                      <br/>
                    </label>
                    <label>
                      <br/>
                      Body:<br/>
                      <textarea name="storyBody" defaultValue={this.state.storyBody} onChange={this.handleChange}/>
                      <br/>
                    </label>
                    <label>
                      <br/>
                      Add a photo: (optional) <br/>
                      <input type="file" ref={this.fileInput}/>
                      <br/>
                    </label>
                    <br/>
                    <br/>
                    <input type="submit" value="Submit"/>
                  </form>
                </Popup>}

                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url={basemapsDict[this.state.basemap]}
                />
                <Basemap basemap={this.state.basemap} onChange={this.onBMChange}/>


                <GeojsonLayer lat={center[0]} lng={center[1]} maxDist={5000} cluster={true}/>

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
}

export default MapComponent;
