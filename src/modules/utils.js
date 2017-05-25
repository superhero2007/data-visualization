const utils = {
  stateList () {
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
      ['Wyoming', 'WY']
    ]
  },

  getStateAbbrev (stateName) {
    const states = this.stateList()
    stateName = stateName.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
    for (let i = 0; i < states.length; i++) {
      if (states[i][0] === stateName) {
        return (states[i][1])
      }
    }

    return null
  },

  getStateName (stateAbbrev) {
    const states = this.stateList()
    stateAbbrev = stateAbbrev.toUpperCase()
    for (let i = 0; i < states.length; i++) {
      if (states[i][1] === stateAbbrev) {
        return (states[i][0])
      }
    }

    return null
  },

  getCurrentWeek (date) {
    if (!(date instanceof Date)) {
      date = new Date()
    }
    const nDay = (date.getDay() + 6) % 7
    date.setDate(date.getDate() - nDay + 3)

    const n1stThursday = date.valueOf()

    date.setMonth(0, 1)

    if (date.getDay() !== 4) {
      date.setMonth(0, 1 + ((4 - date.getDay()) + 7) % 7)
    }

    return 1 + Math.ceil((n1stThursday - date) / 604800000)
  },

  getRollingWeeksRanges (date) {
    if (!(date instanceof Date)) {
      date = new Date()
    }
    const endClosedWeek = this.getCurrentWeek(date) - 1
    let endYear = date.getFullYear()
    let startClosedWeek = endClosedWeek
    let startYear = date.getFullYear() - 1

    if (endClosedWeek === 52) {
      endYear = date.getFullYear() - 1
    }

    if (startClosedWeek === 52) {
      startClosedWeek = 1
      endYear = date.getFullYear()
    }

    const ranges = {
      'start': {
        'week': startClosedWeek,
        'year': startYear
      },
      'end': {
        'week': endClosedWeek,
        'year': endYear
      }
    }
    return ranges
  },

  getCurrentQuarter () {
    const quarter = Math.floor((date.getMonth() + 3) / 3)
    return quarter
  },

  getLastQuarter () {
    let lastQ = this.getCurrentQuarter() - 1
    let Qyear = date.getFullYear()
    if (lastQ === 0) {
      lastQ = 1
      Qyear = date.getFullYear() - 1
    }
    let quarter = {'quarter': lastQ, 'year': Qyear}
  },

  getClosedQuarterRanges (date) {
    if (!(date instanceof Date)) {
      date = new Date()
    }
    // TODO startQuarter:: will get this from service soon
    let startQuarter = {'quarter': 1, 'year': 2015}
    let endQuarter = this.getLastQuarter()
    let quarterRanges = {'start': startQuarter, 'end': endQuarter}
  },

  getClosedMonthsRanges (date) {
    if (!(date instanceof Date)) {
      date = new Date()
    }
    // TODO startMonth:: will get this from service soon
    // let startMonth = { 'month': 1, 'year': 2015 }
    let endMonth = date.getMonth() - 1
    let Myear = date.getFullYear()
    if (endMonth === 0) {
      endMonth = 12
      Myear = date.getFullYear() - 1
    }
    endMonth = {'month': endMonth, 'year': Myear}
    // let MonthRanges = { 'start': startMonth, 'end': endMonth }
  },

  getMediaAbbreviation(mediaType) {
    if (mediaType == 'Handout Electronic Checkout') {
      return 'HEC'
    }
    else {
      return mediaType
    }
  },

  inSelectedCategory( item ) {
    for( var j = 0 ; j < nch.model.selectedCategories.length ; j ++ ) {

      if( item.categorycode == nch.model.selectedCategories[j].categorycode ) {
        return true;
      }
    }

    return false;
  },

  /**
   * TODO: remove this method; we shouldn't use any CSV even for local data
   * @param csv
   * @returns {Array}
   */
  csv2json(csv) {
    var lines = csv.split('\n')
    var result = []
    var headers = lines[0].split(',')

    for (let i = 1; i < lines.length; i++) {

      var obj = {}
      // if(lines[i] == "")
      //   continue;

      var currentline = lines[i].split(',')

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j]
      }

      result.push(obj)
    }

    return result
  },

  pieColors() {
    return [
      '#d62024',
      '#70ccdd',
      '#f07a20',
      '#2bb34b',
      '#cc449a',
      '#2a3088',
      '#3366CC',
      '#DC3912',
      '#109618',
      '#990099',
      '#ab98c5',
      '#898aa6',
      '#687b88',
      '#486b6b',
      '#5da056',
      '#74d03c',
      '#8cff00',
      '#6633CC',
      '#39DC12',
      '#961018',
      '#009999',
      '#999900',
      '#7b6888'
    ]
  }

}

module.exports = utils
