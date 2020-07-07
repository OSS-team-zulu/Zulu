import React, {useEffect, useState} from 'react';
import {FeatureGroup, Marker, Popup} from 'react-leaflet';
import MarkerClusterGroup from "react-leaflet-markercluster";
import {iconWiki} from '../../Icons/Icon.Wiki';
import "./GeoWiki.css";
import {CardComponent} from "../CardComponent/CardComponent";


var fetchData = function fetchData(lat, lng, maxDist, options) {
    const url = "https://en.wikipedia.org/w/api.php?action=query&generator=geosearch&prop=coordinates%7C" +
    "pageimages%7Cextracts&exintro=&explaintext=true&ggscoord=" + lat + "%7C" + lng + "&ggsradius=" + maxDist + "&format=json"
    var request = fetch(url, options).then(r => r.json());
    return request.then(r =>  {

        if (r.hasOwnProperty("query")){
            return Object.values(r.query.pages);
        }
        else{
            return [];
        }
        });    
}

function get_comments(){
    return ["thats amazing!","unbelivable!"]
}



export default function GeoWikipediaLayer({lat, lng, maxDist, cluster}) {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (lat && lng && maxDist) {
            const abortController = new AbortController();

                fetchData(lat,lng, maxDist, {signal: abortController.signal}).then(data => {
                setData(data);
            });

            // cancel fetch on component unmount
            return () => {
                abortController.abort();
            };
        }

    }, [lat, lng, maxDist]);

    var GroupComponent = cluster ? MarkerClusterGroup : FeatureGroup;
    
    return (
        <GroupComponent>

            {data.map(f => (
                <Marker
                    key={JSON.stringify(f)}
                    position={[f.coordinates[0].lat, f.coordinates[0].lon]}
                    icon={iconWiki}
                >

                    <Popup minWidth={300} closeButton={true} closeOnClick={false} autoClose={false}>

                        <CardComponent f={f}/>

                    </Popup>


                </Marker>

            ))}
        </GroupComponent>
    );
}
