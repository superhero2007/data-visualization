var nch = {
  events: {},
  services: {
    dataService: null
  },
  views: {},
  model: {
    title: 'NCH',
    categories: [],
    selectedCategories: [],
    currentManufacturer: null,
    selectedCategory: {
      value: "",
      flag: false
    },
    selectedMedia: {
      value: "",
      flag: false
    },
    sidebarItems: [],
    selectedProductMoved: {
      value: "",
      flag: false
    },
    classOfTrades: [],
    sectors: []
  }
};

module.exports = nch;
