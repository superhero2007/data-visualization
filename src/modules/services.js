'use strict';

import * as http from 'superagent'

// local data
require('../data/us.json');
require('../data/usa.json');
require('../data/us-states.json');
require('../data/stateslived.tsv');
require('../data/categories.json');
require('../data/manufacturers.json');
require('../data/redemption-data.json');
require('../data/unemployment.tsv');

var services = {
  getStateMap: function ( filters, callback ) {
    http
      .get('/some-end point')
      .query({ filter1: 'dim1', filter2: 'dim2' }) // query string
      .end(function( err, res ) {
        var data = {"data":123};
        callback( data );
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

  getBipartiteData: function() {
    return [['Lite','CA',16,0],
      ['Small','CA',1278,4],
      ['Medium','CA',27,0],
      ['Plus','CA',58,0],
      ['Grand','CA',1551,15],
      ['Elite','CA',141,0],
      ['Lite','AZ',5453,35],
      ['Small','AZ',683,1],
      ['Medium','AZ',862,0],
      ['Grand','AZ',6228,30],
      ['Lite','AL',15001,449],
      ['Small','AL',527,3],
      ['Medium','AL',836,0],
      ['Plus','AL',28648,1419],
      ['Grand','AL',3,0],
      ['Lite','CO',13,0],
      ['Small','CO',396,0],
      ['Medium','CO',362,0],
      ['Plus','CO',78,10],
      ['Grand','CO',2473,32],
      ['Elite','CO',2063,64],
      ['Medium','DE',203,0],
      ['Grand','DE',686,2],
      ['Elite','DE',826,0],
      ['Lite','KS',1738,110],
      ['Small','KS',12925,13],
      ['Medium','KS',15413,0],
      ['Small','GA',2166,2],
      ['Medium','GA',86,0],
      ['Plus','GA',348,3],
      ['Grand','GA',4244,18],
      ['Elite','GA',1536,1],
      ['Small','IA',351,0],
      ['Grand','IA',405,1],
      ['Small','IL',914,1],
      ['Medium','IL',127,0],
      ['Grand','IL',1470,7],
      ['Elite','IL',516,1],
      ['Lite','IN',43,0],
      ['Small','IN',667,1],
      ['Medium','IN',172,0],
      ['Plus','IN',149,1],
      ['Grand','IN',1380,5],
      ['Elite','IN',791,23],
      ['Small','FL',1,0],
      ['Grand','FL',1,0],
      ['Small','MD',1070,1],
      ['Grand','MD',1171,2],
      ['Elite','MD',33,0],
      ['Plus','TX',1,0],
      ['Small','MS',407,0],
      ['Medium','MS',3,0],
      ['Grand','MS',457,2],
      ['Elite','MS',20,0],
      ['Small','NC',557,0],
      ['Medium','NC',167,0],
      ['Plus','NC',95,1],
      ['Grand','NC',1090,5],
      ['Elite','NC',676,6],
      ['Lite','NM',1195,99],
      ['Small','NM',350,3],
      ['Medium','NM',212,0],
      ['Grand','NM',1509,8],
      ['Lite','NV',3899,389],
      ['Small','NV',147,0],
      ['Medium','NV',455,0],
      ['Plus','NV',1,1],
      ['Grand','NV',4100,16],
      ['Lite','OH',12,0],
      ['Small','OH',634,2],
      ['Medium','OH',749,0],
      ['Plus','OH',119,1],
      ['Grand','OH',3705,19],
      ['Elite','OH',3456,25],
      ['Small','PA',828,2],
      ['Medium','PA',288,0],
      ['Plus','PA',141,0],
      ['Grand','PA',2625,7],
      ['Elite','PA',1920,10],
      ['Small','SC',1146,2],
      ['Medium','SC',212,0],
      ['Plus','SC',223,4],
      ['Grand','SC',1803,6],
      ['Elite','SC',761,8],
      ['Small','TN',527,0],
      ['Medium','TN',90,0],
      ['Grand','TN',930,4],
      ['Elite','TN',395,1],
      ['Lite','ME',7232,58],
      ['Small','ME',1272,0],
      ['Medium','ME',1896,0],
      ['Plus','ME',1,0],
      ['Grand','ME',10782,33],
      ['Elite','ME',1911,3],
      ['Small','VA',495,0],
      ['Medium','VA',32,0],
      ['Plus','VA',7,0],
      ['Grand','VA',1557,12],
      ['Elite','VA',24,0],
      ['Small','WA',460,1],
      ['Plus','WA',88,3],
      ['Grand','WA',956,3],
      ['Small','WV',232,0],
      ['Medium','WV',71,0],
      ['Grand','WV',575,2],
      ['Elite','WV',368,3]
    ];
  }
};

module.exports = services;
