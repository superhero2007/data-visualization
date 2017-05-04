'use strict'

import * as http from 'superagent'
import * as d3 from 'd3'

// local data
require('../data/us-states.json')
require('../data/categories.json')
require('../data/manufacturers.json')
require('../data/redemption-data.json')
require('../data/pie-chart.json')
require('../data/stacked-bar-chart.json')
require('../data/stacked-bar-example.tsv')

var services = {
  loadCategories: function() {
    return new Promise((resolve, reject) => {
      http
        .get('/static/api/categories.json')
        .end(function (error, response) {

          if (response.status == 200) {
            var categories = JSON.parse(response.text)
            //nch.model.categories = categories['_items']
            resolve(categories['_items'])
          }
          else if (response.status == 401) {
            console.log('user not authorized')
          }
        })
    })
  },

  loadManufacturers: function() {
    http
      .get('/static/api/manufacturers.json')
      .end(function (error, response) {

        if (response.status == 200) {
          var manufacturers = JSON.parse(response.text)
          nch.model.manufacturers = manufacturers['_items']
        }
        else if (response.status == 401) {
          console.log('user not authorized')
        }
      })
  },

  loadCombinedData: function() {
    http
      .get('/static/api/pie-chart.json')
      .end(function (error, response) {
        if (response.status == 200) {
          let items = JSON.parse(response.text)['_items']

          nch.model.combinedData = d3.values((d3.nest()
              .key(function(d) { return d.categoryname; })
              .key(function(d) { return d.medianame; })
              .rollup(function(v) {return d3.mean(v, function(d) {return d.totalcouponredemption; }); })
              .entries(items.filter(function(d) {return d.mfrname == nch.model.currentManufacturer }))
          ).sort(function(a,b) {
            if (a.key < b.key) return -1;
            if (a.key > b.key) return 1;
            return 0;
          })).map(function(d) {
            let object = {};
            object.category = d.key
            object.values = {};
            d.values.map(function(v) {
              object.values[v.key] = d3.format("(.2f")(v.value);
            });
            return object;
          });

          nch.model.allMedaiNames = d3.values((d3.nest()
            .key(function(d) { return d.medianame; })
            .entries(items))).map(function (d) {
            return d.key
          })
        }
        else if (response.status == 401) {
          console.log('user not authorized')
        }
      })
  },

  getRedemptionsByState: function () {

    return new Promise((resolve, reject) => {
      http
        .get('/static/api/redemption-data.json')
        .end(function (error, response) {

          if (response.status == 200) {

            var min = 10000
            var max = -1
            var stateMap = {}
            var stateData = { min: 0, max: 0, states: stateMap }
            var redemptionData = JSON.parse(response.text)
            var items = redemptionData['_items']

            for( var i = 0 ; i < items.length ; i++ ) {
              var item = items[i]
              var currentState = null

              var stateName = nch.utils.getStateName(item['storestate'])

              if( stateName == null ) {
                continue
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

            var states = Object.keys( stateMap )
            console.log( 'State count: ' + states.length )
            console.log( 'Min: ' + min + ', max: ' + max )
            stateData.min = min
            stateData.max = max
            resolve(stateData)
          }
          else if (response.status == 401) {
            console.log('user not authorized')
            reject('user not authorized')
          }
        })
    })

  },

  getRedemptionsByMedia: function () {

    return new Promise((resolve, reject) => {
      http
        .get('/static/api/pie-chart.json')
        .end(function (error, response) {

          if (response.status == 200) {
            var redemptionData = JSON.parse(response.text)
            var items = redemptionData['_items']
            resolve(items)
          }
          else if (response.status == 401) {
            console.log('user not authorized')
            reject('user not authorized')
          }
        })
    })
  },

  getBipartiteData: function() {
    return new Promise((resolve, reject) => {
      http
        .get('/static/api/redemption-data.json')
        .end(function (error, response) {

          if (response.status == 200) {

            var returnvsdfalue=[]
            var redemptionData = JSON.parse(response.text)
            var items = redemptionData['_items']

            for( var i = 0 ; i < items.length ; i++ ) {
              var item = [items[i].medianame, items[i].storestate, items[i].totalcouponredemption, parseFloat(items[i].totalcouponredemeedvalue)]
              returnvalue.push(item)
            }

            resolve(returnvalue)
          }
          else if (response.status == 401) {
            console.log('user not authorized')
            reject('user not authorized')
          }
        })
    })
  },

  getTableData: function (filters) {
    return new Promise((resolve, reject) => {
      http
        .get('/static/api/pie-chart.json')
        .end(function (error, response) {
          if (response.status == 200) {
            let items = JSON.parse(response.text)['_items']
            let data = []
            filters.forEach(function (filter) {
              let temp = {}
              temp.category = filter
              let value = nch.model.combinedData.filter(function(d) { return d.category == filter })
              if(value[0]){
                temp.manufacturer = value[0].values
              }else{
                temp.manufacturer = null
              }

              temp.comparables = {};
              d3.values((d3.nest()
                .key(function(d) { return d.medianame; })
                .rollup(function(v) { return d3.mean(v, function(d) { return d.totalcouponredemption; }); })
                .entries(items.filter(function(d) { return d.categoryname != filter })))
              ).map(function(v) {
                temp.comparables[v.key] = d3.format("(.2f")(v.value)
              });

              data.push(temp);
            })

            resolve(data);
          }
          else if (response.status == 401) {
            console.log('user not authorized')
            reject('user not authorized')
          }
        })
    })
  },

  getPieData: function() {

    return new Promise((resolve, reject) => {
      http
        .get('/static/api/pie-chart.json')
        .end(function (error, response) {

          if (response.status == 200) {

            var redemptionData = JSON.parse(response.text)
            var items = redemptionData['_items']
            resolve(items)

            // var responseData = []
            //
            // for( var i = 0 ; i < items.length ; i++ ) {
            //
            //   for( var j = 0 ; j < responseData.length ; j++ ) {
            //     if( responseData[j].categoryname == items[i].categoryname ) {
            //       responseData[j].totalcouponredemption += items[i].totalcouponredemption
            //       break
            //     }
            //   }
            //
            //   if( j == responseData.length && items[i].totalcouponredemption != 0 ) {
            //     var item = { categoryname:items[i].categoryname, totalcouponredemption:items[i].totalcouponredemption }
            //     responseData.push(item)
            //   }
            //
            // }
            //
            // resolve(responseData)
          }
          else if (response.status == 401) {
            console.log('user not authorized')
            reject('user not authorized')
          }
        });
    });
  },

  getStackedBarChartData: function() {

    return new Promise((resolve, reject) => {
      http
        .get('/static/api/stacked-bar-chart.json')
        .end(function (error, response) {

          if (response.status == 200) {

            var redemptionData = JSON.parse(response.text)
            var items = redemptionData['_items']
            resolve(items)
            
          }
          else if (response.status == 401) {
            console.log('user not authorized')
            reject('user not authorized')
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
}

module.exports = services
