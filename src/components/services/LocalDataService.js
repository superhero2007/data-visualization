import services from '../../modules/services';

export default class LocalDataService {

  constructor () {
    this.period1GmData = [];
    this.period2GmData = [];
    this.period1AllData = [];
    this.period2AllData = [];

    services.loadPeriod1Gm().then( (response) => {
      this.period1GmData = response
      console.log("Period 1 GM data loaded, total records: " + this.period1GmData.length )
      // console.log(this.period1GmData[0])
      // console.log(this.period1GmData[100])
      // console.log(this.period1GmData[1000])
      // console.log('---------------------------------')
      //console.log(this.period1GmData)
    }).catch( (message) => { console.log('LocalDataService, loadPeriod1Gm promise catch:' + message) })

    services.loadPeriod2Gm().then( (response) => {
      this.period2GmData = response
      console.log("Period 2 GM data loaded, total records: " + this.period2GmData.length )
      //console.log(this.period2GmData)
    }).catch( (message) => { console.log('LocalDataService, loadPeriod2Gm promise catch:' + message) })

    services.loadPeriod1All().then( (response) => {
      this.period1AllData = response
      console.log("Period 1 All data loaded, total records: " + this.period1AllData.length )
      //console.log(this.period1AllData)
    }).catch( (message) => { console.log('LocalDataService, loadPeriod1All promise catch:' + message) })

    services.loadPeriod2All().then( (response) => {
      this.period2AllData = response
      console.log("Period 2 All data loaded, total records: " + this.period2AllData.length )
      //console.log(this.period2AllData)
    }).catch( (message) => { console.log('LocalDataService, loadPeriod2All promise catch:' + message) })

  }

  getType() {
    return "local data service"
  }

  // getManufacturerData( timePeriod ) {
  //   return this.processFaceValueData( timePeriod, this.period1GmData, this.period2GmData )
  // }

  // getComparableData( timePeriod ) {
  //   return this.processFaceValueData( timePeriod, this.period1AllData, this.period2AllData )
  // }

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

    //console.log( "totalRedemptions: " + totalRedemptions );

    var faceValues = Object.keys( faceValueData );
    //console.log( faceValues );
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

  // processFaceValueData( timePeriod, item1, item2 )
  // {
  //   var result = []

  //   if(timePeriod.type == "year")
  //   {
  //     for (var i = 0; i < item1.length; i++) {
  //       var year = parseInt(item1[i]['yyyyqqretailereow'].substr(0, 4))
  //       if(year == timePeriod.year)
  //         result.push(item1[i])
  //     }
  //     for (var i = 0; i < item2.length; i++) {
  //       var year = parseInt(item2[i]['yyyyqqretailereow'].substr(0, 4))
  //       if(year == timePeriod.year)
  //         result.push(item2[i])
  //     }
  //   }

  //   else if(timePeriod.type == "quarter")
  //   {
  //     for (var i = 0; i < item1.length; i++) {
  //       var year = parseInt(item1[i]['yyyyqqretailereow'].substr(0, 4))
  //       var quarter = parseInt(item1[i]['yyyyqqretailereow'].substr(4, 2))
  //       //if((year == timePeriod.year) && (quarter <= timePeriod.value * 3) && (quarter > timePeriod.value * 3 - 3))
  //       if((year == timePeriod.year) && (quarter == timePeriod.value))
  //         result.push(item1[i])
  //     }
  //     for (var i = 0; i < item2.length; i++) {
  //       var year = parseInt(item2[i]['yyyyqqretailereow'].substr(0, 4))
  //       var quarter = parseInt(item2[i]['yyyyqqretailereow'].substr(4, 2))
  //       //if((year == timePeriod.year) && (quarter <= timePeriod.value * 3) && (quarter > timePeriod.value * 3 - 3))
  //       if((year == timePeriod.year) && (quarter == timePeriod.value))
  //         result.push(item2[i])
  //     }
  //   }

  //   else if(timePeriod.type == "week")
  //   {
  //     var compareMonth = new Date(timePeriod.year + timePeriod.month).getMonth()
  //     for (var i = 0; i < item1.length; i++) {
  //       var year = parseInt(item1[i]['yyyyqqretailereow'].substr(0, 4))
  //       var month = parseInt(item1[i]['yyyyqqretailereow'].substr(4, 2))
  //       if((year == timePeriod.year) && (month == compareMonth))
  //         result.push(item1[i])
  //     }
  //     for (var i = 0; i < item2.length; i++) {
  //       var year = parseInt(item2[i]['yyyyqqretailereow'].substr(0, 4))
  //       var month = parseInt(item2[i]['yyyyqqretailereow'].substr(4, 2))
  //       if((year == timePeriod.year) && (month == compareMonth))
  //         result.push(item2[i])
  //     }
  //   }

  //   return result
  // }

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

}
