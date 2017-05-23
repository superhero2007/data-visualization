'use strict'
import * as http from 'superagent'
import * as d3 from 'd3'

// local data
require('../data/us-states.json')
require('../data/categories.json')
require('../data/manufacturers.json')
require('../data/class-of-trade-values.json')
require('../data/redemption-data.json')
require('../data/pie-chart.json')
require('../data/stacked-bar-chart.json')
require('../data/stacked-bar-example.tsv')
require('../data/sidebar-items.json')
require('../data/product-moved-pie.json')
require('../data/class-of-trades.json')
require('../data/sectors.json')
require('../data/sectorCategory.json')
require('../data/time-period-data.json')
require('../data/help.json')
require('../data/redemption-data-all-2016-q1.csv')
require('../data/redemption-data-all-2016-q2.csv')
require('../data/redemption-data-gm-2016-q1.csv')
require('../data/redemption-data-gm-2016-q2.csv')
require('../data/redemption-all.json')
require('../data/redemption-manufacturer.json')

var services = {

  loadManufacturerData: function() {
    console.log("Loading Manufacturer data");
    var dataUrl = '/static/api/redemption-manufacturer.json'
    return this.loadRedemptionData( dataUrl );
  },
  loadComparableData: function() {
    console.log("Loading Comparable data");
    var dataUrl = '/static/api/redemption-all.json'
    return this.loadRedemptionData( dataUrl );
  },

  loadRedemptionData: function( dataUrl ) {
    return new Promise((resolve, reject) => {
      http
        .get(dataUrl)
        .end(function (error, response) {

          if (response.status == 200) {
            var json = JSON.parse(response.text)
            resolve(json)
          }
          else if (response.status == 401) {
            console.log('user not authorized')
          }
        })
    })
  },

  loadPeriod1All: function() {
    var dataUrl = '/static/api/redemption-data-all-2016-q1.csv'
    return this.loadPeriodData( dataUrl );

  },
  loadPeriod2All: function () {
    const dataUrl = '/static/api/redemption-data-all-2016-q2.csv'
    return this.loadPeriodData(dataUrl)
  },
  loadPeriod1Gm: function() {
    console.log("Loading Period 1 GM data");
    var dataUrl = '/static/api/redemption-data-gm-2016-q1.csv'
    return this.loadPeriodData( dataUrl );
  },
  loadPeriod2Gm: function () {
    const dataUrl = '/static/api/redemption-data-gm-2016-q2.csv'
    return this.loadPeriodData(dataUrl)
  },

  loadPeriodData: function (dataUrl) {
    return new Promise((resolve, reject) => {
      http
        .get(dataUrl)
        .end(function (error, response) {
          if (response.status === 200) {
            const csvData = response.text
            const json = nch.utils.csv2json(csvData)
            resolve(json)
          } else if (response.status === 401) {
            console.log('user not authorized')
          }
        })
    })
  },
  loadCategories: function () {
    return new Promise((resolve, reject) => {
      http
        .get('/static/api/categories.json')
        .end(function (error, response) {
          if (response.status === 200) {
            const categories = JSON.parse(response.text)
            let category = categories['_items'].map(function (d) {
              return d.categoryname
            })
            resolve(category)
          } else if (response.status === 401) {
            console.log('user not authorized')
          }
        })
    })
  },

  loadSidebarItems: function () {
    return new Promise((resolve, reject) => {
      http
        .get('/static/api/sidebar-items.json')
        .end(function (error, response) {
          if (response.status === 200) {
            const sidebarItems = JSON.parse(response.text)
            resolve(sidebarItems['_items'])
          } else if (response.status === 401) {
            console.log('user not authorized')
          }
        })
    })
  },

  loadHelpItems: function () {
    return new Promise((resolve, reject) => {
      http
        .get('/static/api/help.json')
        .end(function (error, response) {
          if (response.status === 200) {
            const helpItems = JSON.parse(response.text)
            resolve(helpItems['sections'])
          } else if (response.status === 401) {
            console.log('user not authorized')
          }
        })
    })
  },

  loadManufacturers: function () {
    http
      .get('/static/api/manufacturers.json')
      .end(function (error, response) {
        if (response.status === 200) {
          const manufacturers = JSON.parse(response.text)
          nch.model.manufacturers = manufacturers['_items']
        } else if (response.status === 401) {
          console.log('user not authorized')
        }
      })
  },

  loadClassOfTrades: function () {
    http
      .get('/static/api/class-of-trades.json')
      .end(function (error, response) {
        if (response.status === 200) {
          const classoftrades = JSON.parse(response.text)
          nch.model.classOfTrades = classoftrades['_items']
        } else if (response.status === 401) {
          console.log('user not authorized')
        }
      })
  },

  loadSectors: function () {
    return new Promise((resolve, reject) => {
      http
        .get('/static/api/sectors.json')
        .end(function (error, response) {
          if (response.status === 200) {
            const sectors = JSON.parse(response.text)
            nch.model.sectors = sectors['_items']
            resolve(sectors['_items'])
          } else if (response.status === 401) {
            console.log('user not authorized')
            reject('user not authorized')
          }
        })
    })
  },

  loadSectorCategories: function () {
    return new Promise((resolve, reject) => {
      http
        .get('/static/api/sectorCategory.json')
        .end(function (error, response) {
          if (response.status === 200) {
            let sectorCategory = JSON.parse(response.text)
            sectorCategory = d3.values(d3.nest()
              .key(function (d) { return d.sectorname })
              .entries(sectorCategory))
            resolve(sectorCategory)
          } else if (response.status === 401) {
            console.log('user not authorized')
            reject('user not authorized')
          }
        })
    })
  },

  loadCombinedData: function () {
    http
      .get('/static/api/pie-chart.json')
      .end(function (error, response) {
        if (response.status === 200) {
          let items = JSON.parse(response.text)['_items']

          nch.model.combinedData = d3.values((d3.nest()
              .key(function (d) { return d.categoryname })
              .key(function (d) { return d.medianame })
              .rollup(function (v) { return d3.mean(v, function (d) { return d.totalcouponredemption }) })
              .entries(items.filter(function (d) { return d.mfrname === nch.model.currentManufacturer }))
          ).sort(function (a, b) {
            if (a.key < b.key) return -1
            if (a.key > b.key) return 1
            return 0
          })).map(function (d) {
            let object = {}
            object.category = d.key
            object.values = {}
            d.values.map(function (v) {
              object.values[v.key] = d3.format('(.2f')(v.value)
            })
            return object
          })

          nch.model.allMedaiNames = d3.values((d3.nest()
            .key(function (d) { return d.medianame })
            .entries(items))).map(function (d) {
              return d.key
            })
        } else if (response.status === 401) {
          console.log('user not authorized')
        }
      })
  },

  getRedemptionsByState: function (manufacturer) {
    return new Promise((resolve, reject) => {
      http
        .get('/static/api/pie-chart.json')
        // .get('/static/api/redemption-data.json')
        .end(function (error, response) {
          if (response.status === 200) {
            let min = 10000
            let max = -1
            const stateMap = {}
            const stateData = { min: 0, max: 0, states: stateMap }
            const redemptionData = JSON.parse(response.text)
            const items = redemptionData['_items']

            for (let i = 0; i < items.length; i++) {
              const item = items[i]
              let currentState = null
              const stateName = nch.utils.getStateName(item['storestate'])
              if (stateName === null) {
                continue
              }

              if (manufacturer !== 'Comparables' && manufacturer !== item['mfrname']) {
                continue
              }

              if (stateMap[ item['storestate'] ]) {
                currentState = stateMap[ item['storestate'] ]
              } else {
                currentState = { name: item['storestate'], redempations: 0 }
                stateMap[ item['storestate'] ] = currentState
              }

              currentState.redempations += item['totalcouponredemption']

              if (currentState.redempations < min) {
                min = currentState.redempations
              }

              if (currentState.redempations > max) {
                max = currentState.redempations
              }
            }

            const states = Object.keys(stateMap)
            console.log('State count: ' + states.length)
            console.log('Min: ' + min + ', max: ' + max)
            stateData.min = min
            stateData.max = max
            resolve(stateData)
          } else if (response.status === 401) {
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
          if (response.status === 200) {
            const redemptionData = JSON.parse(response.text)
            const items = redemptionData['_items']
            resolve(items)
          } else if (response.status === 401) {
            console.log('user not authorized')
            reject('user not authorized')
          }
        })
    })
  },

  getBipartiteData: function () {
    return new Promise((resolve, reject) => {
      http
        .get('/static/api/redemption-data.json')
        .end(function (error, response) {
          if (response.status === 200) {
            const returnvalue = []
            const redemptionData = JSON.parse(response.text)
            const items = redemptionData['_items']

            for (let i = 0; i < items.length; i++) {
              const item = [items[i].medianame, items[i].storestate, items[i].totalcouponredemption, parseFloat(items[i].totalcouponredemeedvalue)]
              returnvalue.push(item)
            }

            resolve(returnvalue)
          } else if (response.status === 401) {
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
          if (response.status === 200) {
            const items = JSON.parse(response.text)['_items']
            const data = []
            filters.forEach(function (filter) {
              let temp = {}
              temp.category = filter
              const value = nch.model.combinedData.filter(function (d) { return d.category === filter })
              if (value[0]) {
                temp.manufacturer = value[0].values
              } else {
                temp.manufacturer = null
              }

              temp.comparables = {}
              d3.values((d3.nest()
                .key(function (d) { return d.medianame })
                .rollup(function (v) { return d3.mean(v, function (d) { return d.totalcouponredemption }) })
                .entries(items.filter(function (d) { return d.categoryname !== filter })))
              ).map(function (v) {
                temp.comparables[v.key] = d3.format('(.2f')(v.value)
              })
              data.push(temp)
            })
            resolve(data)
          } else if (response.status === 401) {
            console.log('user not authorized')
            reject('user not authorized')
          }
        })
    })
  },

  getPieData: function () {
    return new Promise((resolve, reject) => {
      http
        .get('/static/api/pie-chart.json')
        .end(function (error, response) {
          if (response.status === 200) {
            const redemptionData = JSON.parse(response.text)
            const items = redemptionData['_items']
            resolve(items)

            // const responseData = []
            //
            // for (let i = 0  i < items.length  i++) {
            //
            //   for (let j = 0  j < responseData.length  j++) {
            //     if (responseData[j].categoryname === items[i].categoryname) {
            //       responseData[j].totalcouponredemption += items[i].totalcouponredemption
            //       break
            //     }
            //   }
            //
            //   if (j === responseData.length && items[i].totalcouponredemption !== 0) {
            //     const item = { categoryname:items[i].categoryname, totalcouponredemption:items[i].totalcouponredemption }
            //     responseData.push(item)
            //   }
            //
            // }
            //
            // resolve(responseData)
          } else if (response.status === 401) {
            console.log('user not authorized')
            reject('user not authorized')
          }
        })
    })
  },

  getProductMovedPieData: function () {
    return new Promise((resolve, reject) => {
      http
        .get('/static/api/product-moved-pie.json')
        .end(function (error, response) {
          if (response.status === 200) {
            const redemptionData = JSON.parse(response.text)
            const items = redemptionData['_items']
            resolve(items)
          } else if (response.status === 401) {
            console.log('user not authorized')
            reject('user not authorized')
          }
        })
    })
  },

  getStackedBarChartData: function () {
    return new Promise((resolve, reject) => {
      http
        .get('/static/api/stacked-bar-chart.json')
        .end(function (error, response) {
          if (response.status === 200) {
            const redemptionData = JSON.parse(response.text)
            const items = redemptionData['_items']
            resolve(items)
          } else if (response.status === 401) {
            console.log('user not authorized')
            reject('user not authorized')
          }
        })
    })
  },

  getTimePeriodData: function () {
    return new Promise((resolve, reject) => {
      http
        .get('/static/api/time-period-data.json')
        .end(function (error, response) {
          if (response.status === 200) {
            const redemptionData = JSON.parse(response.text)
            const items = redemptionData['_items']
            resolve(items)
          } else if (response.status === 401) {
            console.log('user not authorized')
            reject('user not authorized')
          }
        })
    })
  }
}

module.exports = services
