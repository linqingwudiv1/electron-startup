  import Vue, {VNode} from 'vue'
  import GameSettingDialogComponent from '@/views/Singleton/GameSettingDialog/index.ts'

  declare module 'vue/types/vue'
  {
      interface Vue {
        /** Displays a global notification message at the upper right corner of the page */
        $gameSettingDialog:(opt?:any) => GameSettingDialogComponent
      }
  }
