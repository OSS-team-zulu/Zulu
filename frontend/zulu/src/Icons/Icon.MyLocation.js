import L from 'leaflet';

const MyLocationIcon = new L.Icon({
    iconUrl: require("./MyLocationIcon.png"),
    iconRetinaUrl: require("./MyLocationIcon.png"),
    iconAnchor:  [12, 13],
	//popupAnchor: [1, -34],
	//tooltipAnchor: [16, -28],
    shadowSize:  [0, 0],
    iconSize: new L.Point(25, 25),
    className: 'leaflet-icon'
});

export { MyLocationIcon };