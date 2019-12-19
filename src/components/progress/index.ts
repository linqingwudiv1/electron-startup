import { Component, Prop, Vue } from 'vue-property-decorator';
import GApp from '@/Global/MainProcess/GApp';

@Component({})
export default class BJProgressComponent extends Vue 
{
    @Prop()
    public percentage!: number;

    mounted() {
    }
}