import { defineAddonSettings, SettingType } from '@pulsesync/addon-sdk'

export const settings = defineAddonSettings([
    {
        title: 'Настройки плеера',
        items: {
            playerVisibility: {
                name: 'Видимость плеера на треках с видеообложками',
                description: 'Изменяет видимость плеера (обложки, названия и т.д) если доступна видеообложка.',
                type: SettingType.SELECT,
                default: 'cover',
                options: [
                    { label: 'Не скрывать', value: 'none' },
                    { label: 'Скрывать только обложку трека', value: 'cover' },
                    { label: 'Скрывать всё, кроме текста', value: 'all' },
                ]
            },
        }
    },
    {
        title: 'Настройки видеообложки',
        items: {
            videoOpacity: {
                name: 'Прозрачность видеообложки',
                type: SettingType.NUMBER,
                default: 100,
                min: 0,
                max: 100,
            },
            videoLyricsOpacity: {
                name: 'Прозрачность видеообложки при открытом тексте',
                type: SettingType.NUMBER,
                default: 50,
                min: 0,
                max: 100,
            },
            videoFilter: {
                type: SettingType.STRING,
                name: 'Фильтр видеообложки (продвинуто)',
                default: ''
            }
        }
    },
])
