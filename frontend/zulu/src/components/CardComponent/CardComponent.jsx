import React from "react";
import Card from "../Card/Card";
import * as PropTypes from "prop-types";

export class CardComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }

    get_comments(){
        return ["thats amazing!","unbelivable!"]
    }

     parseImagePath(thumbnailPath) {
        const lastSlashIndex = thumbnailPath.lastIndexOf("/");
        var path = thumbnailPath.slice(0, lastSlashIndex);
        path = path.replace("thumb/", "");
        return path
    }
    render() {
        return <Card background='#2980B9' height="200">
            <div style={{marginLeft: "auto", marginRight: "auto", height: "200px", overflowY: "scroll"}}>
                <a href={"https://en.wikipedia.org/?curid=" + this.props.f.pageid}
                   style={{color: "black", textDecoration: "none"}}>
                    <h3>{this.props.f.title}</h3>
                </a>
                {this.props.f.hasOwnProperty("thumbnail") ?
                    <img display="inline-block" src={this.parseImagePath(this.props.f.thumbnail.source)}
                         style={{maxHeight: "200px", maxWidth: "200px"}}></img>
                    :
                    <p></p>
                }

                <p id="desc"
                   style={{float: "left", dir: "rtl", color: "black", fontWeight: "bold", lineHeight: "18px"}}>

                    {this.props.f.extract}
                </p>
                <p><strong>comments:</strong></p>
                {this.get_comments().map(comment=>(<p>{comment}</p>))}
                <form onSubmit={this.handleSubmit}>
                    <label>
                        comment:
                        <input type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>

        </Card>;
    }
}

CardComponent.propTypes = {f: PropTypes.any};