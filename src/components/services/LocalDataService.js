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

  getManufacturerData( timePeriod ) {

  }

  getComparableData( timePeriod ) {

  }
}
