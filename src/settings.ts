import { defineAddonSettings, SettingType } from '@pulsesync/addon-sdk'

export const settings = defineAddonSettings([
    {
        title: 'Настройки плеера',
        items: {
            playerVisibility: {
                name: 'Видимость плеера на треках с видеообложками',
                description: 'Изменяет видимость плеера (обложки, названия и т.д) если доступна видеобложка.',
                type: SettingType.SELECT,
                default: 'cover',
                options: [
                    { label: 'Не скрывать', value: 'none' },
                    { label: 'Скрывать только обложку трека', value: 'cover' },
                    { label: 'Скрывать всё, кроме текста', value: 'all' },
                ]
            }
        }
    },
    {
        title: 'Настройки видеообложки',
        items: {
            videoBrightness: {
                name: 'Яркость видеообложки',
                type: SettingType.NUMBER,
                default: 100,
                min: 0,
                max: 100,
            },
            videoLyricsBrightness: {
                name: 'Яркость видео при открытом тексте',
                type: SettingType.NUMBER,
                default: 50,
                min: 0,
                max: 100,
            },
            videoBackdrop: {
                type: SettingType.STRING,
                name: 'Backdrop фильтр видеообложки (продвинуто)',
                default: ''
            }
        }
    },
    {
        title: 'Настройки фона плеера',
        items: {
            playerBackgroundEnabled: {
                name: 'Добавить фон на плеер',
                description: 'Когда включено, к элементам плеера (обложке, названию и т.д) добавляется фон для улучшения читаемости.',
                type: SettingType.BOOLEAN,
                default: false
            },
            playerBackgroundOpacity: {
                name: 'Прозрачность фона',
                type: SettingType.NUMBER,
                default: 25,
                min: 0,
                max: 100,
            },
            playerBackgroundColorFromCover: {
                name: 'Использовать акцентный цвет обложки трека как цвет фона',
                type: SettingType.BOOLEAN,
                default: true,
            },
            playerBackgroundColor: {
                name: 'Цвет фона (используется если кнопка выше выключена)',
                type: SettingType.COLOR,
                default: '#000000',
            },
            playerBackgroundBackdrop: {
                name: 'Backdrop фильтр фона (продвинуто)',
                type: SettingType.STRING,
                default: 'blur(4px)'
            }
        }
    },
])
