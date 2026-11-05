import { defineAddon } from '@pulsesync/addon-sdk'
import addonConfig from '../addon.config.mjs'
import { settings } from './settings'
import { FULLSCREEN_CONTENT_ROOT } from './constants'
import VideoCover from './ui/components/VideoCover'

export default defineAddon({
    id: addonConfig.id,
    name: addonConfig.name,
    settings,
    mounts: [{ target: FULLSCREEN_CONTENT_ROOT, component: VideoCover },],
})
