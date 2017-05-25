let nch = {
  events: {},
  services: {
    dataService: null
  },
  views: {},
  model: {
    title: 'NCH',
    categories: [],
    selectedCategories: [],
    manufacturer: {
      code: -1,
      name: ''
    },
    currentManufacturer: null,
    selectedItem: {
      selectedMfrname: '',
      selectedCategory: '',
      selectedMedia: '',
      selectedProductMoved: '',
      selectedPeriod: '',
      selectedPrice: '',
      flag: 0
    },
    sidebarItems: [],
    classOfTrades: [],
    sectors: [],
    timeperiodData: 0,
    selectedYear: [],
    selectedQuarter: [],
    selectedWeek: []
  }
}

module.exports = nch
