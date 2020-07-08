import React, {useState, useEffect} from 'react';
import {Marker, FeatureGroup, Popup} from 'react-leaflet';
import MarkerClusterGroup from "react-leaflet-markercluster";
import Card from '../Card/Card'
import { iconWiki } from '../../Icons/Icon.Wiki';
import "./GeoWiki.css";


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

                        <Popup minWidth={300}  closeButton={true} closeOnClick={false} autoClose={false}>

                            <Card background='#2980B9' height="200"  >
                            <div  style={{marginLeft:"auto" ,marginRight:"auto", height: "200px", overflowY: "scroll"} }>
                            <a href={"https://en.wikipedia.org/?curid="+f.pageid} style={{color:"black",textDecoration:"none"}}>
                            
                            <h3>{f.title}</h3>
                            </a>
                            { f.hasOwnProperty('thumbnail') ? 
                                <img display="inline-block" src={parseImagePath(f.thumbnail.source)} style={{maxHeight: "200px", maxWidth: "200px"}}></img>
                                 :
                                <p ></p> 
                            }

<p id="desc" style={{float:"left",dir:"rtl",color: "black",fontWeight: "bold" ,lineHeight: "18px"}}>

{f.extract}
</p>
</div>

                            </Card>

                    </Popup>    


                </Marker>

            ))}
        </GroupComponent>
    );
}
