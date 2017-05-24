import services from '../../modules/services'

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

      for( var j = 0 ; j < nch.model.selectedCategories.length ; j ++ ) {
        if( (item['categoryname'] == nch.model.selectedCategories[j]) && (nch.model.selectedItem.selectedCategory == '' || nch.model.selectedItem.selectedCategory == item['categoryname'] || !(nch.model.selectedItem.selectedMfrname === mfrName)))
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
        currentData = { name: item['mediacodename'], totalredemptionsp1: 0, totalredemptionsp2: 0 }
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

  getCurrentManufacturerData() {
    return this.manufacturerData;
  }

  getComparableData() {
    return this.comparableData;
  }

}
