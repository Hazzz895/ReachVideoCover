import path from 'node:path'

import { addonPlugin, defineAddonManifest } from '@pulsesync/addon-sdk/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import sassDts from 'vite-plugin-sass-dts';
import addonConfig from './addon.config.mjs'
import { settings } from './src/settings.ts'

const manifest = defineAddonManifest(addonConfig)

export default defineConfig(({ mode }) => ({
    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, 'src'),
        },
    },
    plugins: [
        react(),
        addonPlugin({
            manifest,
            settings,
            minify: mode === 'development' ? false : 'oxc',
            ...(process.env.PULSESYNC_ADDON_OUT_DIR ? { outDir: process.env.PULSESYNC_ADDON_OUT_DIR } : {}),
        }),
        sassDts({
            enabledMode: ['development', 'production'],
            // Формат экспорта (named делает экспорт каждого класса отдельной переменной)
            global: {
                generate: true,
                outputFilePath: '',
            }
        })
    ],
    css: {
        modules: {
            generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
    },
}))

