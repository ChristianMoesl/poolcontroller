export default function saveSetting(settingId, value) {
    return {
        type: 'SAVE_SETTING',
        id: settingId,
        value,
    };
}
