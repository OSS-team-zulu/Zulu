import React, {useState, useEffect} from 'react';
import {Marker, FeatureGroup, Popup} from 'react-leaflet';
import MarkerClusterGroup from "react-leaflet-markercluster";
import Card from '../Card/Card'

var fetchData = function fetchData(url, options) {
    let request = fetch(url, options);
    return request
        .then(r => r.json());

}

export default function GeojsonLayer({url, cluster}) {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (url) {
            const abortController = new AbortController();

                fetchData(url, {signal: abortController.signal}).then(data => {
                setData(data);
            });

            // cancel fetch on component unmount
            return () => {
                abortController.abort();
            };
        }

    }, [url]);

    var GroupComponent = cluster ? MarkerClusterGroup : FeatureGroup;

    return (
        <GroupComponent>

            {data.map(f => (
                <Marker
                    key={JSON.stringify(f)}
                    position={f.geometry.coordinates.reverse()}
                >
                    <Popup minWidth={400} closeButton={true} closeOnClick={false} autoClose={false}>
                        {/*
                <div style={{backgroundColor:"white", color:"black"}}>
                  <b>Stories in this spot:</b>
                  <p> {f.story.title}</p>
                </div>
*/}

                        <Card background='#2980B9' height="400">
                            {/* <img src={f.properties.img_url} width="200" height="100 "></img> */}
                            <h1>{f.story.title}</h1>
                            <p style={{'font-size': "16px"}}>{f.story.content}
                            </p>

                        </Card>

                    </Popup>


                </Marker>

            ))}
        </GroupComponent>
    );
}