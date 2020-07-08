import axios from 'axios';
import authHeader from './auth-header';

const API_URL = "http://localhost:8342/api";

class StoryService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }
  getUserStories(longitude, latitude, max_distance) {
    return axios.get(API_URL + '/story/point', {
      params: {
        longitude: longitude,
        latitude: latitude,
        max_distance: max_distance
      },
      headers: authHeader()
    })
  }

  postUserStory(longitude, latitude, title, content, image_id) {
    return axios.post(API_URL + '/story/point',
      {
        longitude: longitude,
        latitude: latitude,
        story: {
          content: content,
          title: title,
          image_id: image_id
        }
      },
      { headers: authHeader() }
    )
  }

  PostUserComment(story_id, comment_content, is_wiki) {
    axios.post(API_URL + '/story/comment', {

      story_id: story_id,
      content: comment_content,
      is_wiki: is_wiki,
    },
      { headers: authHeader() }
    ).then(response => (console.log(response)));
  }
  GetStoryComments(story_id) {
    return axios.get(API_URL + '/story/comment', {
      params: {
        id: story_id
      },
      headers: authHeader()
    });
  }

  async postImage(formData) {
    return axios.post(API_URL + '/story/image', formData,
      {
        headers: { ...authHeader(), ...{ 'Content-Type': 'multipart/form-data' } }
      }
    )
  }

}

export default new StoryService();
