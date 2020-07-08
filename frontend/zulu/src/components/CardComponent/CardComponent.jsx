import React from "react";
import Card from "../Card/Card";
import * as PropTypes from "prop-types";
import axios from "axios";
import StoryService from '../../services/story.service'
import storyService from "../../services/story.service";
const API_URL = "http://localhost:8342/api";

export class CommentComponent extends React.Component {
    constructor(props) {
        super(props);}
    render() {
        return (<div>
            <p><strong>comments:</strong></p>
            {this.props.comments.map(comment => (<p style={{
                backgroundColor: "#3BD8FF",
                marginLeft: "auto",
                marginRight: "auto"
            }}>{comment.user_name} : {comment.comment}</p>))}
        </div>)
    }
}

export class CardComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: '',comments:[]};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
       storyService.GetStoryComments(this.props.f.pageid).then(response => this.setState({comments:response.data}));

    
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    async handleSubmit(event) {
        storyService.PostUserComment(this.props.f.pageid,this.state.value,true);
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
                <div>

                    <CommentComponent comments={this.state.comments}/>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            comment:
                            <input type="text" value={this.state.value} onChange={this.handleChange}/>
                        </label>
                        <input type="submit" value="Submit"/>
                    </form>
                </div>
            </div>


        </Card>;
    }
}

CardComponent.propTypes = {f: PropTypes.any};