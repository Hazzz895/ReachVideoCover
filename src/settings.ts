import { defineAddonSettings, SettingType } from '@pulsesync/addon-sdk'

export const settings = defineAddonSettings([
    {
        title: 'Настройки',
        items: {
            test: {
                name: 'test',
                type: SettingType.STRING,
                default: ""
            }
        }
    }
])
