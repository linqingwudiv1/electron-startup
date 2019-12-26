import { Component, Prop, Vue } from 'vue-property-decorator';
import Startup from '@/components/Startup/index.vue';
import GameSettingDialog from '@/components/GameSettingDialog/index.vue';

@Component(
{
  components:
  {
    startup : Startup,
    gameSettingDialog: GameSettingDialog
  }
})
export default class HomeView extends Vue {
}