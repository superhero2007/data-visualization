import services from '../../modules/services';

export default class LocalDataService {

  constructor () {
    this.period1GmData = null;
    this.period2GmData = null;
    this.period1AllData = null;
    this.period2AllData = null;

    services.loadPeriod1Gm().then( (response) => {
      this.period1GmData = response
      console.log("Period 1 GM data loaded, total records: " + this.period1GmData.length )
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

  // ***** FACE VALUE DATA ****************************************************

  getFaceValueData() {

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

  getManufacturerFaceValueData() {
    return this.processFaceValueData(this.period1GmData)
  }

  getComparableFaceValueData() {
    return this.processFaceValueData(this.period1AllData)
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

}
