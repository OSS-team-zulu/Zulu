import React, {Component} from "react";
import L from 'leaflet';
import {Map, Marker, Popup, TileLayer} from "react-leaflet";
import Basemap from './Basemaps';
import GeojsonLayer from './GeojsonLayerFunc';
import './Map.css';
import {Container} from "react-floating-action-button";
import {Fab} from '@material-ui/core';
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
      showPostFrom: false,
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
      (error) => {
      },
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

  showPostForm = () => {
    this.setState({showPostForm: true})
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

              <Fab
                color="primary"
                aria-label="edit"
                tooltip="Add a new story!"
                onClick={this.showPostForm()}>
                <FaPlus/>
              </Fab>
            </Container>
          </div>
          {this.showPostForm && <PostForm/>}

          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url={basemapsDict[this.state.basemap]}
          />
          <Basemap basemap={this.state.basemap} onChange={this.onBMChange}/>


          <GeojsonLayer url={closePointsURL} cluster={true}/>


          };


          <Marker position={center}>
            <Popup>
              <div>Your Location - latitude: {Number(this.state.lat).toFixed(4)} -
                longitude: {Number(this.state.lng).toFixed(4)}</div>
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

class PostForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = props.state;

    this.story = {
      storyTitle: "",
      storyBody: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
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
    var submitURL = "http://localhost:8342/api/point?longitude=" + this.state.lng + "&latitude=" + this.state.lat + "&max_distance=5000";
    var fileName = this.fileInput?.current?.files[0]?.name;
    var hasFile = (typeof fileName !== 'undefined');

    alert('A story was submitted:\ntitle:\n' + this.story.storyTitle + '\nbody\n' + this.story.storyBody + '\n\nlat: ' + this.state.lat + '\nlong:' + this.state.lng);
    if (hasFile) {
      alert(`Selected file - ${fileName}`);
    }
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <Popup position={[this.state.lat, this.state.lng]}>
        <form onSubmit={this.handleSubmit}>
          <h3> Add your Story. </h3>
          <label>
            <br/>
            Title:
            <br/>
            <input name="storyTitle" type="text" defaultValue={this.story.storyTitle} onChange={this.handleChange}/>
            <br/>
          </label>
          <label>
            <br/>
            Body:<br/>
            <textarea name="storyBody" defaultValue={this.story.storyBody} onChange={this.handleChange}/>
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
      </Popup>
    )
  }

}


export default MapComponent;
