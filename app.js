/**
 *This is a sollution to the LittleData coding challenge.
 *It will have comments that will explain the logic.
 */

/**
 * I used a simple module to send requests called request.js
 */
var request = require('request');
/**
 * I saved the website addresses in a separate js file.
 */
var websites = require('./websites');

/**
 * The API I choose to use for this project.
 * @type {string}
 */
const API_SERVICE_URL = "https://api.aylien.com/api/v1/classify/iab-qag";
var websitesArray = websites.websitesArray;
/**
 * Iterate through the addresses array to start sending the requests.
 */
for(var index in websitesArray) {
  getInformation(websitesArray[index]);
  console.log('sending request number: ' + index + ' for: ', websitesArray[index]);
}
/**
 *Sends the requests to the API resource.
 * options is the object that describes the request:
 *  - two custom headers are required the app-ID and the app-Key
 *  - the website we are interested in is passed as a query param to the API resource url
 *  - json: true sets the mime type to application/json
 *@method request - takes in a callback function that is executed after the response is received
 *                - I check to see if there any errors and display the error in console
 *                - if there are no errors and the status code is 200 OK then I proceed to the next methods
 *@method sort - Even though the categories array is already sorted by score, I wanted to sort it
 *               just in case they would came unordered
 *             - I gave the Array.sort method a custom sorting method described at the bottom
 * @param websiteUrl - url of the website we are interested in
 */
function getInformation(websiteUrl) {
  var orderedCategories = [];
  var options = {
    url: API_SERVICE_URL + "?url=" + websiteUrl,
    headers: {
      "X-AYLIEN-TextAPI-Application-ID": "3259bf68",
      "X-AYLIEN-TextAPI-Application-Key": "9d0ed44eae4e237cc9a1bafd5e59ce71"
    },
    json: true
  };
  request(options, function (error, response, body) {
    if(error) {
      console.log("error encountered:", error);
    }
    if (error === null && response.statusCode == 200)
      orderedCategories = body.categories.sort(compareByScore);
      resultedObject = findCategory(orderedCategories, websiteUrl);
      console.log(resultedObject);
  })
}

/**
 *Iterates through the categories array, starting from the one with the highest score.
 * If the links array from a category object has 2 elements, then It is a subcategory - explanation:
 * the subcategory links array contains a link to self and a link to parent.
 *If the highest score object is a subcategory and if the subcategoryLabel doesn't hold a value yet,
 * I assight the object.label value to the subcategoryLabel variable.
 *If the highest score object is a category then the links array contains only 1 object, a link to self;
 * I assign the object.label to the categoryLabel variable if it is not already set.
 *On the next iteration of the for loop it will find the next category/subcategory with the next highest score
 * and assign it to the proper variable.
 * If both variables are holding values then the for loop breaks and the method returns an object.
 *
 * @param categories - the array from the body of the response, sorted by score.
 * @param websiteAddress - the address of the current website
 * @returns {{category: string, subcategory: string, website: string}} - returns an object
 *          containing the found category, subcategory and website
 */
function findCategory(categories, websiteAddress) {
  var subcategoryLabel = '';
  var categoryLabel = '';
  for(var index in categories) {
    var highestScoreCategory = categories[index];
    if (highestScoreCategory.links.length > 1 && subcategoryLabel == '') {
      //we have a subcategory
      subcategoryLabel = highestScoreCategory.label;
    }
    if (highestScoreCategory.links.length == 1 && categoryLabel == '') {
      //we have a category
      categoryLabel = highestScoreCategory.label;
    }
    if(subcategoryLabel == '' && categoryLabel == ''){
      break;
    }
  }
  return {
    "category": categoryLabel,
    "subcategory": subcategoryLabel,
    "website": websiteAddress
  }
}

/**
 *Method to custom sort the an array by it's property field value named score.
 * @param a - current item
 * @param b - next item
 * @returns {number} - if number is positive then a will be moved a lower index;
 *                     if number is negative then a will be moved a higher index;
 *                     if a = b then it will remain at the same index;
 */
function compareByScore(a, b) {
  if (a.score < b.score) {
    return 1;
  }
  if (a.score > b.score) {
    return -1;
  }
  return 0;
}









