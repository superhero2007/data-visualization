var utils = {

  stateList() {
    return [
      ['Arizona', 'AZ'],
      ['Alabama', 'AL'],
      ['Alaska', 'AK'],
      ['Arizona', 'AZ'],
      ['Arkansas', 'AR'],
      ['California', 'CA'],
      ['Colorado', 'CO'],
      ['Connecticut', 'CT'],
      ['Delaware', 'DE'],
      ['Florida', 'FL'],
      ['Georgia', 'GA'],
      ['Hawaii', 'HI'],
      ['Idaho', 'ID'],
      ['Illinois', 'IL'],
      ['Indiana', 'IN'],
      ['Iowa', 'IA'],
      ['Kansas', 'KS'],
      ['Kentucky', 'KY'],
      ['Kentucky', 'KY'],
      ['Louisiana', 'LA'],
      ['Maine', 'ME'],
      ['Maryland', 'MD'],
      ['Massachusetts', 'MA'],
      ['Michigan', 'MI'],
      ['Minnesota', 'MN'],
      ['Mississippi', 'MS'],
      ['Missouri', 'MO'],
      ['Montana', 'MT'],
      ['Nebraska', 'NE'],
      ['Nevada', 'NV'],
      ['New Hampshire', 'NH'],
      ['New Jersey', 'NJ'],
      ['New Mexico', 'NM'],
      ['New York', 'NY'],
      ['North Carolina', 'NC'],
      ['North Dakota', 'ND'],
      ['Ohio', 'OH'],
      ['Oklahoma', 'OK'],
      ['Oregon', 'OR'],
      ['Pennsylvania', 'PA'],
      ['Rhode Island', 'RI'],
      ['South Carolina', 'SC'],
      ['South Dakota', 'SD'],
      ['Tennessee', 'TN'],
      ['Texas', 'TX'],
      ['Utah', 'UT'],
      ['Vermont', 'VT'],
      ['Virginia', 'VA'],
      ['Washington', 'WA'],
      ['West Virginia', 'WV'],
      ['Wisconsin', 'WI'],
      ['Wyoming', 'WY'],
    ];
  },

  getStateAbbrev(stateName){
    var states = this.stateList();
    stateName = stateName.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    for (var i = 0; i < states.length; i++) {
      if (states[i][0] == stateName) {
        return (states[i][1]);
      }
    }

    return null;
  },

  getStateName(stateAbbrev){
    var states = this.stateList();
    stateAbbrev = stateAbbrev.toUpperCase();
    for (var i = 0; i < states.length; i++) {
      if (states[i][1] == stateAbbrev) {
        return (states[i][0]);
      }
    }

    return null;
  },

  getCurrentWeek( date ) {
    if (! ( date instanceof Date ) ){
      date = new Date();
    }
    var nDay = ( date.getDay() + 6 ) % 7;
    date.setDate(date.getDate() - nDay + 3);


    var n1stThursday = date.valueOf();

    date.setMonth( 0, 1 );

    if ( date.getDay() !== 4 ) {
      date.setMonth(0, 1 + (( 4 - date.getDay() ) + 7 ) % 7 );
    }

   return 1 + Math.ceil( ( n1stThursday - date ) / 604800000 );
  },

  getRollingWeeksRanges( date ) {
    if (! ( date instanceof Date ) ){
      date = new Date();
    }
    var endClosedWeek = this.getCurrentWeek( date ) - 1;
    var endYear = date.getFullYear();
    var startClosedWeek = endClosedWeek;
    var startYear = date.getFullYear() - 1;

    if( endClosedWeek == 52 ) {
      endYear = date.getFullYear() - 1;
    }

    if( startClosedWeek == 52 ) {
      startClosedWeek = 1;
      endYear = date.getFullYear();
    }

    var ranges = {
      "start": {
        "week": startClosedWeek,
        "year": startYear
    },
      "end": {
        "week": endClosedWeek,
        "year": endYear
    } };

    return ranges;

  },

  getCurrentQuarter() {
    var quarter = Math.floor((date.getMonth() + 3) / 3);
    return quarter;
  },

  getLastQuarter() {
    var lastQ = this.getCurrentQuarter() -1;
    var Qyear = date.getFullYear();
    if(lastQ == 0 ){
      lastQ = 1;
      Qyear = date.getFullYear() - 1;
    }
     var quarter = { "quarter" : lastQ, "year" : Qyear };
  },

  getClosedQuarterRanges( date ) {
    if (! ( date instanceof Date ) ){
      date = new Date();
    }
    //TODO startQuarter:: will get this from service soon
    var startQuarter = { "quarter" : 1, "year" : 2015 };
    var endQuarter = this.getLastQuarter();
    var quarterRanges = { "start" : startQuarter, "end" : endQuarter };
  },

  getClosedMonthsRanges( date ) {
    if (! ( date instanceof Date ) ){
      date = new Date();
    }
    //TODO startMonth:: will get this from service soon
    var startMonth = { "month" : 1, "year" : 2015 };
    var endMonth = date.getMonth() - 1;
    var Myear = date.getFullYear();
    if(endMonth == 0 ){
      endMonth = 12;
      Myear = date.getFullYear() - 1;
    }
    var endMonth = { "month" : endMonth, "year" : Myear };
    var MonthRanges = { "start" : startMonth, "end" : endMonth };

  },

  csv2json( csv ) {
    var lines=csv.split("\n");
    var result = [];
    var headers=lines[0].split(",");

    for(var i=1;i<lines.length;i++){

      var obj = {};
      var currentline=lines[i].split(",");

      for(var j=0;j<headers.length;j++){
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    return result;
  }
}

module.exports = utils;
