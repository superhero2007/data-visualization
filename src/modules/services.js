'use strict';

import * as http from 'superagent'
import * as d3 from 'd3';

// local data
require('../data/us.json');
require('../data/usa.json');
require('../data/us-states.json');

require('../data/categories.json');
require('../data/manufacturers.json');
require('../data/redemption-data.json');
require('../data/pie-chart.json');
require('../data/bipartite-example.json');

require('../data/unemployment.tsv');
require('../data/stateslived.tsv');
require('../data/pie-example.tsv');
require('../data/bar-example.tsv');

var services = {
  loadCategories: function() {
    return new Promise((resolve, reject) => {
      http
        .get('/static/api/categories.json')
        .end(function (error, response) {

          if (response.status == 200) {
            var categories = JSON.parse(response.text);
            //nch.model.categories = categories['_items']
            resolve(categories['_items']);
          }
          else if (response.status == 401) {
            console.log("user not authorized");
          }
        });
    });
  },

  loadManufacturers: function() {
    http
      .get('/static/api/manufacturers.json')
      .end(function (error, response) {

        if (response.status == 200) {
          var manufacturers = JSON.parse(response.text);
          nch.model.manufacturers = manufacturers['_items']
        }
        else if (response.status == 401) {
          console.log("user not authorized");
        }
      });
  },

  getRedemptionsByState: function () {

    return new Promise((resolve, reject) => {
      http
        .get('/static/api/redemption-data.json')
        .end(function (error, response) {

          if (response.status == 200) {

            var min = 10000;
            var max = -1;
            var stateMap = {};
            var stateData = { min: 0, max: 0, states: stateMap };
            var redemptionData = JSON.parse(response.text);
            var items = redemptionData['_items'];

            for( var i = 0; i < items.length; i++ ) {
              var item = items[i];
              var currentState = null;

              var stateName = nch.utils.getStateName(item['storestate']);

              if( stateName == null ) {
                continue;
              }

              if( stateMap[ item['storestate'] ] ) {
                currentState = stateMap[ item['storestate'] ]
              }
              else {
                currentState = { name: item['storestate'], redempations: 0 }
                stateMap[ item['storestate'] ] = currentState
              }

              currentState.redempations += item['totalcouponredemption']

              if( currentState.redempations < min ) {
                min = currentState.redempations
              }

              if( currentState.redempations > max ) {
                max = currentState.redempations
              }
            }

            var states = Object.keys( stateMap );
            console.log( "State count: " + states.length )
            console.log( 'Min: ' + min + ", max: " + max );
            stateData.min = min;
            stateData.max = max;
            resolve(stateData);
          }
          else if (response.status == 401) {
            console.log("user not authorized");
            reject("user not authorized")
          }
        });
    });

  },

  getRedemptionsByMedia: function () {

    return new Promise((resolve, reject) => {
      http
        .get('/static/api/pie-chart.json')
        .end(function (error, response) {

          if (response.status == 200) {

            var min = 10000000;
            var max = -1;
            var mediaMap = {};
            var responseData = { min: 0, max: 0, mediaData: mediaMap };
            var redemptionData = JSON.parse(response.text);
            var items = redemptionData['_items'];

            for( var i = 0; i < items.length; i++ ) {
              var item = items[i];
              var currentData = null;

              if( mediaMap[ item['medianame'] ] ) {
                currentData = mediaMap[ item['medianame'] ]
              }
              else {
                currentData = { name: item['medianame'], redempations: 0, redempationValue: 0 }
                mediaMap[ item['medianame'] ] = currentData
              }

              currentData.redempations += item['totalcouponredemption']
              currentData.redempationValue += item['totalcouponredemeedvalue']

              if( currentData.redempations < min ) {
                min = currentData.redempations
              }

              if( currentData.redempations > max ) {
                max = currentData.redempations
              }
            }

            var mediaTypes = Object.keys( mediaMap );
            console.log( "Media count: " + mediaTypes.length )
            console.log( 'Min: ' + min + ", max: " + max );
            responseData.min = min;
            responseData.max = max;
            resolve(responseData);
          }
          else if (response.status == 401) {
            console.log("user not authorized");
            reject("user not authorized")
          }
        });
    });

  },

  getBipartiteData: function() {
    return new Promise((resolve, reject) => {
      http
        .get('/static/api/redemption-data.json')
        .end(function (error, response) {

          if (response.status == 200) {

            var returnvalue=[];
            var redemptionData = JSON.parse(response.text);
            var items = redemptionData['_items'];

            for( var i = 0; i < items.length; i++ ) {
              var item = [items[i].medianame, items[i].storestate, items[i].totalcouponredemption, parseFloat(items[i].totalcouponredemeedvalue)];
              returnvalue.push(item);
            }
            console.log("data", returnvalue);

            resolve(returnvalue);
          }
          else if (response.status == 401) {
            console.log("user not authorized");
            reject("user not authorized")
          }
        });
    });
  },

  getRedemptionsByMediaType: function (categories) {

    return new Promise((resolve, reject) => {
      http
        .get('/static/api/pie-chart.json')
        .end(function (error, response) {

          if (response.status == 200) {
            const redemptionData = JSON.parse(response.text);
            const items = redemptionData['_items'];

            let mediaType = {
              categories: [],
              mediaNames: [],
              data: {}
            };

            // Get the all categoryNames and mediaNames
            items.forEach(function(item){
              //Get the all categoryNames
              const indCategory = mediaType.categories.indexOf(item.categoryname);
              if(indCategory !== -1) mediaType.categories.splice(indCategory, 0);
              else{
                mediaType.categories.push(item.categoryname);
                mediaType.data[item.categoryname] = {};
              }

              //Get the all media name
              const indMedia = mediaType.mediaNames.indexOf(item.medianame);
              if(indMedia !== -1) mediaType.mediaNames.splice(indMedia, 0);
              else mediaType.mediaNames.push(item.medianame);
            })

            // init the mediaType's data
            mediaType.categories.forEach(function(category){
              mediaType.data[category]['categoryName'] = category;
              mediaType.mediaNames.forEach(function(medianame){
                mediaType.data[category][medianame] = 0;
              })
            })

            items.forEach(function(item){
              mediaType.data[item.categoryname][item.medianame] += item.totalcouponredemeedvalue;
            })

            resolve(mediaType);
          }
          else if (response.status == 401) {
            console.log("user not authorized");
            reject("user not authorized")
          }
        });
    });
  },

  // Alphabetically function
  alphabetical: function (a, b) {
    var A = a.toLowerCase();
    var B = b.toLowerCase();
    if (A < B){
      return -1;
    }else if (A > B){
      return  1;
    }else{
      return 0;
    }
  }
};

module.exports = services;
