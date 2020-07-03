import L from 'leaflet';

const iconWiki = new L.Icon({
    iconUrl: require("./Tango_style_Wikipedia_Icon.svg"),
    iconRetinaUrl: require("./Tango_style_Wikipedia_Icon.svg"),
    iconAnchor:  [12, 41],
	popupAnchor: [1, -34],
	tooltipAnchor: [16, -28],
	shadowSize:  [41, 41],
    iconSize: new L.Point(30, 30),
    className: 'leaflet-icon'
});

export { iconWiki };