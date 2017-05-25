import services from '../../modules/services';

export default class SectorCategoryService {

  constructor () {
    this.sectors = [];
    this.sectorCategories = [];

    services.loadSectorsData().then((response) => {
      this.sectors = response
      console.log("Sector data loaded, total records: " + this.sectors.length )
    }).catch((message) => { console.log('SectorCategoryService, loadSectorsData promise catch:' + message) })

    services.loadSectorCategoriesData().then((response) => {
      this.sectorCategories = response
      console.log("Sector Categories data loaded, total records: " + this.sectorCategories.length )
    }).catch((message) => { console.log('SectorCategoryService, loadSectorCategoriesData promise catch:' + message) })
  }

  getCategories (sector) {
    //console.log("this.sectorCategories")
    //console.log(this.sectorCategories);
    let  selectedCategories = [];
    for (let i = 0; i < this.sectorCategories.length; i++ ) {
      if (this.sectorCategories[i].sectorname === sector.sectorname && this.sectorCategories[i].sectorcode === sector.sectorcode) {
        selectedCategories.push(this.sectorCategories[i]);
      }
    }
    this.sortObject(selectedCategories, 'categoryname')
    return selectedCategories;
  }

  sortObject (list, keyword) {
    list.sort(function(a, b){
      if(a[keyword] < b[keyword]) return -1;
      if(a[keyword] > b[keyword]) return 1;
      return 0;
    })
  }
}
