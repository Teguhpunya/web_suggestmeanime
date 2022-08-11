import fetch from "node-fetch";
import * as fs from "fs";

const query =
  `{
    Page(page: 1, perPage: 50) {
      recommendations(sort: RATING_DESC, onList: true) {
        rating
        mediaRecommendation {
          id
          idMal
          episodes
          popularity
          meanScore
          title {
            english
            romaji
          }
          type
          bannerImage
          coverImage {
            large
          }
          startDate {
            year
            month
            day
          }
          endDate {
            year
            month
            day
          }
          description
        }
      }
    }
  }`;

const url = 'https://graphql.anilist.co';
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    query: query,
    // variables: variables
  })
};

let result;
// Make the HTTP Api request
fetch(url, options).then(handleResponse)
  .then(handleData)
  .catch(handleError);

function handleResponse(response) {
  return response.json().then(function (json) {
    return response.ok ? json : Promise.reject(json);
  });
}

function handleData(data) {
  const filename = "lists.json";
  result = data.data.Page.recommendations;
  fs.writeFileSync(filename, JSON.stringify(result));
  // console.log(data.data.Page.recommendations);
}

function handleError(error) {
  // alert('Error, check console');
  console.error(error);
}
