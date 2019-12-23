import {Vue,Prop,Component}from 'vue-property-decorator'


/**
 * 游戏配置相关Dialog
 */
@Component({})
export default class GameSettingDialogComponent extends Vue 
{
    @Prop()
    bShowGameDialog!:boolean;
}