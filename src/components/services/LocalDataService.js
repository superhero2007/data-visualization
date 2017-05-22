import services from '../../modules/services';

export default class LocalDataService {

  constructor () {
    this.period1GmData = [];
    this.period2GmData = [];
    this.period1AllData = [];
    this.period2AllData = [];

    services.loadPeriod1Gm().then( (response) => {
      this.period1GmData = response
      console.log("Period 1 GM data loaded, total records: " + this.period1GmData.length );
      console.log(this.period1GmData[100])
    }).catch( (message) => { console.log('LocalDataService, loadPeriod1Gm promise catch:' + message) })

    services.loadPeriod2Gm().then( (response) => {
      this.period2GmData = response
      console.log("Period 2 GM data loaded, total records: " + this.period2GmData.length )
    }).catch( (message) => { console.log('LocalDataService, loadPeriod2Gm promise catch:' + message) })

    services.loadPeriod1All().then( (response) => {
      this.period1AllData = response
      console.log("Period 1 All data loaded, total records: " + this.period1AllData.length )
    }).catch( (message) => { console.log('LocalDataService, loadPeriod1All promise catch:' + message) })

    services.loadPeriod2All().then( (response) => {
      this.period2AllData = response
      console.log("Period 2 All data loaded, total records: " + this.period2AllData.length )
    }).catch( (message) => { console.log('LocalDataService, loadPeriod2All promise catch:' + message) })

  }

  getType() {
    return "local data service"
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

    var faceValues1 = this.processFaceValueData(this.period1GmData);
    var faceValues2 = this.processFaceValueData(this.period2GmData);

    var manufacturer = {
      label: 'General Mills, Inc',
      period1: {
        label: 'Q1 2016',
        data: faceValues1
      },
      period2: {
        label: 'Q2 2016',
        data: faceValues2
      }
    }

    // TODO: switch this to ALL data when it is available
    var faceValues3 = this.processFaceValueData(this.period1GmData);
    var faceValues4 = this.processFaceValueData(this.period2GmData);

    var comparables = {
      label: 'Comparables',
      period1: {
        label: 'Q1 2016',
        data: faceValues3
      },
      period2: {
        label: 'Q2 2016',
        data: faceValues4
      }
    }

    return { manufacturer: manufacturer, comparables: comparables };
  }

  processFaceValueData( data ) {
    var faceValueData = {}
    var totalRedemptions = 0;

    for( var i = 0; i < data.length; i++ ) {

      var item = data[i];
      var currrentFaceValue = null;

      if( item['facevaluerangecode'] != "1" && item['facevaluerangecode'] != "2" && item['facevaluerangecode'] != "3" && item['facevaluerangecode'] != "4" ) {
        continue;
      }

      if( faceValueData[ item['facevaluerangecode'] ] ) {
        currrentFaceValue = faceValueData[ item['facevaluerangecode'] ]
      }
      else {
        currrentFaceValue = { code: item['facevaluerangecode'], name: item['facevaluerangedescription'], redemptions: 0 }
        faceValueData[ item['facevaluerangecode'] ] = currrentFaceValue
      }

      //var redemptionValue =  Number(item['totalcouponredemption'])
      var redemptionValue =  Number(item['recordcount']);  // TODO: use the correct field when we get some real data

      if( isNaN(redemptionValue) ) {
        continue;
      }

      //console.log( "redemptionValue: " + redemptionValue );
      currrentFaceValue.redemptions += redemptionValue;
      totalRedemptions += redemptionValue;
    }

    console.log( "totalRedemptions: " + totalRedemptions );

    var faceValues = Object.keys( faceValueData );
    console.log( faceValues );
    for( var j = 0; j < faceValues.length; j++ ) {
      var faceValuesCode = faceValues[j];
      var faceValueObject = faceValueData[faceValuesCode]
      //console.log( faceValueObject );
      var faceValuePercentage = faceValueObject.redemptions/totalRedemptions
      //console.log( "faceValuePercentage for " + faceValuesCode + ": " + faceValuePercentage );
      faceValueObject['percentage'] = faceValuePercentage;
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

  getPieData() {
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

}
