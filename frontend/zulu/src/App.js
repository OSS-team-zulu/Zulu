import React, {Component} from 'react';
import logo from './geo_icon.png';
import './App.css';
import MapComponent from "./components/Map/MapGeojsonMarkers.jsx";
import {Buttons, PostModal} from "./components/Map/MapGeojsonMarkers";

import {
    BrowserRouter ,
    Switch,
    Route,
    Link,Redirect
} from "react-router-dom";


import Login from "./components/LoginForm/Login"
class App extends Component {
/*    render() {
        return (
            <div className="App">
                <CornerLogo></CornerLogo>
                <Login></Login>
            </div>
        );
    }
}*/




    state = {
        loggedIn: false,
    };
    render() {
        return (
            <BrowserRouter>
                <div>
                    <CornerLogo/>
                    <Link to='map'>map</Link><br/>
                    <Switch>
                        <ProtectedRoute exact path='/map' user={""} handleLogout={""} component={MapComponent} />
                        <Route path="/">
                              <Login/>
                        </Route>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }

}


class MapWidow extends Component {
    render() {
        return(
            <div className="">
                <MapComponent/>
            </div>
        )
    }
}
class CornerLogo extends Component {
    render() {
        return(
            <div className="leaflet-top  leaflet-left">
                <div className="App-header" >
                    <h2>Zulu App</h2>
                    <img src={logo} className="App-logo" alt="logo"  />
                </div>
            </div>
        )
    }
}


const ProtectedRoute = ({ component: Component, user, ...rest }) => {
    return (
        <Route {...rest} render={
            props => {
                if (false) {
                    return <Component {...rest} {...props} />
                } else {
                    return <Redirect to={
                        {
                            pathname: '/',
                            state: {
                                from: props.location
                            }
                        }
                    } />
                }
            }
        } />
    )
}

export default App;
