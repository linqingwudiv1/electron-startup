import { Component, Prop, Vue } from 'vue-property-decorator';
import { remote } from 'electron'
const  { BrowserWindow } = remote;
@Component({})
export default class App extends Vue 
{
    mounted() {
    };

    //#region    

    public onclick_close():void 
    {
        BrowserWindow.getFocusedWindow()!.close();
    }

    //#endregion
}