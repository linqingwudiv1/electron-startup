import {Vue,Prop,Component}from 'vue-property-decorator'
import { Store } from 'vuex';


/**
 * 游戏配置相关Dialog
 */
@Component(
{
})
export default class GameSettingDialogComponent extends Vue 
{
    mounted() {

    };

    public form: {
        name:      String       ,
        region:    String       ,
        date1:     String       ,
        date2:     String       ,
        delivery:  boolean      ,
        type:      Array<any>   ,
        resource:  String       ,
        desc:      String
    } = {
        name:   ''      ,
        region: ''      ,
        date1:  ''      ,
        date2:  ''      ,
        delivery: false ,
        type: []        ,
        resource: ''    ,
        desc: ''
    };

    /**
     * 显示
     */
    public show()
    {
        this.bDialog = true;
    }

    /**
     * 隐藏
     */
    public hide()
    {
        this.bDialog = false;
    }

    /**
     * 
     */
    get bDialog():boolean
    { 
        return this.$store.state.GlobalDialog.bGameSetting;
    }

    /**
     * 
     */
    set bDialog(val:boolean)
    {
        this.$store.commit( 'ShowGameSettingDialog',  val);
    }

}