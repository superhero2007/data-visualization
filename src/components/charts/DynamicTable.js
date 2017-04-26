import * as d3 from 'd3';
import services from '../../modules/services';

export default {
  name: 'dynamic-table',
  template: require('components/charts/DynamicTable.html'),
  data () {
    return {
      mediaNames: null,
      categories: null,
      data: null
    }
  },
  mounted() {
    services.getRedemptionsByMediaType().then( this.render ).catch( (message) => { console.log('DynamicTable promise catch:' + message) });
  },
  methods: {
    render( response ) {
      this.mediaNames = response.mediaNames;
      this.categories = response.categories;
      this.data = response.data;
    },
    formattedValue( value ) {
      return d3.format("(.2f")(value)
    },
    getIcon( mediaValue ) {
      if( mediaValue == "FSI" ) {
        return "fa-scissors";
      }
      else if( mediaValue == "Print At Home" ) {
        return "fa-print";
      }
      else if( mediaValue == "Handout Electronic Checkout" ) {
        return "fa-tablet";
      }
      else if( mediaValue == "Military" ) {
        return "fa-star";
      }
      else {
        return "fa-question-circle";
      }
    }
  }
}


