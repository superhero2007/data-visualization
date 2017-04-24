import * as d3 from 'd3';
import * as topojson from 'topojson'

import services from '../../modules/services';

export default {
  name: 'MediaType',
  template: require('components/Tables/MediaType.html'),
  data () {
    return {
      mediaNames: null,
      categories: null,
      data: null
    }
  },
  mounted() {
    services.getRedemptionsByMediaType().then( this.render ).catch( (message) => { console.log('Bar promise catch:' + message) });
  },
  methods: {
    render( response ) {
      this.mediaNames = response.mediaNames;
      this.categories = response.categories;
      this.data = response.data;
    } // end render
  }
}
