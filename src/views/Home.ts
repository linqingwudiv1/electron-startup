import { Component, Prop, Vue } from 'vue-property-decorator';
import Startup from '@/components/Startup.vue'
@Component(
  {
    components:
    {
      startup : Startup
    }
  })
export default class HomeView extends Vue{

}