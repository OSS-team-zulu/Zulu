import React, {useState, useEffect} from 'react';
import {Marker, FeatureGroup, Popup} from 'react-leaflet';
import MarkerClusterGroup from "react-leaflet-markercluster";
import Card from '../Card/Card'
import StoryService from '../../services/story.service'



function parseImagePath(imageId) {
    // TODO: use the StoryService 
    return "http://localhost:8342/api/story/image?id=" + imageId;
}


export default function GeojsonLayer({lat, lng, maxDist, cluster}) {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (lat && lng && maxDist) {
            const abortController = new AbortController();

            StoryService.getUserStories(lng, lat, maxDist).then(response => setData(response.data));

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
                            <h2>Added by {f.user_id} </h2>
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
