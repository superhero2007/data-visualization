import services from '../../modules/services';

export default class TimePeriodService {

  constructor () {
    this.timePeriods = [];
    this.years = [];
    this.weeks = [];
    this.months = [];
    this.quarters = [];

    services.loadTimePeriodData().then( (response) => {
      this.timePeriods = response
      console.log("Time period data loaded, total records: " + this.timePeriods.length )
    }).catch( (message) => { console.log('TimePeriodService, loadTimePeriodData promise catch:' + message) })

  }

  getYears() {
    if( this.years.length == 0 ) {
      for( var i = 0; i < this.timePeriods.length; i++ ) {
        if( this.timePeriods[i].quarter == 0 && this.timePeriods[i].month == 0 && this.timePeriods[i].week == 0 ) {
          this.years.push( this.timePeriods[i] );
        }
      }
    }

    return this.years;
  }

  getQuarters() {
    if( this.quarters.length == 0 ) {
      for( var i = 0; i < this.timePeriods.length; i++ ) {
        if( this.timePeriods[i].quarter > 0 ) {
          this.quarters.push( this.timePeriods[i] );
        }
      }
    }

    return this.quarters;
  }

  getWeeks() {
    if( this.weeks.length == 0 ) {
      for( var i = 0; i < this.timePeriods.length; i++ ) {
        if( this.timePeriods[i].week > 0 ) {
          this.weeks.push( this.timePeriods[i] );
        }
      }
    }

    return this.weeks;
  }

  getMonths() {
    if( this.months.length == 0 ) {
      for( var i = 0; i < this.timePeriods.length; i++ ) {
        if( this.timePeriods[i].month > 0 ) {
          this.months.push( this.timePeriods[i] );
        }
      }
    }

    return this.months;
  }
}
