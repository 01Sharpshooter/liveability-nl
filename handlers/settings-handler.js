const settingsHandler = (function () {
    const settings = new Map();
    const listeners = { general: [] };


    const loadSettings = async () => {
        settings.set(AppSettings.LIVEABILITY_REGIONS_ENABLED, await readLocalSetting(AppSettings.LIVEABILITY_REGIONS_ENABLED)); //maybe rename this one?
        settings.set(AppSettings.MIN_LIVEABILITY_SCORE, await readLocalSetting(AppSettings.MIN_LIVEABILITY_SCORE));
        settings.set(AppSettings.MIN_DEVELOPMENT_SCORE, await readLocalSetting(AppSettings.MIN_DEVELOPMENT_SCORE));
        settings.set(AppSettings.MIN_HOUSES_SCORE, await readLocalSetting(AppSettings.MIN_HOUSES_SCORE));
        settings.set(AppSettings.MIN_RESIDENTS_SCORE, await readLocalSetting(AppSettings.MIN_RESIDENTS_SCORE));
        settings.set(AppSettings.MIN_SERVICES_SCORE, await readLocalSetting(AppSettings.MIN_SERVICES_SCORE));
        settings.set(AppSettings.MIN_SAFETY_SCORE, await readLocalSetting(AppSettings.MIN_SAFETY_SCORE));
        settings.set(AppSettings.MIN_ENVIRONMENT_SCORE, await readLocalSetting(AppSettings.MIN_ENVIRONMENT_SCORE));
    }

    const get = (setting) => {
        return settings.get(setting);
    }

    const set = (setting, value) => {
        const updatedSetting = settings.set(setting, value);

        const settingListeners = listeners[setting];
        settingListeners?.forEach(listener => {
            listener(value);
        });

        listeners.general.forEach(listener => listener(setting, value));

        return updatedSetting;
    }

    const addChangeListener = (listener, setting) => {
        if (setting) {
            listeners[setting] = listeners[setting] ? [...listeners[setting], listener] : []; //TODO: make this readable
        } else {
            listeners.general = [...listeners.general, listener];
        }
    }

    return { get, loadSettings, set, addChangeListener }
})();