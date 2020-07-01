import React, {useState, useEffect} from 'react';
import {Marker, FeatureGroup, Popup} from 'react-leaflet';
import MarkerClusterGroup from "react-leaflet-markercluster";
import Card from '../Card/Card'

var fetchData = function fetchData(lat, lng, maxDist, options) {
    var closePointsURL = "http://localhost:8342/api/point?longitude=" + lng + "&latitude=" + lat + "&max_distance=" + maxDist;
    let request = fetch(closePointsURL, options);
    return request
        .then(r => r.json());
}


function parseImagePath(imageId) {
    return "http://localhost:8342/api/image?id=" + imageId;
}


export default function GeojsonLayer({lat, lng, maxDist, cluster}) {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (lat && lng && maxDist) {
            const abortController = new AbortController();

                fetchData(lat, lng, maxDist, {signal: abortController.signal}).then(data => {
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
                    position={f.geometry.coordinates.reverse()}
                >
                    <Popup minWidth={400} closeButton={true} closeOnClick={false} autoClose={false}>

                        <Card background='#2980B9' height="400">
                            <h1>{f.story.title}</h1>
                            { f.story.hasOwnProperty('image_id') && f.story.image_id != null ?
                                <img src={parseImagePath(f.story.image_id)} style={{maxHeight: "430px", maxWidth: "430px"}}></img>
                                :
                                <p></p>
                            }
                            <p style={{'font-size': "16px"}}>{f.story.content}
                            </p>

                        </Card>

                    </Popup>


                </Marker>

            ))}
        </GroupComponent>
    );
}