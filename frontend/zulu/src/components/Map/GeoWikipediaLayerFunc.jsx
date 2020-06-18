import React, {render, useState, useEffect} from 'react';
import {Marker, FeatureGroup, Popup} from 'react-leaflet';
import MarkerClusterGroup from "react-leaflet-markercluster";
import Card from '../Card/Card'
import { iconWiki } from '../../Icons/Icon.Wiki';


var fetchData = function fetchData(lat, lng, maxDist, options) {
    const url = "https://en.wikipedia.org/w/api.php?action=query&generator=geosearch&prop=coordinates%7C" +
    "pageimages%7Cextracts&exintro=&ggscoord=" + lat + "%7C" + lng + "&ggsradius=" + maxDist + "&format=json"
    var request = fetch(url, options).then(r => r.json());
    
    return request.then(r => Object.values(r.query.pages));    
}


function parseImagePath(thumbnailPath) {
    const lastSlashIndex = thumbnailPath.lastIndexOf("/");
    var path = thumbnailPath.slice(0, lastSlashIndex);
    path = path.replace("thumb/", "");
    return path
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
                    <Popup minWidth={400} closeButton={true} closeOnClick={false} autoClose={false}>
                        {
                        <Card background='#2980B9' height="400">
                            <h1>{f.title}</h1>
                            { f.hasOwnProperty('thumbnail') ? 
                                <img src={parseImagePath(f.thumbnail.source)} style={{maxHeight: "430px", maxWidth: "430px"}}></img>
                                 :
                                <p></p> 
                            }
                            <div dangerouslySetInnerHTML={{__html: f.extract}} />

                        </Card>
                        }
                    </Popup>


                </Marker>

            ))}
        </GroupComponent>
    );
}