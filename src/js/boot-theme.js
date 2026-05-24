(function () {
    'use strict';

    const snapshotKey = 'ohMySwipeDeck.initialPaint';
    const defaults = {
        wallpaper: true,
        wallpaperSrc: 'img/bg.jpg',
        themeMode: 'system',
        backgroundColor: '#090a0d',
        textColor: '#f3f5f7',
    };
    const palettes = {
        dark: {
            backgroundColor: '#090a0d',
            textColor: '#f3f5f7',
        },
        light: {
            backgroundColor: '#f4f6f8',
            textColor: '#171b21',
        },
    };
    const themeDefaultColors = {
        backgroundColor: new Set([...Object.values(palettes).map(palette => palette.backgroundColor), '#0d0f0f', '#f4efe6']),
        textColor: new Set([...Object.values(palettes).map(palette => palette.textColor), '#f4f1e8', '#17201b']),
    };
    const root = document.documentElement;
    const systemThemeQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    function normalizeColorValue(value) {
        return typeof value === 'string' ? value.trim().toLowerCase() : '';
    }

    function isThemeDefaultColor(settingKey, value) {
        return !value || themeDefaultColors[settingKey]?.has(normalizeColorValue(value));
    }

    function getResolvedThemeMode(themeMode) {
        if (themeMode === 'dark' || themeMode === 'light') {
            return themeMode;
        }
        return systemThemeQuery?.matches ? 'dark' : 'light';
    }

    function getThemeAwareSettingColor(snapshot, settingKey, resolvedTheme) {
        const palette = palettes[resolvedTheme] || palettes.dark;
        const value = snapshot?.[settingKey];
        return isThemeDefaultColor(settingKey, value) ? palette[settingKey] : value;
    }

    function isDefaultWallpaperSrc(src) {
        if (!src || typeof src !== 'string') {
            return false;
        }
        const cleanSrc = src.split('?')[0];
        return cleanSrc === defaults.wallpaperSrc || cleanSrc.endsWith(`/${defaults.wallpaperSrc}`);
    }

    function readSnapshot() {
        try {
            return JSON.parse(localStorage.getItem(snapshotKey)) || {};
        } catch (error) {
            return {};
        }
    }

    function setWallpaperVar(src) {
        const escapedSrc = String(src).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        root.style.setProperty('--initial-wallpaper-src', `url("${escapedSrc}")`);
    }

    function clearInitialBackgroundClasses() {
        root.classList.remove('gradientBackground', 'initialCustomWallpaper', 'initialSolidBackground');
        root.style.removeProperty('--initial-wallpaper-src');
        root.style.removeProperty('--initial-background-color');
    }

    function applyInitialPaint(rawSettings) {
        if (root.dataset.initialPaintFinalized === 'true') {
            return;
        }

        const snapshot = { ...defaults, ...rawSettings };
        const resolvedTheme = getResolvedThemeMode(snapshot.themeMode);
        const backgroundColor = getThemeAwareSettingColor(snapshot, 'backgroundColor', resolvedTheme);
        const textColor = getThemeAwareSettingColor(snapshot, 'textColor', resolvedTheme);

        root.classList.toggle('themeLight', resolvedTheme === 'light');
        root.classList.toggle('themeDark', resolvedTheme === 'dark');
        root.dataset.theme = resolvedTheme;
        root.style.colorScheme = resolvedTheme;
        root.style.backgroundColor = backgroundColor;
        root.style.setProperty('--surface-0', backgroundColor);
        root.style.setProperty('--color', textColor);

        clearInitialBackgroundClasses();

        if (snapshot.wallpaper && snapshot.wallpaperSrc) {
            if (isDefaultWallpaperSrc(snapshot.wallpaperSrc)) {
                root.classList.add('gradientBackground');
            } else {
                setWallpaperVar(snapshot.wallpaperSrc);
                root.classList.add('initialCustomWallpaper');
            }
        } else {
            root.style.setProperty('--initial-background-color', backgroundColor);
            root.classList.add('initialSolidBackground');
        }
    }

    applyInitialPaint(readSnapshot());

    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.get('settings')
            .then(result => {
                if (result?.settings) {
                    applyInitialPaint(result.settings);
                }
            })
            .catch(() => {});
    }
}());
