import LocalDataService from './LocalDataService';
import DataService from './DataService';
import TimePeriodService from './TimePeriodService';

export default class ServiceFactory {
  constructor () {
  }

  getDataService () {
    if (process.env.NODE_ENV === 'development') {
      return new LocalDataService()
    } else {
      return new DataService()
    }
  }

  getPeriodService() {
    return new TimePeriodService();
  }
}
