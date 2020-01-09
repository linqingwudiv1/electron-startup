import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class BJProgressComponent extends Vue 
{
    @Prop()
    public percentage!: number;

    mounted() {
    }
}