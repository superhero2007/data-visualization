import services from '../../modules/services'
import * as d3 from 'd3'

export default class LocalDataService {

  constructor () {

    this.manufacturerData = [];
    this.comparableData = [];

    services.loadManufacturerData().then( (response) => {
      this.manufacturerData = response
      console.log("Manufacturer data loaded, total records: " + this.manufacturerData.length )
    }).catch( (message) => { console.log('LocalDataService, loadManufacturerData promise catch:' + message) })

    services.loadComparableData().then( (response) => {
      this.comparableData = response
      console.log("Comparable data loaded, total records: " + this.comparableData.length )
    }).catch( (message) => { console.log('LocalDataService, loadComparableData promise catch:' + message) })
  }

  getType () {
    return 'local data service'
  }

  // ***** MEDIA TYPE DATA ****************************************************

  getRedemptionsByMedia() {

    console.log("getting redemption media")
    console.log( nch.model.selectedCategories )

    var manufacturerFaceValues = this.processRedemptionsByMedia(this.manufacturerData, 0)
    var comparableFaceValues = this.processRedemptionsByMedia(this.comparableData, 1)

    var manufacturer = {
      label: 'General Mills, Inc',
      data: manufacturerFaceValues
    }

    var comparables = {
      label: 'Comparables',
      data: comparableFaceValues
    }

    return { manufacturer: manufacturer, comparables: comparables }
  }

  processRedemptionsByMedia( data, mfrName ) {
    var items = data;
    var responseData = {}

    for( var i = 0 ; i < items.length ; i++ ) {
      var item = items[i]
      var currentData = null

      // if( !nch.utils.inSelectedCategory(item) ) {
      //   continue
      // }

      for( var j = 0 ; j < nch.model.selectedCategories.length ; j ++ ) {
        if( (item.categorycode == nch.model.selectedCategories[j].categorycode) && (nch.model.selectedItem.selectedCategory == '' || nch.model.selectedItem.selectedCategory == item['categoryname'] || !(nch.model.selectedItem.selectedMfrname === mfrName)))
        {
          break
        }
      }

      if( j == nch.model.selectedCategories.length)
        continue

      if( responseData[ item['mediacodename'] ] ) {
        currentData = responseData[ item['mediacodename'] ]
      }
      else {
        var mediaLabel = nch.utils.getMediaAbbreviation(item['mediacodename'])
        currentData = { name: mediaLabel, totalredemptionsp1: 0, totalredemptionsp2: 0 }
        responseData[ item['mediacodename'] ] = currentData
      }

      //currentData.totalredemptionsp1 += item['totalredemptionsp1']
      //currentData.totalredemptionsp2 += item['totalredemptionsp2']
      currentData.totalredemptionsp1 += item['totalredemptionsp1']
      currentData.totalredemptionsp2 += item['totalredemptionsp2']
    }

    return responseData;
  }

  // ***** FACE VALUE DATA ****************************************************

  getFaceValueData() {

    var manufacturerFaceValues = this.processFaceValueData(this.manufacturerData)
    var comparableFaceValues = this.processFaceValueData(this.comparableData)

    var manufacturer = {
      label: 'General Mills, Inc',
      data: manufacturerFaceValues
    }

    var comparables = {
      label: 'Comparables',
      data: comparableFaceValues
    }

    return { manufacturer: manufacturer, comparables: comparables }
  }

  processFaceValueData( data ) {
    var faceValueData = {}
    var totalP1Redemptions = 0;
    var totalP2Redemptions = 0;

    for( var i = 0; i < data.length; i++ ) {

      var item = data[i];
      var currrentFaceValue = null;

      //var codeField = 'facevaluerangecode';
      var codeField = 'facevalueperunitrangecode';

      if( item[codeField] != 1 && item[codeField] != 2 && item[codeField] != 3 && item[codeField] != 4 ) {
        continue;
      }

      if( faceValueData[ item[codeField] ] ) {
        currrentFaceValue = faceValueData[ item[codeField] ]
      }
      else {
        currrentFaceValue = { code: item[codeField], name: item['facevalueperunitrangedescription'], p1Redemptions: 0, p2Redemptions: 0 }
        faceValueData[ item[codeField] ] = currrentFaceValue
      }

      var p1RedemptionValue =  Number(item['totalredemptionsp1']);
      var p2RedemptionValue =  Number(item['totalredemptionsp2']);

      if( !isNaN(p1RedemptionValue) ) {
        currrentFaceValue.p1Redemptions += p1RedemptionValue;
        totalP1Redemptions += p1RedemptionValue;
      }

      if( !isNaN(p2RedemptionValue) ) {
        currrentFaceValue.p2Redemptions += p2RedemptionValue;
        totalP2Redemptions += p2RedemptionValue;
      }

    }

    var faceValues = Object.keys( faceValueData );

    for( var j = 0; j < faceValues.length; j++ ) {
      var faceValuesCode = faceValues[j];
      var faceValueObject = faceValueData[faceValuesCode]
      var faceValuePercentage = faceValueObject.p1Redemptions/totalP1Redemptions
      faceValueObject['p1Percentage'] = faceValuePercentage;

      var faceValuePercentage2 = faceValueObject.p2Redemptions/totalP2Redemptions
      faceValueObject['p2Percentage'] = faceValuePercentage2;
    }

    return faceValueData;
  }

  getDataForFaceValue( faceValueCode, periodCode, manufacturerCode ) {

    var filteredData = [];
    // TODO: update to honor the period code and manufacturer code
    var data = this.period1GmData;

    for( var i = 0; i < data.length; i++ ) {

      var item = data[i];

      if (item['facevaluerangecode'] == faceValueCode ) {
        filteredData.push( item )
        continue;
      }
    }

    return filteredData;
  }

  getCurrentManufacturerData (categories) {
    let that = this
    const tempFullManufacturerData = []

    categories.forEach(function (node) {
      that.manufacturerData.forEach(function (manufacturer) {
        if (manufacturer.categorycode === node.categorycode &&
          manufacturer.categoryname === node.categoryname) {
          tempFullManufacturerData.push(manufacturer)
        }
      })
    })

    let tempManufacturerData = d3.nest()
      .key(function (d) { return d.categoryname })
      .key(function (d) { return d.mediacodename })
      .rollup(function (v) {
        return {
          period1: d3.mean(v, function(d) { return d.totalredemptionsp1 }),
          period2: d3.mean(v, function(d) { return d.totalredemptionsp2 })
        }
      }).entries(tempFullManufacturerData)

    let currentManufacturerData = {}
    tempManufacturerData.forEach(function (d) {
      currentManufacturerData[d.key] = {}
      d.values.map(function (v) {
        currentManufacturerData[d.key][v.key] = {}
        currentManufacturerData[d.key][v.key]['period1'] = d3.format('(.2f')(v.value.period1)
        currentManufacturerData[d.key][v.key]['period2'] = d3.format('(.2f')(v.value.period2)
      })
    })

    return currentManufacturerData
  }

  getCurrentComparableData() {
    let that = this
    let tempComparableData = d3.nest()
      .key(function (d) { return d.mediacodename })
      .rollup(function (v) {
        return {
          period1: d3.mean(v, function(d) { return d.totalredemptionsp1 }),
          period2: d3.mean(v, function(d) { return d.totalredemptionsp2 })
        }
      }).entries(that.comparableData)

    let currentComparableData = {}
    tempComparableData.forEach(function (d) {
      currentComparableData[d.key] = {}
      currentComparableData[d.key]['period1'] = d3.format('(.2f')(d.value.period1)
      currentComparableData[d.key]['period2']= d3.format('(.2f')(d.value.period2)
    })

    return currentComparableData
  }

  getAllMediaData() {
    let that = this
    let allMediaData = d3.values((d3.nest()
      .key(function (d) { return d.mediacodename })
      .entries(that.comparableData))).map(function (d) {
      return d.key
    })
    return allMediaData
  }

  getCurrentManufacturerData() {
    return this.manufacturerData;
  }

  getComparableData() {
    return this.comparableData;
  }
}
