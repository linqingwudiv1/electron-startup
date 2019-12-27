import {Vue,Prop,Component}from 'vue-property-decorator'
import { Store } from 'vuex';


/**
 * 游戏配置相关Dialog
 */
@Component({})
export default class GameSettingDialogComponent extends Vue 
{
    mounted() {
    };
    
    public form:any = {
        name:   ''      ,
        region: ''      ,
        date1:  ''      ,
        date2:  ''      ,
        delivery: false ,
        type: []        ,
        resource: ''    ,
        desc: ''
    };
    
    //
    get bDialog():boolean
    {
        return this.$store.state.GlobalDialog.bGameSetting ;
    }

    //
    set bDialog(val:boolean)
    {
        this.$store.commit( 'ShowGameSettingDialog',  val);
        this.$store.state.GlobalDialog.bGameSetting = val;
    }
}