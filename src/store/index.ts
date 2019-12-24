import Vue from 'vue';
import Vuex,{GetterTree,MutationTree,ActionTree, ModuleTree, MutationPayload} from 'vuex';
import { Store_State } from './COM/store_core';

Vue.use(Vuex);


//Get方法
const getters = <GetterTree<Store_State, any>> {
  
};

// 状态修改事件
const mutations = <MutationTree<Store_State>> {
    // 是否显示
    ShowGameSettingDialog(state:Store_State, payload:any) 
    {
        state.GlobalDialog.bGameSetting = payload;
    }
};

//
const actions = <ActionTree<Store_State, any> >{
    fetchUserId(store) {
    }
};

//模块
const modules = <ModuleTree<any>>
{

};

export default new Vuex.Store<Store_State>({
  state: new Store_State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
  modules: modules
});
