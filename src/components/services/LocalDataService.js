import services from '../../modules/services'

export default class LocalDataService {

  constructor () {

    this.period1GmData = [];
    this.period2GmData = [];
    this.period1AllData = [];
    this.period2AllData = [];
    //
    // services.loadPeriod1Gm().then( (response) => {
    //   this.period1GmData = response
    //   console.log("Period 1 GM data loaded, total records: " + this.period1GmData.length );
    //   console.log(this.period1GmData[100])
    // }).catch( (message) => { console.log('LocalDataService, loadPeriod1Gm promise catch:' + message) })
    //
    // services.loadPeriod2Gm().then( (response) => {
    //   this.period2GmData = response
    //   console.log("Period 2 GM data loaded, total records: " + this.period2GmData.length )
    // }).catch( (message) => { console.log('LocalDataService, loadPeriod2Gm promise catch:' + message) })
    //
    // services.loadPeriod1All().then( (response) => {
    //   this.period1AllData = response
    //   console.log("Period 1 All data loaded, total records: " + this.period1AllData.length )
    // }).catch( (message) => { console.log('LocalDataService, loadPeriod1All promise catch:' + message) })
    //
    // services.loadPeriod2All().then( (response) => {
    //   this.period2AllData = response
    //   console.log("Period 2 All data loaded, total records: " + this.period2AllData.length )
    // }).catch( (message) => { console.log('LocalDataService, loadPeriod2All promise catch:' + message) })

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

  }

  processRedemptionsByMedia( data ) {
    var items = data;
    var min = 10000000
    var max = -1
    var mediaMap = {}
    var responseData = { min: 0, max: 0, mediaData: mediaMap }

    for( var i = 0 ; i < items.length ; i++ ) {
      var item = items[i]
      var currentData = null

      for( var j = 0 ; j < this.model.selectedCategories.length ; j ++ ) {
        if( (item['categoryname'] == this.model.selectedCategories[j]) && (this.model.selectedCategory.value == '' || this.model.selectedCategory.value == item['categoryname']))
        {
          break
        }
      }

      if( j == this.model.selectedCategories.length)
        continue

      if( mediaMap[ item['medianame'] ] ) {
        currentData = mediaMap[ item['medianame'] ]
      }
      else {
        currentData = { name: item['medianame'], redempations: 0, redempationValue: 0 }
        mediaMap[ item['medianame'] ] = currentData
      }

      //currentData.redempations += item['totalcouponredemption']
      //currentData.redempationValue += item['totalcouponredemeedvalue']
      currentData.redempations += item['totalcouponredemeedvalue']
      currentData.redempationValue += item['totalcouponredemption']

      if( currentData.redempations < min ) {
        min = currentData.redempations
      }

      if( currentData.redempations > max ) {
        max = currentData.redempations
      }
    }


    responseData.min = min
    responseData.max = max
    return responseData;
  }

  // ***** FACE VALUE DATA ****************************************************

  getFaceValueData() {

    console.log("Getting Face Value Data, Period 1 GM data loaded, total records: " + this.period1GmData.length );

    //var faceValues1 = this.processFaceValueData(this.period1GmData);
    //var faceValues2 = this.processFaceValueData(this.period2GmData);
    var manufacturerFaceValues = this.processFaceValueData(this.manufacturerData);

    var manufacturer = {
      label: 'General Mills, Inc',
      data: manufacturerFaceValues
    }

    // var faceValues3 = this.processFaceValueData(this.period1GmData);
    // var faceValues4 = this.processFaceValueData(this.period2GmData);
    var comparableFaceValues = this.processFaceValueData(this.comparableData);

    var comparables = {
      label: 'Comparables',
      data: comparableFaceValues
    }

    return { manufacturer: manufacturer, comparables: comparables };
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

    console.log( "totalP1Redemptions: " + totalP1Redemptions );

    var faceValues = Object.keys( faceValueData );
    console.log( faceValues );
    for( var j = 0; j < faceValues.length; j++ ) {
      var faceValuesCode = faceValues[j];
      var faceValueObject = faceValueData[faceValuesCode]
      //console.log( faceValueObject );
      var faceValuePercentage = faceValueObject.p1Redemptions/totalP1Redemptions
      //console.log( "faceValuePercentage for " + faceValuesCode + ": " + faceValuePercentage );
      faceValueObject['p1Percentage'] = faceValuePercentage;

      var faceValuePercentage2 = faceValueObject.p2Redemptions/totalP2Redemptions
      //console.log( "faceValuePercentage for " + faceValuesCode + ": " + faceValuePercentage );
      faceValueObject['p2Percentage'] = faceValuePercentage2;
    }

    //console.log("Face value data");
    //console.log( faceValueData );
    //console.log( nch.model.selectedCategories );
    //console.log( nch.model.categories );
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

  getCurrentManufacturerData() {
    var combinedData = [];
    var data = this.period1GmData;

    for( var i = 0; i < data.length; i++ ) {
      combinedData.push( data[i] )
    }

    data = this.period2GmData;

    for( i = 0; i < data.length; i++ ) {
      combinedData.push( data[i] )
    }

    return combinedData;
  }

  getComparableData() {
    var combinedData = [];
    var data = this.period1GmData; // TODO: change this to be ALL data, not GM

    for( var i = 0; i < data.length; i++ ) {
      combinedData.push( data[i] )
    }

    data = this.period2GmData;

    for( i = 0; i < data.length; i++ ) {
      combinedData.push( data[i] )
    }

    return combinedData;
  }

}
