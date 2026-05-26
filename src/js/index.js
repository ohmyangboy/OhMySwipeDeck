// OhMySwipeDeck
// copyright 2019 dev@conceptualspace.net
// absolutely no warranty is expressed or implied

'use strict';

// initialize Coloris color picker
// outputs hex #RRGGBBAA
Coloris({
    themeMode: 'dark',
    alpha: true,
    forceAlpha: true,
    formatToggle: false,
    showInput: false,
    cancelButton: true,
    closeButton: true,
    closeLabel: 'OK',
});

// swipe deck
const bookmarksContainerParent = document.getElementById('tileContainer');
const bookmarksContainer = bookmarksContainerParent
const foldersContainer = document.getElementById('folders');
const foldersRail = document.querySelector('.folders-content');
const addFolderButton = document.getElementById('addFolderButton');
const menu = document.getElementById('contextMenu');
const folderMenu = document.getElementById('folderMenu');
const settingsMenu = document.getElementById('settingsMenu');
const modal = document.getElementById('tileModal');
const modalContent = document.getElementById('tileModalContent');

const createDialModal = document.getElementById('createDialModal');
const createDialModalContent = document.getElementById('createDialModalContent');
const createDialModalURL = document.getElementById('createDialModalURL');
const createDialModalSave = document.getElementById('createDialModalSave');

const createFolderModal = document.getElementById('createFolderModal');
const createFolderModalContent = document.getElementById('createFolderModalContent');
const createFolderModalName = document.getElementById('createFolderModalName');
const createFolderModalSave = document.getElementById('createFolderModalSave');

const editFolderModal = document.getElementById('editFolderModal');
const editFolderModalContent = document.getElementById('editFolderModalContent');
const editFolderModalName = document.getElementById('editFolderModalName');
const editFolderModalSave = document.getElementById('editFolderModalSave');

const deleteFolderModal = document.getElementById('deleteFolderModal');
const deleteFolderModalContent = document.getElementById('deleteFolderModalContent');
const deleteFolderModalName = document.getElementById('deleteFolderModalName');
const deleteFolderModalSave = document.getElementById('deleteFolderModalSave');

const importExportModal = document.getElementById('importExportModal');
const importExportModalContent = document.getElementById('importExportModalContent');

const refreshAllModal = document.getElementById('refreshAllModal');
const refreshAllModalContent = document.getElementById('refreshAllModalContent');
const refreshAllModalSave = document.getElementById('refreshAllModalSave');

const toast = document.getElementById('toast');
const toastContent = document.getElementById('toastContent');

const closeModal = document.getElementsByClassName("close");
const modalSave = document.getElementById('modalSave');
const sidenav = document.getElementById("sidenav");
const modalTitle = document.getElementById("modalTitle");
const modalURL = document.getElementById("modalURL");
const modalImgContainer = document.getElementById("modalImgContainer");
const modalImgInput = document.getElementById("modalImgFile");
const modalImgBtn = document.getElementById("modalImgBtn");
const modalImgUrlBtn = document.getElementById("modalImgUrlBtn");
const modalImageURLInput = document.getElementById("modalImageURLInput");
const closeImgUrlBtn = document.getElementById("closeImgUrlBtn");
const fetchImageButton = document.getElementById("fetchImageButton");
const modalBgColorPickerInput = document.getElementById("modalBgColorPickerInput");
const modalBgColorPickerBtn = document.getElementById("modalBgColorPickerBtn");
const modalBgColorPreview = document.getElementById("modalBgColorPreview");
const noBookmarks = document.getElementById('noBookmarks');

// settings sidebar
const reader = new FileReader();
const color_picker = document.getElementById("color-picker");
const color_picker_wrapper = document.getElementById("color-picker-wrapper");
const textColor_picker = document.getElementById("textColor-picker");
const textColor_picker_wrapper = document.getElementById("textColor-picker-wrapper");
const imgInput = document.getElementById("file");
const imgPreview = document.getElementById("preview");
const previewOverlay = document.getElementById("previewOverlay");
const resetWallpaperBtn = document.getElementById("resetWallpaperBtn");
const switchesContainer = document.getElementById("switchesContainer");
const wallPaperEnabled = document.getElementById("wallpaper");
const previewContainer = document.getElementById("previewContainer");
const backgroundColorContainer = document.getElementById("backgroundColorContainer");
const themeModeInput = document.getElementById("themeMode");
const largeTilesInput = document.getElementById("largeTiles");
const rememberFolderInput = document.getElementById("rememberFolder");
const showTitlesInput = document.getElementById("showTitles");
const showCreateDialInput = document.getElementById("showCreateDial");
const showFoldersInput = document.getElementById("showFolders");
const showClockInput = document.getElementById("showClock");
const showSettingsBtnInput = document.getElementById("showSettingsBtn");
const showSearchBtnInput = document.getElementById("showSearchBtn");
const maxColsInput = document.getElementById("maxcols");
const defaultSortInput = document.getElementById("defaultSort");
const defaultOpenInput = document.getElementById("defaultOpen");
const newTabSoundInput = document.getElementById("newTabSound");
const newTabSoundTypeInput = document.getElementById("newTabSoundType");
const newTabSoundVolumeInput = document.getElementById("newTabSoundVolume");
const newTabSoundVolumeValue = document.getElementById("newTabSoundVolumeValue");
const activeSceneInput = document.getElementById("activeScene");
const sceneRuleSettings = document.getElementById("sceneRuleSettings");
const importExportBtn = document.getElementById("importExportBtn");
const importExportStatus = document.getElementById('statusMessage');
const exportBtn = document.getElementById("exportBtn");
const importFileInput = document.getElementById("importFile");
const importFileLabel = document.getElementById("importFileLabel");
const helpBtn = document.getElementById("help");
const resetSettingsBtn = document.getElementById("resetSettingsBtn");
const dialSizeInput = document.getElementById("dialSize");
const dialRatioInput = document.getElementById("dialRatio");

const searchInput = document.getElementById('searchInput');
const searchContainer = document.getElementById('searchContainer');
const searchBtn = document.getElementById('searchBtn');

// clock
const clock = document.getElementById('clock');

const port = "p-" + new Date().getTime();
let tabMessagePort = null;

chrome.runtime.onMessage.addListener(handleMessages);
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes[sceneSyncStorageKey]?.newValue) {
        sceneSync = normalizeSceneSync(changes[sceneSyncStorageKey].newValue);
        renderSceneControls();
        processRefresh();
    }
});

let cache = {};
let resizing = false;
let settings = null;
let swipeDeckId = null;
let sortable = null;
let folderNavTimeout = null;
let targetTileHref = null;
let targetTileId = null;
let targetTileTitle = null;
let targetNode = null;
let targetFolder = null;
let targetFolderName = null;
let targetFolderLink = null;
let folders = [];
let currentFolder = null;
let folderRailSettleTimeout = null;
let folderRailScrubTarget = null;
let folderRailScrubStartIndex = null;
let folderRailScrubDelta = 0;
let folderDragGrabOffset = null;
let stopFolderDragPointerSync = null;
let scrollPos = 0;
let homeFolderTitle = chrome.i18n.getMessage('home');
let windowSize = null;
let containerSize = null;
let layoutFolder = false;
let boxes = [];
let hourCycle = 'h12';
const locale = navigator.language;
const imageRatio = 1.54;
const helpUrl = 'https://github.com/yangbukun/OhMySwipeDeck';
const swipeDeckFolderTitle = 'OhMySwipeDeck';
// Keep the old root folder discoverable for users upgrading from the previous name.
const legacySpeedDialFolderTitle = 'Speed Dial';
const sceneAll = 'all';
const sceneFocus = 'focus';
const sceneDaily = 'daily';
const sceneSyncStorageKey = 'sceneSync.v2';
const legacySceneSyncStorageKey = 'sceneSync.v1';
const sceneLocalStorageKey = 'sceneLocal.v1';
const smartHomeRecentLimit = 8;
const smartHomeRecentHistoryFetchLimit = 60;
const smartHomeRecentHistoryDays = 30;
const defaultFocusHidePatterns = ['游戏', '视频', '吉他', '娱乐'];
const sceneRuleActions = ['show', 'hide'];
const sceneRuleMatches = ['contains', 'notContains'];
const wallpaperMaxDimension = 2560;
const wallpaperMaxPixels = 3600000;
const sceneRuleFields = [
    'folder.title',
    'folder.path',
    'bookmark.title',
    'bookmark.url',
    'bookmark.domain',
    'tab.title',
    'tab.url',
    'tab.domain',
];
const defaultSceneModules = {
    searchEnabled: true,
    recentTabsEnabled: true,
    homeBookmarksEnabled: true,
};
const soundOpenZen = 'open-zen';
const soundOpenRise = 'open-rise';
const soundSoftBloom = 'soft-bloom';
const soundSoftPearlDrop = 'soft-pearl-drop';
const soundSoftQuietResolve = 'soft-quiet-resolve';
const soundOpenDrop = 'open-drop';
const soundOpenWhisper = 'open-whisper';
const soundSoftLunaBell = 'soft-luna-bell';
const validNewTabSoundTypes = [
    soundOpenZen,
    soundOpenRise,
    soundSoftBloom,
    soundSoftPearlDrop,
    soundSoftQuietResolve,
    soundOpenDrop,
    soundOpenWhisper,
    soundSoftLunaBell,
];
const emptySceneContainerId = 'sceneEmpty';
let isToastVisible = false;
const folderRailSettleDelay = 115;
const folderSwitchEnterClass = 'folderSwitchEntering';
const folderSwitchExitClass = 'folderSwitchLeaving';
const folderSwitchEnterDuration = 260;
const folderSwitchExitDuration = 140;
const folderSwitchEnterStaggerMs = 12;
const folderSwitchExitStaggerMs = 6;
const folderSwitchEnterStaggerCap = 10;
const folderSwitchExitStaggerCap = 8;
const defaultWallpaperPreviewSrc = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%222400%22 height=%221000%22 viewBox=%220 0 2400 1000%22/%3E';
const systemThemeQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
const reduceMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
const themePalettes = {
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
    backgroundColor: new Set([...Object.values(themePalettes).map(palette => palette.backgroundColor.toLowerCase()), '#0d0f0f', '#f4efe6']),
    textColor: new Set([...Object.values(themePalettes).map(palette => palette.textColor.toLowerCase()), '#f4f1e8', '#17201b']),
};
const initialPaintSnapshotKey = 'ohMySwipeDeck.initialPaint';

let folderIds = [];
let sceneFolderOptions = [];
let sceneHomeOptions = [];
let sceneSync = null;
let sceneLocal = null;
let folderSwitchEnterTimer = null;
let folderSwitchExitTimer = null;
let folderSwitchEnterToken = 0;
let folderSwitchEnterTiles = [];
let folderSwitchExitTiles = [];

let defaults = {
    wallpaper: true,
    wallpaperSrc: 'img/bg.jpg',
    themeMode: 'system',
    backgroundColor: '#090a0d',
    largeTiles: true,
    rememberFolder: false,
    showTitles: true,
    showAddSite: true,
    showFolders: true,
    showSettingsBtn: true,
    showClock: true,
    showSearchBtn: true,
    maxCols: '100',
    defaultSort: 'first',
    defaultOpen: 'newTab',
    newTabSound: true,
    newTabSoundType: soundOpenZen,
    newTabSoundVolume: 1,
    textColor: '#f3f5f7',
    dialSize: 'large',
    dialRatio: 'flow',
    currentFolder: null,
    activeScene: sceneAll,
    sceneFolders: {
        work: [],
        life: [],
    },
};

// Create an invisible overlay to absorb outside clicks when Coloris is open
const colorisOverlay = document.createElement('div');
colorisOverlay.className = 'coloris-overlay';
colorisOverlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:999;display:none;';
document.body.appendChild(colorisOverlay);

document.querySelectorAll('.settingsCtl[data-coloris]').forEach(picker => {
    picker.addEventListener('open', () => colorisOverlay.style.display = 'block');
    // Using a timeout so the overlay stays for the full click cycle (mouseup/click)
    // before disappearing, absorbing the entire pointer interaction.
    picker.addEventListener('close', () => setTimeout(() => colorisOverlay.style.display = 'none', 100));
});

const debounce = (func, delay = 500, immediate = false) => {
    let inDebounce
    return function () {
        const context = this
        const args = arguments
        if (immediate && !inDebounce) {
            func.apply(context, args);
            inDebounce = setTimeout(() => clearTimeout(inDebounce), delay)
        } else {
            clearTimeout(inDebounce)
            inDebounce = setTimeout(() => func.apply(context, args), delay)
        }
    }
}

function updateSearchIconPosition() {
    // No longer needed - flexbox handles positioning automatically
    // This function is kept for compatibility in case it's called elsewhere
}

const i18nFallbackMessages = {
    en: {
        smartHomeSettings: 'Smart Home',
        homeBookmarks: 'Home Bookmarks',
        smartHomeSearch: 'Web Search',
        smartHomeRecent: 'Recently Opened Pages',
        openFullHistory: 'Full History',
        recentRules: 'Recent Page Rules',
        includePatterns: 'Include patterns',
        excludePatterns: 'Exclude patterns',
        enableRecentPages: 'Enable Recent Pages',
        recentUnavailable: 'History is not available in this browser.',
        recentEmpty: 'No matching recent pages.',
        searchUnavailable: 'Default browser search is unavailable.',
        newTabSoundVolume: 'Sound Volume',
        sceneFocus: 'Focus',
        sceneDaily: 'Daily',
        sceneRules: 'Scene Rules',
        defaultVisibility: 'Default visibility',
        optionShowByDefault: 'Show by default',
        optionHideByDefault: 'Hide by default',
        addScene: 'Add scene',
        duplicateScene: 'Duplicate',
        deleteScene: 'Delete',
        addRule: 'Add rule',
        removeRule: 'Remove',
        ruleActionShow: 'show',
        ruleActionHide: 'hide',
        ruleMatchContains: 'contains',
        ruleMatchNotContains: 'does not contain',
        ruleFieldFolderTitle: 'folder title',
        ruleFieldFolderPath: 'folder path',
        ruleFieldBookmarkTitle: 'bookmark title',
        ruleFieldBookmarkUrl: 'bookmark URL',
        ruleFieldBookmarkDomain: 'bookmark domain',
        ruleFieldTabTitle: 'page title',
        ruleFieldTabUrl: 'page URL',
        ruleFieldTabDomain: 'page domain',
        ruleValue: 'keyword',
        rulePreview: 'Preview',
        ruleVisible: 'shown',
        ruleHidden: 'hidden',
        ruleDefault: 'default',
        selectSceneForRule: 'Select a scene first.',
        ruleAdded: 'Rule added.',
        hideSimilarFolder: 'Hide similar folders',
        showOnlySimilarFolder: 'Show only similar folders',
        hideSimilarUrl: 'Hide similar URLs',
    },
    zh: {
        smartHomeSettings: '智能主页',
        homeBookmarks: '主页书签',
        smartHomeSearch: '网络搜索',
        smartHomeRecent: '最近打开的页面',
        openFullHistory: '完整历史记录',
        recentRules: '最近页面规则',
        includePatterns: '包含规则',
        excludePatterns: '排除规则',
        enableRecentPages: '启用最近页面',
        recentUnavailable: '此浏览器无法读取历史记录。',
        recentEmpty: '没有匹配的最近页面。',
        searchUnavailable: '无法使用浏览器默认搜索。',
        newTabSoundVolume: '音量大小',
        sceneFocus: '专注',
        sceneDaily: '日常',
        sceneRules: '场景规则',
        defaultVisibility: '默认显示方式',
        optionShowByDefault: '默认显示',
        optionHideByDefault: '默认隐藏',
        addScene: '新增场景',
        duplicateScene: '复制',
        deleteScene: '删除',
        addRule: '新增规则',
        removeRule: '删除',
        ruleActionShow: '显示',
        ruleActionHide: '隐藏',
        ruleMatchContains: '包含',
        ruleMatchNotContains: '不包含',
        ruleFieldFolderTitle: '文件夹名称',
        ruleFieldFolderPath: '文件夹路径',
        ruleFieldBookmarkTitle: '书签标题',
        ruleFieldBookmarkUrl: '书签地址',
        ruleFieldBookmarkDomain: '书签域名',
        ruleFieldTabTitle: '页面标题',
        ruleFieldTabUrl: '页面地址',
        ruleFieldTabDomain: '页面域名',
        ruleValue: '关键词',
        rulePreview: '预览',
        ruleVisible: '显示',
        ruleHidden: '隐藏',
        ruleDefault: '默认',
        selectSceneForRule: '请先选择一个具体场景。',
        ruleAdded: '规则已添加。',
        hideSimilarFolder: '在当前场景隐藏类似文件夹',
        showOnlySimilarFolder: '只在当前场景显示类似文件夹',
        hideSimilarUrl: '隐藏类似网址',
    },
};

function i18n(key) {
    const message = chrome.i18n.getMessage(key);
    if (message) {
        return message;
    }
    const language = (navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en';
    return i18nFallbackMessages[language][key] || i18nFallbackMessages.en[key] || key;
}

// detect clock settings
hourCycle = Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions().hourCycle;

function displayClock() {
    clock.textContent = new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hourCycle: hourCycle });
    updateFolderRailLayout();
    setTimeout(displayClock, 10000);
}

displayClock();

function normalizeColorValue(value) {
    return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function isThemeDefaultColor(settingKey, value) {
    return !value || themeDefaultColors[settingKey]?.has(normalizeColorValue(value));
}

function getResolvedThemeMode() {
    const themeMode = settings?.themeMode || defaults.themeMode;
    if (themeMode === 'dark' || themeMode === 'light') {
        return themeMode;
    }
    return systemThemeQuery?.matches ? 'dark' : 'light';
}

function getThemeAwareSettingColor(settingKey) {
    const palette = themePalettes[getResolvedThemeMode()] || themePalettes.dark;
    const value = settings?.[settingKey];
    return isThemeDefaultColor(settingKey, value) ? palette[settingKey] : value;
}

function applyThemeMode() {
    const resolvedTheme = getResolvedThemeMode();
    document.documentElement.classList.toggle('themeLight', resolvedTheme === 'light');
    document.documentElement.classList.toggle('themeDark', resolvedTheme === 'dark');
    document.body.classList.toggle('themeLight', resolvedTheme === 'light');
    document.body.classList.toggle('themeDark', resolvedTheme === 'dark');
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
    Coloris({ themeMode: resolvedTheme });
    return themePalettes[resolvedTheme] || themePalettes.dark;
}

function isDefaultWallpaperSrc(src) {
    if (!src || typeof src !== 'string') {
        return false;
    }
    const cleanSrc = src.split('?')[0];
    return cleanSrc === defaults.wallpaperSrc || cleanSrc.endsWith(`/${defaults.wallpaperSrc}`);
}

function getStoredWallpaperSrc(src) {
    return isDefaultWallpaperSrc(src) ? defaults.wallpaperSrc : src;
}

function getCssUrlValue(src) {
    const escapedSrc = String(src || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `url("${escapedSrc}")`;
}

function setWallpaperCssVar(src) {
    document.documentElement.style.setProperty('--wallpaper-src', getCssUrlValue(src));
}

function clearInitialPaintClasses({ preserveWallpaperSrc = false } = {}) {
    document.documentElement.dataset.initialPaintFinalized = 'true';
    document.documentElement.classList.remove('gradientBackground', 'initialCustomWallpaper', 'initialSolidBackground');
    if (!preserveWallpaperSrc) {
        document.documentElement.classList.remove('customWallpaper');
        document.documentElement.style.removeProperty('--wallpaper-src');
    }
    document.documentElement.style.removeProperty('--initial-background-color');
    document.documentElement.style.removeProperty('--surface-0');
    document.documentElement.style.removeProperty('background-color');
}

function syncInitialPaintSnapshot(backgroundColor, textColor) {
    const snapshot = {
        wallpaper: settings.wallpaper,
        wallpaperSrc: settings.wallpaperSrc || defaults.wallpaperSrc,
        themeMode: settings.themeMode || defaults.themeMode,
        backgroundColor,
        textColor,
    };

    try {
        localStorage.setItem(initialPaintSnapshotKey, JSON.stringify(snapshot));
    } catch (error) {
        if (!snapshot.wallpaper || isDefaultWallpaperSrc(snapshot.wallpaperSrc)) {
            return;
        }

        try {
            localStorage.setItem(initialPaintSnapshotKey, JSON.stringify({
                ...snapshot,
                wallpaper: false,
                wallpaperSrc: defaults.wallpaperSrc,
            }));
        } catch (fallbackError) {}
    }
}

function syncWallpaperPreviewLayout() {
    if (settings.wallpaper) {
        backgroundColorContainer.style.display = "none";
        previewContainer.style.opacity = '1';
        switchesContainer.style.transform = "translateY(0)";
    } else {
        backgroundColorContainer.style.display = "flex";
        previewContainer.style.opacity = '0';
        switchesContainer.style.transform = `translateY(-${previewContainer.offsetHeight}px)`;
    }
}

function setWallpaperPreview(wallpaperSrc) {
    const usesDefaultWallpaper = isDefaultWallpaperSrc(wallpaperSrc);
    imgPreview.classList.toggle('defaultWallpaperPreview', usesDefaultWallpaper);
    imgPreview.dataset.defaultWallpaper = usesDefaultWallpaper ? 'true' : 'false';
    resetWallpaperBtn.hidden = usesDefaultWallpaper;
    resetWallpaperBtn.title = i18n('resetWallpaper');
    resetWallpaperBtn.setAttribute('aria-label', i18n('resetWallpaper'));
    imgPreview.onload = syncWallpaperPreviewLayout;
    imgPreview.onerror = function () {
        if (usesDefaultWallpaper) {
            return;
        }
        settings.wallpaperSrc = defaults.wallpaperSrc;
        chrome.storage.local.set({ settings });
        applySettings();
    };
    imgPreview.setAttribute('src', usesDefaultWallpaper ? defaultWallpaperPreviewSrc : getStoredWallpaperSrc(wallpaperSrc));
    if (imgPreview.complete) {
        syncWallpaperPreviewLayout();
    }
}

function resetWallpaperToDefault() {
    settings.wallpaper = true;
    settings.wallpaperSrc = defaults.wallpaperSrc;
    wallPaperEnabled.checked = true;
    setWallpaperPreview(defaults.wallpaperSrc);
    applySettings();
    chrome.storage.local.set({ settings });
}

function cloneDefaultSettings() {
    return JSON.parse(JSON.stringify(defaults));
}

function uniqueStringList(value) {
    if (!Array.isArray(value)) {
        return [];
    }
    return [...new Set(value.filter(item => typeof item === 'string' && item.length))];
}

function uniqueTrimmedStringList(value) {
    if (!Array.isArray(value)) {
        return [];
    }
    return [...new Set(value
        .map(item => typeof item === 'string' ? item.trim() : '')
        .filter(Boolean))];
}

function normalizeNewTabSoundVolume(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return 1;
    }
    return Math.min(1, Math.max(0, numericValue));
}

function getNewTabSoundVolumePercent() {
    return Math.round(normalizeNewTabSoundVolume(settings.newTabSoundVolume) * 100);
}

function renderNewTabSoundVolumeValue() {
    if (!newTabSoundVolumeValue) {
        return;
    }
    newTabSoundVolumeValue.textContent = `${newTabSoundVolumeInput?.value || 0}%`;
}

function createSceneId(name = 'scene') {
    const slug = String(name || 'scene')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        || 'scene';
    const existingIds = new Set(getSceneList().map(scene => scene.id));
    let candidate = slug;
    let suffix = 2;
    while (existingIds.has(candidate) || candidate === sceneAll) {
        candidate = `${slug}-${suffix++}`;
    }
    return candidate;
}

function createSceneRule(action = 'hide', field = 'folder.title', value = '', match = 'contains') {
    return {
        id: `rule-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        action: sceneRuleActions.includes(action) ? action : 'hide',
        field: sceneRuleFields.includes(field) ? field : 'folder.title',
        match: sceneRuleMatches.includes(match) ? match : 'contains',
        value: String(value || '').trim(),
    };
}

function createDefaultFocusRules() {
    const fields = ['folder.title', 'bookmark.title', 'bookmark.url', 'tab.title', 'tab.url'];
    const rules = [];
    for (const value of defaultFocusHidePatterns) {
        for (const field of fields) {
            rules.push(createSceneRule('hide', field, value));
        }
    }
    return rules;
}

function cloneDefaultSceneSync() {
    return {
        version: 2,
        scenes: [
            {
                id: sceneFocus,
                name: i18n('sceneFocus'),
                defaultVisibility: 'show',
                modules: { ...defaultSceneModules },
                rules: createDefaultFocusRules(),
            },
            {
                id: sceneDaily,
                name: i18n('sceneDaily'),
                defaultVisibility: 'show',
                modules: { ...defaultSceneModules },
                rules: [],
            },
        ],
    };
}

function normalizeSceneRuleEntry(rule = {}) {
    const value = String(rule.value ?? rule.pattern ?? rule.values?.[0] ?? '').trim();
    return {
        id: typeof rule.id === 'string' && rule.id ? rule.id : createSceneRule().id,
        action: sceneRuleActions.includes(rule.action) ? rule.action : 'hide',
        field: sceneRuleFields.includes(rule.field) ? rule.field : 'folder.title',
        match: sceneRuleMatches.includes(rule.match) ? rule.match : 'contains',
        value,
    };
}

function normalizeSceneModules(modules = {}) {
    return {
        searchEnabled: modules.searchEnabled === undefined ? true : modules.searchEnabled === true,
        recentTabsEnabled: modules.recentTabsEnabled === undefined
            ? (modules.recentEnabled === undefined ? true : modules.recentEnabled === true)
            : modules.recentTabsEnabled === true,
        homeBookmarksEnabled: modules.homeBookmarksEnabled === undefined ? true : modules.homeBookmarksEnabled === true,
    };
}

function normalizeSceneConfig(scene = {}, fallbackId = sceneDaily) {
    const id = typeof scene.id === 'string' && scene.id && scene.id !== sceneAll
        ? scene.id
        : fallbackId;
    const rules = Array.isArray(scene.rules)
        ? scene.rules.map(normalizeSceneRuleEntry).filter(Boolean)
        : [];
    return {
        id,
        name: typeof scene.name === 'string' && scene.name.trim() ? scene.name.trim() : id,
        defaultVisibility: scene.defaultVisibility === 'hide' ? 'hide' : 'show',
        modules: normalizeSceneModules(scene.modules || scene),
        rules,
    };
}

function getLegacySceneName(sceneId) {
    if (sceneId === 'work') return i18n('sceneWork') || 'Work';
    if (sceneId === 'life') return i18n('sceneLife') || 'Life';
    return sceneId;
}

function parseLegacyKeyValue(key, prefix) {
    return String(key || '').startsWith(prefix) ? String(key).slice(prefix.length) : String(key || '');
}

function convertV1SceneSyncToV2(v1SceneSync = {}) {
    const scenes = [];
    const sourceScenes = v1SceneSync?.scenes || {};
    for (const sceneId of Object.keys(sourceScenes)) {
        const source = sourceScenes[sceneId] || {};
        const rules = [];
        for (const folderKey of uniqueStringList(source.folderKeys)) {
            rules.push(createSceneRule('show', 'folder.title', parseLegacyKeyValue(folderKey, 'folder:')));
        }
        for (const homeUrlKey of uniqueStringList(source.homeUrlKeys)) {
            rules.push(createSceneRule('show', 'bookmark.url', parseLegacyKeyValue(homeUrlKey, 'url:')));
        }
        const recentRules = source.recentRules || {};
        for (const pattern of uniqueTrimmedStringList(recentRules.includePatterns)) {
            rules.push(createSceneRule('show', 'tab.url', pattern));
            rules.push(createSceneRule('show', 'tab.title', pattern));
        }
        for (const pattern of uniqueTrimmedStringList(recentRules.excludePatterns)) {
            rules.push(createSceneRule('hide', 'tab.url', pattern));
            rules.push(createSceneRule('hide', 'tab.title', pattern));
        }
        scenes.push(normalizeSceneConfig({
            id: sceneId,
            name: getLegacySceneName(sceneId),
            defaultVisibility: 'hide',
            modules: {
                searchEnabled: source.searchEnabled,
                recentTabsEnabled: recentRules.enabled,
                homeBookmarksEnabled: true,
            },
            rules,
        }, sceneId));
    }
    return { version: 2, scenes: scenes.length ? scenes : cloneDefaultSceneSync().scenes };
}

function normalizeSceneSync(nextSceneSync = {}) {
    const source = nextSceneSync && typeof nextSceneSync === 'object' ? nextSceneSync : {};
    if (source.version !== 2 || !Array.isArray(source.scenes)) {
        return normalizeSceneSync(convertV1SceneSyncToV2(source));
    }

    const seen = new Set();
    const scenes = [];
    source.scenes.forEach((scene, index) => {
        const normalized = normalizeSceneConfig(scene, `scene-${index + 1}`);
        if (seen.has(normalized.id) || normalized.id === sceneAll) {
            normalized.id = createSceneId(normalized.name);
        }
        seen.add(normalized.id);
        scenes.push(normalized);
    });

    if (!scenes.length) {
        return cloneDefaultSceneSync();
    }

    return { version: 2, scenes };
}

function getSceneList() {
    return Array.isArray(sceneSync?.scenes) ? sceneSync.scenes : [];
}

function getSceneById(sceneId) {
    return getSceneList().find(scene => scene.id === sceneId) || null;
}

function isKnownScene(sceneId) {
    return sceneId === sceneAll || !!getSceneById(sceneId);
}

function normalizeSceneLocal(nextSceneLocal = {}) {
    const activeSceneId = nextSceneLocal?.activeSceneId || nextSceneLocal?.activeScene || sceneAll;
    return {
        activeSceneId: typeof activeSceneId === 'string' && activeSceneId ? activeSceneId : sceneAll,
    };
}

function normalizeSettings(nextSettings = {}) {
    const normalized = Object.assign(cloneDefaultSettings(), nextSettings || {});
    normalized.newTabSound = normalized.newTabSound !== false;
    normalized.newTabSoundType = validNewTabSoundTypes.includes(normalized.newTabSoundType)
        ? normalized.newTabSoundType
        : soundOpenZen;
    normalized.newTabSoundVolume = normalizeNewTabSoundVolume(normalized.newTabSoundVolume);
    normalized.activeScene = typeof normalized.activeScene === 'string' && normalized.activeScene
        ? normalized.activeScene
        : sceneAll;
    normalized.sceneFolders = {
        work: uniqueStringList(normalized.sceneFolders?.work),
        life: uniqueStringList(normalized.sceneFolders?.life),
    };
    return normalized;
}

function normalizeSceneSettings() {
    settings = normalizeSettings(settings);
    sceneSync = normalizeSceneSync(sceneSync);
    sceneLocal = normalizeSceneLocal(sceneLocal || { activeScene: settings.activeScene });
    if (!isKnownScene(sceneLocal.activeSceneId)) {
        sceneLocal.activeSceneId = sceneAll;
    }
    settings.activeScene = sceneLocal.activeSceneId;
    return settings;
}

function getActiveScene() {
    return sceneLocal?.activeSceneId || settings?.activeScene || sceneAll;
}

function getSceneRules(scene = getActiveScene()) {
    sceneSync = normalizeSceneSync(sceneSync);
    if (scene === sceneAll) {
        return {
            id: sceneAll,
            name: i18n('sceneAll'),
            defaultVisibility: 'show',
            modules: { ...defaultSceneModules },
            rules: [],
        };
    }
    return getSceneById(scene) || getSceneRules(sceneAll);
}

function saveSceneSync() {
    sceneSync = normalizeSceneSync(sceneSync);
    return chrome.storage.sync
        ? chrome.storage.sync.set({ [sceneSyncStorageKey]: sceneSync }).catch(error => {
            console.warn('Unable to sync scene settings:', error);
        })
        : Promise.resolve();
}

function saveSceneLocal() {
    sceneLocal = normalizeSceneLocal(sceneLocal);
    settings.activeScene = sceneLocal.activeSceneId;
    return chrome.storage.local.set({ [sceneLocalStorageKey]: sceneLocal });
}

function setActiveScene(scene, persist = false) {
    sceneLocal = normalizeSceneLocal({ activeSceneId: isKnownScene(scene) ? scene : sceneAll });
    if (settings) {
        settings.activeScene = sceneLocal.activeSceneId;
    }
    if (persist) {
        saveSceneLocal();
    }
    return sceneLocal.activeSceneId;
}

function normalizeFolderSceneTitle(title) {
    return String(title || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function getHomeUrlKey(url) {
    try {
        const parsedUrl = new URL(url);
        parsedUrl.hash = '';
        parsedUrl.protocol = parsedUrl.protocol.toLowerCase();
        parsedUrl.hostname = parsedUrl.hostname.toLowerCase();
        if (parsedUrl.pathname.length > 1 && parsedUrl.pathname.endsWith('/')) {
            parsedUrl.pathname = parsedUrl.pathname.slice(0, -1);
        }
        return `url:${parsedUrl.toString()}`;
    } catch (error) {
        return `url:${String(url || '').trim()}`;
    }
}

function parsePatternInput(value) {
    return uniqueTrimmedStringList(String(value || '').split(/[\n,]+/));
}

function formatPatternList(value) {
    return uniqueTrimmedStringList(value).join('\n');
}

function getSortedDeckFolders(children) {
    const deckFolders = children.filter(folder => !folder.url);
    const allFolders = [...deckFolders, { id: swipeDeckId, title: homeFolderTitle, index: -1 }];

    allFolders.sort((a, b) => {
        return (a.index || 0) - (b.index || 0);
    });

    return allFolders;
}

function getDomainFromUrl(url) {
    try {
        return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
    } catch (error) {
        return '';
    }
}

function getFolderPath(folder) {
    return `${swipeDeckFolderTitle}/${folder?.title || ''}`;
}

function getRuleFieldLabel(field) {
    const labels = {
        'folder.title': i18n('ruleFieldFolderTitle'),
        'folder.path': i18n('ruleFieldFolderPath'),
        'bookmark.title': i18n('ruleFieldBookmarkTitle'),
        'bookmark.url': i18n('ruleFieldBookmarkUrl'),
        'bookmark.domain': i18n('ruleFieldBookmarkDomain'),
        'tab.title': i18n('ruleFieldTabTitle'),
        'tab.url': i18n('ruleFieldTabUrl'),
        'tab.domain': i18n('ruleFieldTabDomain'),
    };
    return labels[field] || field;
}

function getRuleActionLabel(action) {
    return action === 'show' ? i18n('ruleActionShow') : i18n('ruleActionHide');
}

function getRuleMatchLabel(match) {
    return match === 'notContains' ? i18n('ruleMatchNotContains') : i18n('ruleMatchContains');
}

function hasRuleFieldContext(context, field) {
    if (field.startsWith('folder.')) return Boolean(context.folder);
    if (field.startsWith('bookmark.')) return Boolean(context.bookmark);
    if (field.startsWith('tab.')) return Boolean(context.tab);
    return false;
}

function getRuleFieldValue(context, field) {
    switch (field) {
        case 'folder.title':
            return context.folder?.title || '';
        case 'folder.path':
            return context.folder?.path || getFolderPath(context.folder);
        case 'bookmark.title':
            return context.bookmark?.title || '';
        case 'bookmark.url':
            return context.bookmark?.url || '';
        case 'bookmark.domain':
            return context.bookmark?.domain || getDomainFromUrl(context.bookmark?.url);
        case 'tab.title':
            return context.tab?.title || '';
        case 'tab.url':
            return context.tab?.url || '';
        case 'tab.domain':
            return context.tab?.domain || getDomainFromUrl(context.tab?.url);
        default:
            return '';
    }
}

function doesRuleMatch(rule, context) {
    const value = String(rule.value || '').trim().toLowerCase();
    if (!value) return false;
    if (!hasRuleFieldContext(context, rule.field)) return false;
    const fieldValue = String(getRuleFieldValue(context, rule.field) || '').toLowerCase();
    const containsValue = fieldValue.includes(value);
    return rule.match === 'notContains' ? !containsValue : containsValue;
}

function evaluateSceneVisibility(context, sceneId = getActiveScene()) {
    const scene = getSceneRules(sceneId);
    let visible = scene.defaultVisibility !== 'hide';
    let matchedRule = null;

    if (scene.id === sceneAll) {
        return { visible: true, matchedRule: null };
    }

    for (const rule of scene.rules) {
        if (doesRuleMatch(rule, context)) {
            visible = rule.action === 'show';
            matchedRule = rule;
        }
    }

    return { visible, matchedRule };
}

function getFolderRuleContext(folder) {
    return {
        type: 'folder',
        folder: {
            title: folder?.title || '',
            path: getFolderPath(folder),
        },
    };
}

function getBookmarkRuleContext(bookmark) {
    return {
        type: 'bookmark',
        bookmark: {
            title: bookmark?.title || '',
            url: bookmark?.url || '',
            domain: getDomainFromUrl(bookmark?.url),
        },
    };
}

function getTabRuleContext(tab) {
    return {
        type: 'tab',
        tab: {
            title: tab?.title || '',
            url: tab?.url || '',
            domain: getDomainFromUrl(tab?.url),
        },
    };
}

function isFolderVisibleInActiveScene(folder) {
    const activeScene = getActiveScene();
    const folderId = typeof folder === 'object' ? folder.id : folder;
    if (activeScene === sceneAll) {
        return true;
    }
    if (folderId === swipeDeckId) {
        return true;
    }
    return evaluateSceneVisibility(getFolderRuleContext(folder), activeScene).visible;
}

function getVisibleFoldersForActiveScene(allFolders) {
    return allFolders.filter(folder => isFolderVisibleInActiveScene(folder));
}

function shouldRenderFolderTabs(visibleFolders) {
    return visibleFolders.length > 1 || (getActiveScene() !== sceneAll && visibleFolders.length > 0);
}

function getFolderForActiveScene(folderId, visibleFolders) {
    if (folderId && visibleFolders.some(folder => folder.id === folderId)) {
        return folderId;
    }
    return visibleFolders[0]?.id || null;
}

function setCurrentFolderForScene(folderId, persist = false) {
    currentFolder = folderId || null;
    if (settings) {
        settings.currentFolder = currentFolder;
        if (persist) {
            chrome.storage.local.set({ settings });
        }
    }
}

function pruneSceneFolderAssignments(allFolders) {
    return false;
}

function assignFolderToActiveScene(folder) {
    const scene = getSceneById(getActiveScene());
    if (!scene || scene.defaultVisibility !== 'hide') {
        return false;
    }
    addRuleToScene(scene.id, createSceneRule('show', 'folder.title', folder.title));
    return true;
}

function removeFolderFromSceneAssignments(folderId, folderTitle = '') {
    return false;
}

function setHomeUrlSceneMembership(homeUrlKey, scene, enabled) {
    const sceneConfig = getSceneById(scene);
    if (!sceneConfig || !enabled) return;
    const url = parseLegacyKeyValue(homeUrlKey, 'url:');
    if (url) {
        addRuleToScene(scene, createSceneRule('show', 'bookmark.url', url));
    }
}

function removeHomeUrlFromSceneAssignments(url) {
    return false;
}

function replaceHomeUrlSceneAssignment(oldUrl, newUrl) {
    return false;
}

function setSceneModuleValue(scene, key, value) {
    const sceneConfig = getSceneById(scene);
    if (!sceneConfig) return;

    normalizeSceneSettings();
    const target = getSceneById(scene);
    if (Object.prototype.hasOwnProperty.call(target.modules, key)) {
        target.modules[key] = value === true;
    }
    saveSceneSync();
    if (getActiveScene() === scene) {
        processRefresh();
    }
}

function updateSceneConfig(sceneId, updater, refresh = true) {
    const scene = getSceneById(sceneId);
    if (!scene) return;
    updater(scene);
    sceneSync = normalizeSceneSync(sceneSync);
    saveSceneSync();
    renderSceneControls();
    if (refresh) {
        processRefresh();
    }
}

function addRuleToScene(sceneId, rule, refresh = true) {
    updateSceneConfig(sceneId, scene => {
        const normalizedRule = normalizeSceneRuleEntry(rule);
        if (normalizedRule) {
            scene.rules.push(normalizedRule);
        }
    }, refresh);
}

function getShortcutRuleScene() {
    const scene = getSceneById(getActiveScene());
    if (!scene) {
        showToast(i18n('selectSceneForRule'));
        return null;
    }
    return scene;
}

function addShortcutRule(action, field, value, options = {}) {
    const scene = getShortcutRuleScene();
    if (!scene) return;
    updateSceneConfig(scene.id, nextScene => {
        if (options.defaultVisibility) {
            nextScene.defaultVisibility = options.defaultVisibility;
        }
        nextScene.rules.push(createSceneRule(action, field, value));
    });
    showToast(i18n('ruleAdded'));
}

function createSceneCheckbox(checked, ariaLabel, onChange) {
    const label = document.createElement('label');
    label.className = 'settingsCtl sceneToggle';

    const input = document.createElement('input');
    input.className = 'settingsCtl';
    input.type = 'checkbox';
    input.checked = checked;
    input.setAttribute('aria-label', ariaLabel);
    input.addEventListener('change', onChange);

    label.appendChild(input);
    return label;
}

function renderActiveSceneOptions() {
    if (!activeSceneInput) return;
    const activeScene = getActiveScene();
    activeSceneInput.textContent = '';

    const allOption = document.createElement('option');
    allOption.value = sceneAll;
    allOption.textContent = i18n('sceneAll');
    activeSceneInput.appendChild(allOption);

    for (const scene of getSceneList()) {
        const option = document.createElement('option');
        option.value = scene.id;
        option.textContent = scene.name;
        activeSceneInput.appendChild(option);
    }

    activeSceneInput.value = isKnownScene(activeScene) ? activeScene : sceneAll;
}

function createSceneRuleButton(scene) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `settingsCtl scenePill${getActiveScene() === scene.id ? ' active' : ''}`;
    button.textContent = scene.name;
    button.addEventListener('click', () => {
        setActiveScene(scene.id, true);
        renderSceneControls();
        processRefresh();
    });
    return button;
}

function createSceneRuleRow(scene, rule, index) {
    const row = document.createElement('div');
    row.className = 'sceneRuleRow';

    const action = document.createElement('select');
    action.className = 'settingsCtl';
    for (const actionValue of sceneRuleActions) {
        const option = document.createElement('option');
        option.value = actionValue;
        option.textContent = getRuleActionLabel(actionValue);
        action.appendChild(option);
    }
    action.value = rule.action;
    action.addEventListener('change', event => updateSceneConfig(scene.id, nextScene => {
        nextScene.rules[index].action = event.target.value;
    }));

    const field = document.createElement('select');
    field.className = 'settingsCtl';
    for (const fieldValue of sceneRuleFields) {
        const option = document.createElement('option');
        option.value = fieldValue;
        option.textContent = getRuleFieldLabel(fieldValue);
        field.appendChild(option);
    }
    field.value = rule.field;
    field.addEventListener('change', event => updateSceneConfig(scene.id, nextScene => {
        nextScene.rules[index].field = event.target.value;
    }));

    const match = document.createElement('select');
    match.className = 'settingsCtl sceneRuleMatch';
    for (const matchValue of sceneRuleMatches) {
        const option = document.createElement('option');
        option.value = matchValue;
        option.textContent = getRuleMatchLabel(matchValue);
        match.appendChild(option);
    }
    match.value = rule.match;
    match.addEventListener('change', event => updateSceneConfig(scene.id, nextScene => {
        nextScene.rules[index].match = event.target.value;
    }));

    const value = document.createElement('input');
    value.className = 'settingsCtl sceneRuleValue';
    value.type = 'text';
    value.placeholder = i18n('ruleValue');
    value.value = rule.value;
    value.addEventListener('change', event => updateSceneConfig(scene.id, nextScene => {
        nextScene.rules[index].value = event.target.value.trim();
    }));

    const remove = document.createElement('button');
    remove.className = 'settingsCtl sceneIconButton';
    remove.type = 'button';
    remove.title = i18n('removeRule');
    remove.textContent = '×';
    remove.addEventListener('click', () => updateSceneConfig(scene.id, nextScene => {
        nextScene.rules.splice(index, 1);
    }));

    row.append(action, field, match, value, remove);
    return row;
}

function createPreviewRow(typeLabel, label, context, sceneId) {
    const decision = evaluateSceneVisibility(context, sceneId);
    const row = document.createElement('div');
    row.className = `scenePreviewRow ${decision.visible ? 'visible' : 'hidden'}`;

    const name = document.createElement('span');
    name.className = 'scenePreviewName';
    name.textContent = label;

    const type = document.createElement('span');
    type.className = 'scenePreviewType';
    type.textContent = typeLabel;

    const status = document.createElement('span');
    status.className = 'scenePreviewStatus';
    status.textContent = decision.visible ? i18n('ruleVisible') : i18n('ruleHidden');

    const reason = document.createElement('span');
    reason.className = 'scenePreviewReason';
    reason.textContent = decision.matchedRule
        ? `${getRuleActionLabel(decision.matchedRule.action)} ${getRuleFieldLabel(decision.matchedRule.field)} ${getRuleMatchLabel(decision.matchedRule.match)}: ${decision.matchedRule.value}`
        : i18n('ruleDefault');

    row.append(type, name, status, reason);
    return row;
}

function renderRulePreview(container, sceneId) {
    const title = document.createElement('div');
    title.className = 'scenePanelTitle';
    title.textContent = i18n('rulePreview');
    container.appendChild(title);

    const list = document.createElement('div');
    list.className = 'scenePreviewList';
    container.appendChild(list);

    sceneFolderOptions
        .filter(folder => folder.id !== swipeDeckId)
        .forEach(folder => list.appendChild(createPreviewRow(
            i18n('sceneFolders'),
            folder.title,
            getFolderRuleContext(folder),
            sceneId
        )));

    sceneHomeOptions
        .filter(bookmark => bookmark.url)
        .forEach(bookmark => list.appendChild(createPreviewRow(
            i18n('homeBookmarks'),
            bookmark.title || bookmark.url,
            getBookmarkRuleContext(bookmark),
            sceneId
        )));

    getRecentHistoryItems().then(pages => {
        pages.slice(0, smartHomeRecentLimit).forEach(page => list.appendChild(createPreviewRow(
            i18n('smartHomeRecent'),
            page.title || page.url,
            getTabRuleContext(page),
            sceneId
        )));
    });
}

function renderSceneRuleSettings() {
    if (!sceneRuleSettings || !settings) return;

    normalizeSceneSettings();
    sceneRuleSettings.textContent = '';

    const sceneList = document.createElement('div');
    sceneList.className = 'scenePillList';
    getSceneList().forEach(scene => sceneList.appendChild(createSceneRuleButton(scene)));

    const addSceneButton = document.createElement('button');
    addSceneButton.type = 'button';
    addSceneButton.className = 'settingsCtl scenePill';
    addSceneButton.textContent = `+ ${i18n('addScene')}`;
    addSceneButton.addEventListener('click', () => {
        const name = i18n('addScene');
        const id = createSceneId(name);
        sceneSync.scenes.push(normalizeSceneConfig({
            id,
            name,
            defaultVisibility: 'show',
            modules: { ...defaultSceneModules },
            rules: [],
        }, id));
        setActiveScene(id, true);
        saveSceneSync().then(() => {
            renderSceneControls();
            processRefresh();
        });
    });
    sceneList.appendChild(addSceneButton);
    sceneRuleSettings.appendChild(sceneList);

    const activeSceneId = getActiveScene();
    const scene = getSceneById(activeSceneId);
    if (!scene) {
        const notice = document.createElement('p');
        notice.className = 'sceneRuleNotice';
        notice.textContent = `${i18n('sceneAll')}：${i18n('ruleDefault')}`;
        sceneRuleSettings.appendChild(notice);
        renderRulePreview(sceneRuleSettings, sceneAll);
        return;
    }

    const meta = document.createElement('div');
    meta.className = 'sceneRuleMeta';

    const nameInput = document.createElement('input');
    nameInput.className = 'settingsCtl';
    nameInput.type = 'text';
    nameInput.value = scene.name;
    nameInput.addEventListener('change', event => updateSceneConfig(scene.id, nextScene => {
        nextScene.name = event.target.value.trim() || nextScene.name;
    }, false));

    const defaultVisibility = document.createElement('select');
    defaultVisibility.className = 'settingsCtl';
    [
        ['show', i18n('optionShowByDefault')],
        ['hide', i18n('optionHideByDefault')],
    ].forEach(([value, label]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        defaultVisibility.appendChild(option);
    });
    defaultVisibility.value = scene.defaultVisibility;
    defaultVisibility.addEventListener('change', event => updateSceneConfig(scene.id, nextScene => {
        nextScene.defaultVisibility = event.target.value === 'hide' ? 'hide' : 'show';
    }));

    const duplicateButton = document.createElement('button');
    duplicateButton.className = 'settingsCtl sceneActionButton';
    duplicateButton.type = 'button';
    duplicateButton.textContent = i18n('duplicateScene');
    duplicateButton.addEventListener('click', () => {
        const id = createSceneId(`${scene.name}-copy`);
        const copy = normalizeSceneConfig({
            ...JSON.parse(JSON.stringify(scene)),
            id,
            name: `${scene.name} Copy`,
        }, id);
        sceneSync.scenes.push(copy);
        setActiveScene(id, true);
        saveSceneSync().then(() => {
            renderSceneControls();
            processRefresh();
        });
    });

    const deleteButton = document.createElement('button');
    deleteButton.className = 'settingsCtl sceneActionButton';
    deleteButton.type = 'button';
    deleteButton.textContent = i18n('deleteScene');
    deleteButton.disabled = getSceneList().length <= 1;
    deleteButton.addEventListener('click', () => {
        if (getSceneList().length <= 1) return;
        sceneSync.scenes = getSceneList().filter(item => item.id !== scene.id);
        setActiveScene(sceneAll, true);
        saveSceneSync().then(() => {
            renderSceneControls();
            processRefresh();
        });
    });

    meta.append(nameInput, defaultVisibility, duplicateButton, deleteButton);
    sceneRuleSettings.appendChild(meta);

    const modules = document.createElement('div');
    modules.className = 'sceneModuleGrid';
    [
        ['searchEnabled', i18n('smartHomeSearch')],
        ['recentTabsEnabled', i18n('smartHomeRecent')],
        ['homeBookmarksEnabled', i18n('homeBookmarks')],
    ].forEach(([moduleKey, labelText]) => {
        const label = document.createElement('span');
        label.className = 'sceneModuleLabel';
        label.textContent = labelText;
        modules.append(label, createSceneCheckbox(
            scene.modules[moduleKey],
            labelText,
            event => setSceneModuleValue(scene.id, moduleKey, event.target.checked)
        ));
    });
    sceneRuleSettings.appendChild(modules);

    const rulesTitle = document.createElement('div');
    rulesTitle.className = 'scenePanelTitle';
    rulesTitle.textContent = i18n('sceneRules');
    sceneRuleSettings.appendChild(rulesTitle);

    const rulesList = document.createElement('div');
    rulesList.className = 'sceneRulesList';
    scene.rules.forEach((rule, index) => rulesList.appendChild(createSceneRuleRow(scene, rule, index)));
    sceneRuleSettings.appendChild(rulesList);

    const addRuleButton = document.createElement('button');
    addRuleButton.type = 'button';
    addRuleButton.className = 'settingsCtl sceneActionButton';
    addRuleButton.textContent = `+ ${i18n('addRule')}`;
    addRuleButton.addEventListener('click', () => addRuleToScene(scene.id, createSceneRule('hide', 'folder.title', ''), false));
    sceneRuleSettings.appendChild(addRuleButton);

    renderRulePreview(sceneRuleSettings, scene.id);
}

function renderSceneControls() {
    renderActiveSceneOptions();
    renderSceneRuleSettings();
}

function clearDeckContainers(visibleFolderIds) {
    const visibleIds = new Set(visibleFolderIds);
    Array.from(bookmarksContainerParent.children).forEach(child => {
        if (child.classList?.contains('container')
            && (child.id === emptySceneContainerId || !visibleIds.has(child.id))) {
            child.remove();
        }
    });
}

function printEmptyScene() {
    clearDeckContainers([]);
    foldersContainer.innerHTML = '';

    let folderContainerEl = document.getElementById(emptySceneContainerId);
    if (!folderContainerEl) {
        folderContainerEl = document.createElement('div');
        folderContainerEl.id = emptySceneContainerId;
        folderContainerEl.classList.add('container');
        bookmarksContainerParent.append(folderContainerEl);
    }

    folderContainerEl.style.display = 'flex';
    folderContainerEl.style.opacity = '1';
    folderContainerEl.textContent = '';

    const emptyContent = document.createElement('div');
    emptyContent.className = 'default-content';

    const title = document.createElement('h1');
    title.className = 'default-content';
    title.textContent = i18n('sceneEmptyTitle');

    const message = document.createElement('p');
    message.className = 'default-content helpText';
    message.textContent = i18n('sceneEmptyMessage');

    emptyContent.append(title, message);
    folderContainerEl.appendChild(emptyContent);
    bookmarksContainerParent.scrollTop = 0;
    requestAnimationFrame(updateFolderRailLayout);
}

function getBookmarks(folderId) {
    chrome.bookmarks.getChildren(folderId).then(result => {
        if (folderId === swipeDeckId && !result.length && settings.showFolders) {
            //noBookmarks.style.display = 'block';
            addFolderButton.style.display = 'none';
        }
        printBookmarks(result, folderId)
    }, error => {
        console.log(error);
    });
}

async function buildDialPages(swipeDeckId, currentFolderId) {
    async function getChildren(folderId) {
        return await chrome.bookmarks.getChildren(folderId);
    }

    normalizeSceneSettings();
    const children = await getChildren(swipeDeckId);
    sceneHomeOptions = children.filter(bookmark => bookmark.url);
    if (!children.length) {
        // new install
        sceneFolderOptions = getSortedDeckFolders(children);
        renderSceneControls();
        setCurrentFolderForScene(swipeDeckId, true);
        clearDeckContainers([swipeDeckId]);
        addFolderButton.style.display = 'none';
        searchBtn.style.display = 'none';
        printNewSetup();
        return;
    }

    const folders = getSortedDeckFolders(children);
    sceneFolderOptions = folders;
    pruneSceneFolderAssignments(folders);
    renderSceneControls();
    const visibleFolders = getVisibleFoldersForActiveScene(folders);
    const visibleFolderIds = visibleFolders.map(folder => folder.id);
    const nextCurrentFolder = getFolderForActiveScene(currentFolderId, visibleFolders);
    setCurrentFolderForScene(nextCurrentFolder, true);
    clearDeckContainers(visibleFolderIds);

    // clear any existing data so we can refresh
    foldersContainer.innerHTML = '';

    if (!visibleFolders.length) {
        printEmptyScene();
        return;
    }

    // Build folder header links
    if (shouldRenderFolderTabs(visibleFolders)) {
        for (let folder of visibleFolders) {
            folderLink(folder.title, folder.id);
        }
        requestAnimationFrame(() => {
            updateFolderRailLayout();
            centerFolderInRail(currentFolder, 'auto');
        });
    }

    // Process the current folder's children first
    const currentChildren = await getChildren(currentFolder);
    await printBookmarks(currentChildren, currentFolder);


    // Process the rest of the folders, if there are more. exclude the current folder
    if (visibleFolders.length > 1) {
        for (let folder of visibleFolders) {
            if (folder.id !== currentFolder) {
                const children = await getChildren(folder.id);
                await printBookmarks(children, folder.id);
            }
        }
    }
}

async function buildFolderPages(swipeDeckId) {
    async function getChildren(folderId) {
        return await chrome.bookmarks.getChildren(folderId);
    }

    normalizeSceneSettings();
    const children = await getChildren(swipeDeckId);
    sceneHomeOptions = children.filter(bookmark => bookmark.url);
    if (!children.length) {
        // new install
        sceneFolderOptions = getSortedDeckFolders(children);
        renderSceneControls();
        setCurrentFolderForScene(swipeDeckId, true);
        clearDeckContainers([swipeDeckId]);
        addFolderButton.style.display = 'none';
        searchBtn.style.display = 'none';
        printNewSetup();
        return;
    }

    const folders = getSortedDeckFolders(children);
    sceneFolderOptions = folders;
    pruneSceneFolderAssignments(folders);
    renderSceneControls();
    const visibleFolders = getVisibleFoldersForActiveScene(folders);
    const nextCurrentFolder = getFolderForActiveScene(currentFolder, visibleFolders);

    if (nextCurrentFolder !== currentFolder || !visibleFolders.length) {
        await buildDialPages(swipeDeckId, nextCurrentFolder);
        return;
    }

    // clear any existing data so we can refresh
    foldersContainer.innerHTML = '';

    // Build folder header links
    if (shouldRenderFolderTabs(visibleFolders)) {
        for (let folder of visibleFolders) {
            folderLink(folder.title, folder.id);
        }
        requestAnimationFrame(() => {
            updateFolderRailLayout();
            centerFolderInRail(currentFolder, 'auto');
        });
    }

    return
}


function removeBookmark(url) {
    let id = targetNode.dataset.id;
    if (currentFolder === swipeDeckId) {
        removeHomeUrlFromSceneAssignments(url || targetTileHref);
    }
    // animate removal
    targetNode.style.display = "none";
    layout(true);
    // remove dial
    targetNode.remove();
    // nb: cache cleanup is handled by handleBookmarkRemoved in background script
    chrome.bookmarks.remove(id).catch(err => {
        console.log(err);
    });
}

function moveFolder(id, oldIndex, newIndex, newSiblingId) {
    let options = {};

    function move(id, options) {
        chrome.bookmarks.move(id, options).then(result => {
            //tabMessagePort.postMessage({ refreshInactive: true })
        }).catch(err => {
            console.log(err);
        })
    }

    if (newSiblingId && newSiblingId !== -1) {
        chrome.bookmarks.get(newSiblingId).then(result => {
            if (oldIndex >= newIndex) {
                options.index = Math.max(0, result[0].index);
            } else {
                options.index = Math.max(0, result[0].index - 1);
                // chrome-only off by 1 bug when moving a bookmark forward
                if (!chrome.runtime.getBrowserInfo) {
                    options.index++;
                }
            }
            move(id, options);
        }).catch(err => {
            console.log(err);
        })
    } else {
        move(id, options);
    }
}

function moveBookmark(id, fromParentId, toParentId, oldIndex, newIndex, newSiblingId) {
    let options = {}

    function move(id, options) {
        chrome.bookmarks.move(id, options).then(result => {
            //tabMessagePort.postMessage({ refreshInactive: true });
        }).catch(err => {
            console.log(err);
        });
    }

    if ((toParentId && fromParentId) && toParentId !== fromParentId) {
        options.parentId = toParentId;
    }

    // todo: refactor
    if (settings.defaultSort === "first") {
        if (newSiblingId && newSiblingId !== -1) {
            chrome.bookmarks.get(newSiblingId).then(result => {
                if (toParentId === fromParentId && oldIndex >= newIndex) {
                    options.index = Math.max(0, result[0].index);
                    // chrome-only off by 1 bug when moving a bookmark forward
                    if (!chrome.runtime.getBrowserInfo) {
                        options.index++;
                    }
                } else {
                    options.index = Math.max(0, result[0].index + 1);
                }
                move(id, options);
            }).catch(err => {
                console.log(err);
            })
        } else {
            if (!newSiblingId) {
                options.index = 0;
            }
            move(id, options);
        }
    } else {
        if (newSiblingId && newSiblingId !== -1) {
            chrome.bookmarks.get(newSiblingId).then(result => {
                if (toParentId !== fromParentId || oldIndex >= newIndex) {
                    options.index = Math.max(0, result[0].index);
                } else {
                    options.index = Math.max(0, result[0].index - 1);
                    // chrome-only off by 1 bug when moving a bookmark forward
                    if (!chrome.runtime.getBrowserInfo) {
                        options.index++;
                    }
                }
                move(id, options);
            }).catch(err => {
                console.log(err);
            })
        } else {
            move(id, options);
        }
    }
}

function userPrefersReducedMotion() {
    return reduceMotionQuery?.matches === true;
}

function getFolderSwitchTiles(folder) {
    if (!folder) return [];
    return Array.from(folder.children).filter(child => child.classList?.contains('tile'));
}

function clearFolderSwitchTileVars(tiles) {
    tiles.forEach(tile => {
        tile.style.removeProperty('--tile-enter-delay');
        tile.style.removeProperty('--tile-exit-delay');
    });
}

function setFolderSwitchDelays(tiles, propertyName, staggerMs, staggerCap) {
    tiles.forEach((tile, index) => {
        const delay = Math.min(index, staggerCap) * staggerMs;
        tile.style.setProperty(propertyName, `${delay}ms`);
    });
}

function clearFolderSwitchMotion(preserveToken = false) {
    if (!preserveToken) {
        folderSwitchEnterToken++;
    }

    if (folderSwitchEnterTimer) {
        clearTimeout(folderSwitchEnterTimer);
        folderSwitchEnterTimer = null;
    }

    if (folderSwitchExitTimer) {
        clearTimeout(folderSwitchExitTimer);
        folderSwitchExitTimer = null;
    }

    clearFolderSwitchTileVars(folderSwitchEnterTiles);
    clearFolderSwitchTileVars(folderSwitchExitTiles);
    folderSwitchEnterTiles = [];
    folderSwitchExitTiles = [];

    for (const activeFolder of Array.from(document.getElementsByClassName(folderSwitchEnterClass))) {
        activeFolder.classList.remove(folderSwitchEnterClass);
    }
    for (const activeFolder of Array.from(document.getElementsByClassName(folderSwitchExitClass))) {
        activeFolder.classList.remove(folderSwitchExitClass);
    }
}

function playFolderSwitchEnter(folder, switchToken = ++folderSwitchEnterToken) {
    if (!folder || userPrefersReducedMotion()) return;

    const tiles = getFolderSwitchTiles(folder);
    if (!tiles.length) return;

    if (folderSwitchEnterTimer) {
        clearTimeout(folderSwitchEnterTimer);
        folderSwitchEnterTimer = null;
    }

    clearFolderSwitchTileVars(folderSwitchEnterTiles);
    folderSwitchEnterTiles = tiles;

    for (const activeFolder of Array.from(document.getElementsByClassName(folderSwitchEnterClass))) {
        activeFolder.classList.remove(folderSwitchEnterClass);
    }

    setFolderSwitchDelays(tiles, '--tile-enter-delay', folderSwitchEnterStaggerMs, folderSwitchEnterStaggerCap);

    requestAnimationFrame(() => {
        if (switchToken !== folderSwitchEnterToken) return;
        folder.classList.add(folderSwitchEnterClass);
    });

    const staggerDuration = Math.min(tiles.length - 1, folderSwitchEnterStaggerCap) * folderSwitchEnterStaggerMs;
    folderSwitchEnterTimer = setTimeout(() => {
        if (switchToken !== folderSwitchEnterToken) return;
        folder.classList.remove(folderSwitchEnterClass);
        clearFolderSwitchTileVars(tiles);
        folderSwitchEnterTiles = [];
        folderSwitchEnterTimer = null;
    }, folderSwitchEnterDuration + staggerDuration + 80);
}

function playFolderSwitchExit(folder, switchToken, onComplete) {
    const tiles = getFolderSwitchTiles(folder);
    if (!folder || userPrefersReducedMotion() || !tiles.length) {
        onComplete();
        return;
    }

    if (folderSwitchExitTimer) {
        clearTimeout(folderSwitchExitTimer);
        folderSwitchExitTimer = null;
    }

    clearFolderSwitchTileVars(folderSwitchExitTiles);
    folderSwitchExitTiles = tiles;
    setFolderSwitchDelays(tiles, '--tile-exit-delay', folderSwitchExitStaggerMs, folderSwitchExitStaggerCap);
    folder.classList.remove(folderSwitchEnterClass);

    requestAnimationFrame(() => {
        if (switchToken !== folderSwitchEnterToken) return;
        folder.classList.add(folderSwitchExitClass);
    });

    const staggerDuration = Math.min(tiles.length - 1, folderSwitchExitStaggerCap) * folderSwitchExitStaggerMs;
    folderSwitchExitTimer = setTimeout(() => {
        if (switchToken !== folderSwitchEnterToken) return;
        folder.classList.remove(folderSwitchExitClass);
        clearFolderSwitchTileVars(tiles);
        folderSwitchExitTiles = [];
        folderSwitchExitTimer = null;
        onComplete();
    }, folderSwitchExitDuration + staggerDuration + 40);
}

function updateActiveFolderTitle(id) {
    let folderTitles = document.getElementsByClassName('folderTitle');
    for (let title of folderTitles) {
        if (title.attributes.folderid.value === id) {
            title.classList.add('activeFolder');
        } else {
            title.classList.remove('activeFolder');
        }
    }
}

function revealFolder(id, folders, shouldAnimateEntry, switchToken) {
    for (let folder of folders) {
        if (folder.id === id) {
            folder.style.display = "flex";
            folder.style.opacity = "1";
            layoutFolder = true;
            if (shouldAnimateEntry) {
                playFolderSwitchEnter(folder, switchToken);
            }
            requestAnimationFrame(animate);
        } else {
            folder.style.display = "none";
        }
    }
}

function showFolder(id) {
    hideSettings();
    const folders = Array.from(document.getElementsByClassName('container'));
    const shouldAnimateSwitch = currentFolder && currentFolder !== id && !userPrefersReducedMotion();
    const visibleFolder = folders.find(folder => folder.id !== id && folder.style.display !== "none");
    const switchToken = ++folderSwitchEnterToken;

    clearFolderSwitchMotion(true);
    updateActiveFolderTitle(id);

    if (shouldAnimateSwitch && visibleFolder) {
        playFolderSwitchExit(visibleFolder, switchToken, () => {
            if (switchToken !== folderSwitchEnterToken) return;
            revealFolder(id, folders, true, switchToken);
        });
    } else {
        revealFolder(id, folders, false, switchToken);
    }
}

function selectFolder(id, options = {}) {
    if (!id) return false;

    const keepRailPreview = options.keepRailPreview === true;

    if (!keepRailPreview) {
        clearFolderRailPreview();
    }
    showFolder(id);
    currentFolder = id;
    scrollPos = 0;
    bookmarksContainerParent.scrollTop = scrollPos;
    if (!options.skipRailScroll) {
        centerFolderInRail(id);
    }

    if (settings) {
        settings.currentFolder = id;
        chrome.storage.local.set({ settings });
    }

    if (keepRailPreview) {
        requestAnimationFrame(clearFolderRailPreview);
    }

    return true;
}

function normalizeWheelDelta(delta, deltaMode) {
    if (deltaMode === WheelEvent.DOM_DELTA_LINE) {
        return delta * 16;
    }
    if (deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        return delta * window.innerWidth;
    }
    return delta;
}

function getFolderTitleElements() {
    return Array.from(document.querySelectorAll('.folderTitle'));
}

function getFolderIndex(folderId) {
    const folders = getFolderTitleElements();
    return folders.findIndex(folder => folder.getAttribute('folderid') === folderId);
}

function getFolderRailStepSize(folders) {
    if (!folders.length) return 48;
    const totalWidth = folders.reduce((sum, folder) => sum + folder.getBoundingClientRect().width, 0);
    const averageWidth = totalWidth / folders.length;
    return Math.max(34, Math.min(64, averageWidth * 0.42));
}

function getFolderRailMaxScroll() {
    if (!foldersRail) return 0;
    return Math.max(0, foldersRail.scrollWidth - foldersRail.clientWidth);
}

function getFolderVisibleScrollLeft(folder) {
    if (!foldersRail || !folder) return 0;

    const railRect = foldersRail.getBoundingClientRect();
    const folderRect = folder.getBoundingClientRect();
    const inset = 16;
    let nextScrollLeft = foldersRail.scrollLeft;

    if (folderRect.left < railRect.left + inset) {
        nextScrollLeft -= (railRect.left + inset) - folderRect.left;
    } else if (folderRect.right > railRect.right - inset) {
        nextScrollLeft += folderRect.right - (railRect.right - inset);
    }

    return Math.min(getFolderRailMaxScroll(), Math.max(0, nextScrollLeft));
}

function updateFolderRailEdgeState() {
    if (!foldersRail) return;
    const maxScroll = getFolderRailMaxScroll();
    document.body.classList.toggle('folderRailAtStart', foldersRail.scrollLeft <= 1);
    document.body.classList.toggle('folderRailAtEnd', foldersRail.scrollLeft >= maxScroll - 1);
}

function updateFolderRailLayout() {
    requestAnimationFrame(updateFolderRailEdgeState);
}

function getPointerPoint(event) {
    const pointer = event?.touches?.[0] || event?.changedTouches?.[0] || event;
    if (!pointer || typeof pointer.clientX !== 'number' || typeof pointer.clientY !== 'number') {
        return null;
    }

    return {
        x: pointer.clientX,
        y: pointer.clientY,
    };
}

function setFolderDragGrabOffset(event, item) {
    const point = getPointerPoint(event);
    if (!point || !item) {
        folderDragGrabOffset = null;
        return;
    }

    const rect = item.getBoundingClientRect();
    folderDragGrabOffset = {
        x: point.x - rect.left,
        y: point.y - rect.top,
    };
}

function syncFolderDragFallback(event) {
    const point = getPointerPoint(event);
    const fallback = document.querySelector('.folderSortFallback');
    if (!point || !fallback) return;

    const offset = folderDragGrabOffset || {
        x: fallback.offsetWidth / 2,
        y: fallback.offsetHeight / 2,
    };

    fallback.style.left = `${point.x - offset.x}px`;
    fallback.style.top = `${point.y - offset.y}px`;
    fallback.style.transform = 'none';
}

function startFolderDragPointerSync(event) {
    stopFolderDragPointerSync?.();

    const update = pointerEvent => syncFolderDragFallback(pointerEvent);
    document.addEventListener('pointermove', update);
    document.addEventListener('mousemove', update);
    document.addEventListener('touchmove', update, { passive: true });

    stopFolderDragPointerSync = () => {
        document.removeEventListener('pointermove', update);
        document.removeEventListener('mousemove', update);
        document.removeEventListener('touchmove', update);
        stopFolderDragPointerSync = null;
    };

    requestAnimationFrame(() => syncFolderDragFallback(event));
}

function stopFolderDragSync() {
    stopFolderDragPointerSync?.();
    folderDragGrabOffset = null;
}

function centerFolderInRail(folderId, behavior = 'smooth') {
    const folder = document.querySelector(`.folderTitle[folderid="${folderId}"]`);
    if (!foldersRail || !folder) return;

    foldersRail.scrollTo({
        left: getFolderVisibleScrollLeft(folder),
        behavior
    });
    requestAnimationFrame(updateFolderRailEdgeState);
}

function getNearestFolderToRailFocus() {
    if (!foldersRail) return null;

    const folders = getFolderTitleElements();
    if (!folders.length) return null;

    let nearest = null;
    let nearestDistance = Infinity;
    const railRect = foldersRail.getBoundingClientRect();
    const focusX = railRect.left + Math.min(railRect.width * 0.45, 360);

    for (let folder of folders) {
        const rect = folder.getBoundingClientRect();
        const distance = Math.abs((rect.left + rect.width / 2) - focusX);
        if (distance < nearestDistance) {
            nearest = folder;
            nearestDistance = distance;
        }
    }

    return nearest;
}

function clearFolderRailPreview() {
    clearFolderRailPreviewVisuals();
    folderRailScrubStartIndex = null;
    folderRailScrubDelta = 0;
}

function clearFolderRailPreviewVisuals() {
    document.body.classList.remove('folderRailScrubbing');
    document.querySelectorAll('.folderTitle.scrubPreviewFolder').forEach(folder => {
        folder.classList.remove('scrubPreviewFolder');
    });
    folderRailScrubTarget = null;
}

function updateFolderRailPreview(folder, behavior = 'smooth') {
    if (!folder) return null;
    const nextTarget = folder.getAttribute('folderid');
    if (nextTarget === folderRailScrubTarget) {
        centerFolderInRail(nextTarget, behavior);
        return folder;
    }

    document.body.classList.add('folderRailScrubbing');
    document.querySelectorAll('.folderTitle.scrubPreviewFolder').forEach(previewFolder => {
        previewFolder.classList.remove('scrubPreviewFolder');
    });
    folder.classList.add('scrubPreviewFolder');
    folderRailScrubTarget = nextTarget;
    centerFolderInRail(nextTarget, behavior);

    return folder;
}

function commitFolderRailScrub() {
    const nearest = folderRailScrubTarget
        ? document.querySelector(`.folderTitle[folderid="${folderRailScrubTarget}"]`)
        : null;
    if (!nearest) {
        clearFolderRailPreview();
        return;
    }

    const targetId = nearest.getAttribute('folderid');
    selectFolder(targetId, {
        keepRailPreview: true,
        skipRailScroll: true,
    });
}

function shouldIgnoreFolderRailWheel(event) {
    if (searchContainer.classList.contains('active') || document.body.classList.contains('folderRailDragging')) return true;

    const target = event.target;
    if (!target || !target.closest) return false;

    return target.closest('.modal')
        || target.closest('.sidenav')
        || target.closest('.menu')
        || target.closest('input, textarea, select, button')
        || target.closest('#addFolderButton')
        || target.closest('.settingsCtl')
        || document.getElementById('foldersContainer').classList.contains('folders-drag-active');
}

function handleFolderRailWheel(event) {
    if (shouldIgnoreFolderRailWheel(event) || !foldersRail) return;

    const deltaX = normalizeWheelDelta(event.deltaX, event.deltaMode);
    const deltaY = normalizeWheelDelta(event.deltaY, event.deltaMode);

    if (Math.abs(deltaX) < 3 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) {
        return;
    }

    const folders = getFolderTitleElements();
    if (folders.length <= 1) return;

    event.preventDefault();
    if (getFolderRailMaxScroll() > 0) {
        foldersRail.scrollLeft += deltaX;
    }

    if (folderRailScrubStartIndex === null) {
        folderRailScrubStartIndex = getFolderIndex(folderRailScrubTarget || currentFolder);
        if (folderRailScrubStartIndex < 0) {
            folderRailScrubStartIndex = 0;
        }
    }

    folderRailScrubDelta += deltaX;
    const stepSize = getFolderRailStepSize(folders);
    const indexOffset = Math.round(folderRailScrubDelta / stepSize);
    const rawTargetIndex = folderRailScrubStartIndex + indexOffset;
    const targetIndex = Math.min(
        folders.length - 1,
        Math.max(0, rawTargetIndex)
    );

    if (rawTargetIndex < 0) {
        folderRailScrubDelta = -folderRailScrubStartIndex * stepSize;
    } else if (rawTargetIndex > folders.length - 1) {
        folderRailScrubDelta = (folders.length - 1 - folderRailScrubStartIndex) * stepSize;
    }

    if (targetIndex === folderRailScrubStartIndex) {
        clearTimeout(folderRailSettleTimeout);
        requestAnimationFrame(() => {
            updateFolderRailEdgeState();
            clearFolderRailPreviewVisuals();
        });
        return;
    }

    requestAnimationFrame(() => {
        updateFolderRailEdgeState();
        updateFolderRailPreview(folders[targetIndex], 'auto');
    });

    clearTimeout(folderRailSettleTimeout);
    folderRailSettleTimeout = setTimeout(commitFolderRailScrub, folderRailSettleDelay);
}

function getThumbs(bookmarkUrl) {
    return chrome.storage.local.get(bookmarkUrl)
        .then(result => {
            if (result[bookmarkUrl]) {
                return result[bookmarkUrl];
            }
        });
}

function printFolderBookmarks() {
    for (let folder of folders) {
        getBookmarks(folder)
    }
}

function folderLink(title, id) {
    let a = document.createElement('a');
    if (id === swipeDeckId) {
        a.id = "homeFolderLink";
    }
    //a.classList.add('tile');
    a.classList.add('folderTitle');
    a.setAttribute('folderId', id);
    let linkText = document.createElement('span');
    linkText.classList.add('folderTitleText');
    linkText.textContent = title;
    a.appendChild(linkText);
    //a.href = "#"+bookmark.id;
    a.onclick = function () {
        selectFolder(id);
        //tabMessagePort.postMessage({currentFolder: id});
    };

    a.ondragenter = dragenterHandler;
    a.ondragleave = dragleaveHandler;

    foldersContainer.appendChild(a);
}

function createFolder() {
    hideSettings();
    createFolderModalName.value = '';
    createFolderModalName.focus();
    createFolderModal.style.transform = "translateX(0%)";
    createFolderModal.style.opacity = "1";
    createFolderModalContent.style.transform = "scale(1)";
    createFolderModalContent.style.opacity = "1";
}

function saveFolder() {
    let name = createFolderModalName.value.trim();

    if (name.length) {
        chrome.bookmarks.create({
            title: name,
            parentId: swipeDeckId
        }).then(node => {
            if (!assignFolderToActiveScene(node)) {
                processRefresh();
            }
            hideModals();
        });
    } else {
        hideModals();
    }
}

function editFolder() {
    let title = editFolderModalName.value.trim();
    chrome.bookmarks.update(targetFolder, {
        title
    }).then(node => {
        hideModals();
    }).catch(err => {
        console.log(err);
    });
}

function refreshThumbnails(url, tileid) {
    //tabMessagePort.postMessage({refreshThumbs: true, url});
    // the div id is "folderid-boookmarkid"
    let parentId = tileid.split("-")[0];
    let id = tileid.split("-")[1];

    showToast(i18n('capturingImages'))
    // gives the ui time to animate before blocking the process with the bg work
    setTimeout(() => {
        chrome.runtime.sendMessage({ target: 'background', type: 'refreshThumbs', data: { url, id, parentId } });
    }, 200);
}

function removeFolder() {
    chrome.bookmarks.removeTree(targetFolder).then(() => {
        hideModals();
        targetFolderLink?.remove();
        removeFolderFromSceneAssignments(targetFolder, targetFolderName);
        folders.splice(folders.indexOf(targetFolder), 1);
        if (!folders.length) {
            //document.getElementById('homeFolderLink').remove();
            // todo: better manager this state
        }

        if (currentFolder === targetFolder) {
            currentFolder = swipeDeckId;;
            bookmarksContainerParent.scrollTop = scrollPos;
            showFolder(swipeDeckId);
            settings.currentFolder = swipeDeckId;
            chrome.storage.local.set({ settings })
        }

        // todo: clean up this node or do it on refresh
        // document.getElementById(targetFolder).remove();
        processRefresh();
    });
}

function getChildren(folderId) {
    return new Promise((resolve, reject) => {
        chrome.bookmarks.getChildren(folderId).then(children => {
            resolve(children);
        });
    });
}

function refreshAllThumbnails() {
    let bookmarks = [];
    if (!currentFolder) {
        hideModals();
        return;
    }
    let parent = currentFolder;

    hideModals();

    chrome.bookmarks.getChildren(parent).then(children => {
        if (children && children.length) {
            for (let child of children) {
                if (child.url && (child.url.startsWith('https://') || child.url.startsWith('http://') || child.url.startsWith('file://') || child.url.startsWith('chrome://'))) {
                    //urls.push(child.url);
                    // push an object with the url and the id
                    bookmarks.push({ url: child.url, id: child.id, parentId: child.parentId });
                }
            }
            //tabMessagePort.postMessage({refreshAll: true, urls});
            showToast(i18n('capturingImages'))
            // gives the ui time to animate before blocking the process with the bg work
            setTimeout(() => {
                chrome.runtime.sendMessage({ target: 'background', type: 'refreshAllThumbs', data: { bookmarks } });
            }, 200);
        }
    }).catch(err => {
        console.log(err);
    });
}


// assumes 'bookmarks' param is content of a folder (from getBookmarks)
function batchInsert(parent, fragment, batchSize = 100, onComplete) {
    const nodes = Array.from(fragment.childNodes);
    let index = 0;

    function insertBatch() {
        let slice = nodes.slice(index, index + batchSize);
        parent.append(...slice);
        index += batchSize;

        if (index < nodes.length) {
            requestAnimationFrame(insertBatch);
        } else if (onComplete) {
            requestAnimationFrame(onComplete); // Ensures it runs after DOM updates
        }
    }

    insertBatch();
}

async function printNewSetup() {
    console.log("new install")
    let fragment = document.createDocumentFragment();

    // Ensure the container exists
    let folderContainerEl = document.getElementById(swipeDeckId);
    if (!folderContainerEl) {
        folderContainerEl = document.createElement('div');
        folderContainerEl.id = swipeDeckId;
        folderContainerEl.classList.add('container');
        folderContainerEl.style.display = currentFolder === swipeDeckId ? 'flex' : 'none';
        //folderContainerEl.style.opacity = settings.rememberFolder && currentFolder === parentId ? '0' : '1';
        folderContainerEl.style.opacity = currentFolder === swipeDeckId ? "1" : "0";

        if (currentFolder === swipeDeckId) {
            requestAnimationFrame(animate);
            document.querySelector(`[folderid="${currentFolder}"]`)?.classList.add('activeFolder');
            requestAnimationFrame(() => centerFolderInRail(currentFolder, 'auto'));
        }
        bookmarksContainerParent.append(folderContainerEl);
    }

    const noBookmarksDiv = document.createElement('div');
    noBookmarksDiv.className = 'default-content';
    noBookmarksDiv.id = 'noBookmarks';
    noBookmarksDiv.innerHTML = `
        <h1 class="default-content" data-locale="newInstall1">${chrome.i18n.getMessage('newInstall1')}</h1>
        <p class="default-content helpText" data-locale="newInstall2">${chrome.i18n.getMessage('newInstall2')}</p>
        <p class="default-content helpText" data-locale="newInstall3">${chrome.i18n.getMessage('newInstall3')}</p>
        <p class="default-content helpText" data-locale="newInstall4">${chrome.i18n.getMessage('newInstall4')}</p>
        <div class="cta-container">
        <p id="splashImport" class="default-content helpText cta" >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z"/></svg>
            Import
        </p>
        <p id="splashAddDial" class="default-content helpText cta" >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
        Add Site
        </p>
        </div>
    `;
    fragment.appendChild(noBookmarksDiv);

    // Optimize container update using batch insert
    folderContainerEl.textContent = ''; // Clears old content efficiently
    folderContainerEl.append(fragment);

    bookmarksContainerParent.scrollTop = scrollPos;
}

function createNewDialButton(parentId) {
    let aNewDial = document.createElement('a');
    aNewDial.classList.add('tile', 'createDial');
    aNewDial.onclick = () => {
        hideSettings();
        if (buildCreateDialModal(parentId)) {
            modalShowEffect(createDialModalContent, createDialModal);
        }
    };

    let main = document.createElement('div');
    main.classList.add('tile-main');

    let content = document.createElement('div');
    content.classList.add('tile-content', 'createDial-content');
    main.appendChild(content);
    aNewDial.appendChild(main);

    return aNewDial;
}

function getFaviconUrl(pageUrl, size = 64) {
    if (!pageUrl || pageUrl.startsWith('file:')) {
        return chrome.runtime.getURL('icons/icon64.png');
    }

    const faviconUrl = new URL(chrome.runtime.getURL('/_favicon/'));
    faviconUrl.searchParams.set('pageUrl', pageUrl);
    faviconUrl.searchParams.set('size', size.toString());
    return faviconUrl.toString();
}

function isSupportedBookmarkUrl(url) {
    return url?.startsWith("http")
        || url?.startsWith("file:")
        || url?.startsWith("chrome:");
}

function createBookmarkTile(bookmark, extraClass = '') {
    let a = document.createElement('a');
    a.classList.add('tile');
    if (extraClass) {
        a.classList.add(...extraClass.split(' ').filter(Boolean));
    }
    a.href = bookmark.url;
    a.setAttribute('data-id', bookmark.id);

    let main = document.createElement('div');
    main.classList.add('tile-main');

    let content = document.createElement('div');
    content.setAttribute('id', bookmark.parentId + "-" + bookmark.id);
    content.classList.add('tile-content', 'favicon-thumb');
    content.style.backgroundImage = `url("${getFaviconUrl(bookmark.url)}")`;

    let title = document.createElement('div');
    title.classList.add('tile-title');
    if (!settings.showTitles) {
        title.classList.add('hide');
    }
    title.textContent = bookmark.title || bookmark.url;

    main.append(content, title);
    a.appendChild(main);
    return a;
}

function ensureFolderContainer(parentId, extraClass = '') {
    let folderContainerEl = document.getElementById(parentId);
    if (!folderContainerEl) {
        folderContainerEl = document.createElement('div');
        folderContainerEl.id = parentId;
        folderContainerEl.classList.add('container');
        folderContainerEl.style.display = currentFolder === parentId ? 'flex' : 'none';
        folderContainerEl.style.opacity = currentFolder === parentId ? "1" : "0";

        if (currentFolder === parentId) {
            requestAnimationFrame(animate);
            document.querySelector(`[folderid="${currentFolder}"]`)?.classList.add('activeFolder');
        }
        bookmarksContainerParent.append(folderContainerEl);
    }

    if (extraClass) {
        folderContainerEl.classList.add(...extraClass.split(' ').filter(Boolean));
    }

    return folderContainerEl;
}

function createSmartHomeSection(titleText, className = '') {
    const section = document.createElement('section');
    section.className = `smartHomeSection ${className}`.trim();

    const header = document.createElement('div');
    header.className = 'smartHomeSectionHeader';

    const title = document.createElement('h2');
    title.className = 'smartHomeTitle';
    title.textContent = titleText;
    header.appendChild(title);
    section.appendChild(header);

    return section;
}

function getHomeBookmarksForScene(bookmarks) {
    const homeBookmarks = bookmarks.filter(bookmark => bookmark.url && isSupportedBookmarkUrl(bookmark.url));
    const activeScene = getActiveScene();
    if (activeScene === sceneAll) {
        return homeBookmarks;
    }

    return homeBookmarks.filter(bookmark => evaluateSceneVisibility(getBookmarkRuleContext(bookmark), activeScene).visible);
}

function matchesScenePattern(value, patterns) {
    const haystack = String(value || '').toLowerCase();
    return patterns.some(pattern => haystack.includes(pattern.toLowerCase()));
}

function isSupportedRecentPageUrl(url) {
    if (!url || url.startsWith(chrome.runtime.getURL('')) || url === 'chrome://newtab/') {
        return false;
    }
    return isSupportedBookmarkUrl(url);
}

async function getRecentHistoryItems() {
    if (!chrome.history?.search) {
        return [];
    }

    const startTime = Date.now() - smartHomeRecentHistoryDays * 24 * 60 * 60 * 1000;
    const items = await chrome.history.search({
        text: '',
        startTime,
        maxResults: smartHomeRecentHistoryFetchLimit,
    }).catch(() => []);

    return items
        .filter(item => isSupportedRecentPageUrl(item.url))
        .map(item => ({
            id: item.id || item.url,
            title: item.title,
            url: item.url,
            favIconUrl: getFaviconUrl(item.url, 32),
            lastAccessed: item.lastVisitTime || null,
        }));
}

function filterRecentPageItems(items, scene) {
    const seen = new Set();
    const filtered = [];

    for (const item of items) {
        if (!item.url || !isSupportedRecentPageUrl(item.url)) continue;
        if (seen.has(item.url)) continue;
        if (!evaluateSceneVisibility(getTabRuleContext(item), scene.id).visible) continue;
        seen.add(item.url);
        filtered.push(item);
        if (filtered.length >= smartHomeRecentLimit) break;
    }

    return filtered;
}

function formatRelativeTime(timestamp) {
    if (!timestamp) return '';
    const diffMinutes = Math.max(1, Math.round((Date.now() - timestamp) / 60000));
    if (diffMinutes < 60) return `${diffMinutes}m`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.round(diffHours / 24)}d`;
}

function createRecentPageLink(item) {
    const link = document.createElement('a');
    link.className = 'smartHomeRecentItem';
    link.href = item.url;
    link.setAttribute('data-id', item.id || item.url);

    const icon = document.createElement('span');
    icon.className = 'smartHomeRecentIcon';
    icon.style.backgroundImage = `url("${item.favIconUrl}")`;

    const text = document.createElement('span');
    text.className = 'smartHomeRecentText';

    const title = document.createElement('span');
    title.className = 'smartHomeRecentTitle';
    title.textContent = item.title || item.url;

    const url = document.createElement('span');
    url.className = 'smartHomeRecentUrl';
    url.textContent = item.url;

    text.append(title, url);

    const time = document.createElement('span');
    time.className = 'smartHomeRecentTime';
    time.textContent = formatRelativeTime(item.lastAccessed);

    link.append(icon, text, time);
    return link;
}

function getBrowserHistoryUrl() {
    const userAgent = navigator.userAgent || '';
    if (userAgent.includes('Firefox/')) return 'about:history';
    if (userAgent.includes('Edg/')) return 'edge://history/all';
    if (userAgent.includes('OPR/') || userAgent.includes('Opera/')) return 'opera://history';
    return 'chrome://history';
}

function createOpenHistoryButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'settingsCtl smartHomeHistoryButton';
    button.textContent = i18n('openFullHistory');
    button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        chrome.tabs.create({ url: getBrowserHistoryUrl() });
    });
    return button;
}

async function renderRecentPagesSection(parent, scene) {
    const section = createSmartHomeSection(i18n('smartHomeRecent'), 'smartHomeRecentSection');
    section.querySelector('.smartHomeSectionHeader')?.appendChild(createOpenHistoryButton());
    parent.appendChild(section);

    if (!chrome.history?.search) {
        const message = document.createElement('p');
        message.className = 'smartHomeEmpty';
        message.textContent = i18n('recentUnavailable');
        section.appendChild(message);
        return;
    }

    const recentItems = filterRecentPageItems(await getRecentHistoryItems(), scene);
    if (!recentItems.length) {
        const message = document.createElement('p');
        message.className = 'smartHomeEmpty';
        message.textContent = i18n('recentEmpty');
        section.appendChild(message);
        return;
    }

    const list = document.createElement('div');
    list.className = 'smartHomeRecentList';
    recentItems.forEach(item => list.appendChild(createRecentPageLink(item)));
    section.appendChild(list);
}

function renderSmartHomeSearch(parent) {
    const section = createSmartHomeSection(i18n('smartHomeSearch'), 'smartHomeSearchSection');
    const form = document.createElement('form');
    form.className = 'smartHomeSearchForm settingsCtl';

    const input = document.createElement('input');
    input.className = 'smartHomeSearchInput settingsCtl';
    input.type = 'text';
    input.placeholder = i18n('searchPlaceholder');
    input.setAttribute('aria-label', i18n('smartHomeSearch'));

    const submit = document.createElement('button');
    submit.className = 'smartHomeSearchSubmit settingsCtl';
    submit.type = 'submit';
    submit.title = i18n('smartHomeSearch');
    submit.setAttribute('aria-label', i18n('smartHomeSearch'));
    submit.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>';

    form.addEventListener('submit', async event => {
        event.preventDefault();
        const searchTerm = input.value.trim();
        if (searchTerm) {
            await queryDefaultSearch(searchTerm);
        }
    });

    form.append(input, submit);
    section.appendChild(form);
    parent.appendChild(section);
}

async function printSmartHome(bookmarks, parentId) {
    const folderContainerEl = ensureFolderContainer(parentId, 'smartHomeContainer');
    folderContainerEl.textContent = '';

    const smartHome = document.createElement('div');
    smartHome.className = 'smartHome';

    const sceneRules = getSceneRules(getActiveScene());

    if (sceneRules.modules.searchEnabled) {
        renderSmartHomeSearch(smartHome);
    }

    const fixedBookmarks = getHomeBookmarksForScene(bookmarks);
    if (sceneRules.modules.homeBookmarksEnabled && (fixedBookmarks.length || settings.showAddSite)) {
        const fixedSection = createSmartHomeSection(i18n('homeBookmarks'), 'smartHomeBookmarksSection');
        const grid = document.createElement('div');
        grid.className = 'smartHomeTileGrid';
        fixedBookmarks.forEach(bookmark => grid.appendChild(createBookmarkTile(bookmark, 'smartHomeTile')));
        if (settings.showAddSite) {
            grid.appendChild(createNewDialButton(parentId));
        }
        fixedSection.appendChild(grid);
        smartHome.appendChild(fixedSection);
    }

    if (sceneRules.modules.recentTabsEnabled) {
        await renderRecentPagesSection(smartHome, sceneRules);
    }

    if (!smartHome.children.length) {
        const emptyContent = document.createElement('div');
        emptyContent.className = 'default-content';

        const title = document.createElement('h1');
        title.className = 'default-content';
        title.textContent = i18n('sceneEmptyTitle');

        const message = document.createElement('p');
        message.className = 'default-content helpText';
        message.textContent = i18n('sceneEmptyMessage');

        emptyContent.append(title, message);
        smartHome.appendChild(emptyContent);
    }

    folderContainerEl.appendChild(smartHome);
    bookmarksContainerParent.scrollTop = scrollPos;
}

async function printBookmarks(bookmarks, parentId) {
    if (parentId === swipeDeckId) {
        await printSmartHome(bookmarks, parentId);
        return;
    }

    let fragment = document.createDocumentFragment();

    // Collect URLs for batch thumbnail fetching
    //let urls = bookmarks.filter(b => b.url?.startsWith("http")).map(b => b.url);

    // lets message the background script to do it  
    
    // reverse the bookmarks if settings.defaultSort === "first")
    if (settings.defaultSort === "first") {
        bookmarks = bookmarks.reverse();
    }
    chrome.runtime.sendMessage({target: 'background', type: 'getThumbs', data: bookmarks})
    //let thumbnails = await chrome.storage.local.get(urls);

    // Process bookmarks
    if (bookmarks) {
        for (let bookmark of bookmarks) {
            if (!bookmark.url && bookmark.title && bookmark.parentId === swipeDeckId) continue;

            if (isSupportedBookmarkUrl(bookmark.url)) {
                fragment.appendChild(createBookmarkTile(bookmark));
            }
        }
    }

    let newDialButton = createNewDialButton(parentId);

    if (settings.defaultSort !== "first") {
        fragment.appendChild(newDialButton);
    } else {
        fragment.insertBefore(newDialButton, fragment.firstChild);
    }

    // Ensure the container exists
    let folderContainerEl = ensureFolderContainer(parentId);

    // Destroy any previous Sortable instance to avoid duplicate event handlers after refresh
    let existingSortable = Sortable.get(folderContainerEl);
    if (existingSortable) {
        existingSortable.destroy();
    }

    // Sortable configuration
    new Sortable(folderContainerEl, {
        group: 'shared',
        animation: 160,
        ghostClass: 'selected',
        dragClass: 'dragging',
        filter: ".createDial",
        delay: 500,
        delayOnTouchOnly: true,
        onMove: onMoveHandler,
        onEnd: onEndHandler
    });

    // Sorting optimization (this is done now?)
    /*
    if (settings.defaultSort === "first") {
        Array.from(fragment.childNodes).reverse().forEach(node => fragment.appendChild(node));
    }
        */

    // Optimize container update using batch insert
    folderContainerEl.textContent = ''; // todo: is this even required here? would innerHTML = '' be preferable?
    batchInsert(folderContainerEl, fragment)

    bookmarksContainerParent.scrollTop = scrollPos;
}

function showContextMenu(el, top, left) {
    if ((document.body.clientWidth - left) < (el.clientWidth + 30)) {
        el.style.left = (left - el.clientWidth) + 'px';
    } else {
        el.style.left = left + 'px';
    }
    if ((document.body.clientHeight - top) < (el.clientHeight + 30)) {
        el.style.top = (top - el.clientHeight) + 'px';
    } else {
        el.style.top = top + 'px';
    }
    el.style.visibility = "visible";
    el.style.opacity = "1";
}

function hideMenus() {
    let menus = [menu, settingsMenu, folderMenu]
    for (let el of menus) {
        el.style.visibility = "hidden";
        el.style.opacity = "0";
    }
}

function openSettings() {
    renderSceneControls();
    sidenav.style.boxShadow = "0px 2px 8px 0px rgba(0,0,0,0.5)";
    sidenav.style.transform = "translateX(0%)";
}

function hideSettings() {
    sidenav.style.transform = "translateX(100%)";
    sidenav.style.boxShadow = "none";
}

function hideModals() {
    let modals = [modal, createDialModal, createFolderModal, editFolderModal, deleteFolderModal, refreshAllModal, importExportModal];
    let modalContents = [modalContent, createDialModalContent, createFolderModalContent, editFolderModalContent, deleteFolderModalContent, refreshAllModalContent, importExportModalContent]

    for (let button of document.getElementsByTagName('button')) {
        button.blur();
    }

    for (let input of document.getElementsByTagName('input')) {
        input.blur();
    }

    for (let el of modalContents) {
        el.style.transform = "scale(0.8)";
        el.style.opacity = "0";
    }

    for (let el of modals) {
        el.style.opacity = "0";
        setTimeout(function () {
            el.style.transform = "translateX(100%)";
        }, 160);
    }

    // Reset modalBtnContainer and imageUrlContainer
    document.getElementById('modalBtnContainer').style.display = 'flex';
    document.getElementById('imageUrlContainer').style.display = 'none';
    modalImageURLInput.value = '';

    // hide search
    hideSearch();

}

function modalShowEffect(contentEl, modalEl) {
    modalEl.style.transform = "translateX(0%)";
    modalEl.style.opacity = "1";
    contentEl.style.transform = "scale(1)";
    contentEl.style.opacity = "1";
}

function hideToast() {
    if (isToastVisible) {
        toast.style.transform = "translateX(100%)";
        toast.classList.remove('visible');
        toastContent.innerText = '';
        isToastVisible = false;
    }
}

function showToast(message) {
    if (!isToastVisible) {
        toastContent.innerText = message;
        toast.classList.add('visible');
        toast.style.transform = "translateX(0%)";
        isToastVisible = true;
    }
}

function buildCreateDialModal(parentId) {
    if (!parentId) {
        showToast(i18n('sceneEmptyTitle'));
        return false;
    }
    createDialModalURL.value = '';
    createDialModalURL.parentId = parentId;
    createDialModalURL.focus();
    return true;
}

async function buildModal(url, title) {
    // nuke any previous modal
    let carousel = document.getElementById("carousel");
    if (carousel) {
        modalImgContainer.removeChild(carousel);
    }

    let customCarousel = document.getElementById("customCarousel");
    if (customCarousel) {
        modalImgContainer.removeChild(customCarousel);
    }

    let newCarousel = document.createElement('div');
    newCarousel.setAttribute('id', 'carousel');
    modalImgContainer.appendChild(newCarousel);

    //let createdCarousel = document.getElementById('carousel');
    modalTitle.value = title;
    modalURL.value = url;
    let images = await getThumbs(url);
    if (images && images.thumbnails.length) {
        // clunky af
        let index = images.thumbIndex;
        let imgDiv = document.createElement('div');
        let img = document.createElement('img');
        img.crossOrigin = 'Anonymous';
        img.setAttribute('src', images.thumbnails[index]);
        img.style.width = 'auto';
        img.style.height = '144px';
        img.style.objectFit = 'contain';
        img.style.maxWidth = '260px';
        img.onerror = function () {
            img.setAttribute('src', 'img/default.png'); // todo: image is borked, cleanup
        };
        imgDiv.appendChild(img);

        img.onload = function () {
            // read the bg color and set the color picker preview
            // todo: stop storing bg in gradient format jesus
            let bgColor = cssGradientToHex(images.bgColor);
            if (bgColor) {
                setInputValue(modalBgColorPickerInput, rgbToHex(bgColor))
            }
        }

        newCarousel.appendChild(imgDiv);
        for (let [i, image] of images.thumbnails.entries()) {
            if (i !== index) {
                let imgDiv = document.createElement('div');
                let img = document.createElement('img');
                img.crossOrigin = 'Anonymous';
                img.setAttribute('src', image);
                img.style.width = 'auto';
                img.style.height = '144px';
                img.style.objectFit = 'contain';
                img.style.maxWidth = '260px';
                img.onerror = function () {
                    img.setAttribute('src', 'img/default.png'); // todo: cleanup
                };
                imgDiv.appendChild(img);
                newCarousel.appendChild(imgDiv);
            }
        }
        $('#carousel').flexCarousel({ height: '180px' });

        // listen for carousel navigation to updade the bg color button preview
        let fcNext = document.querySelector('.fc-next');
        if (fcNext) {
            fcNext.addEventListener('click', function () {
                let cc = document.getElementById('customCarousel');
                if (cc) {
                    selectedImageSrc = customCarousel.children[0].src;
                    let bgColor = getBgColor(customCarousel.children[0]);
                    if (bgColor) {
                        setInputValue(modalBgColorPickerInput, rgbToHex(bgColor))
                    }
                } else {
                    let imageNodes = document.getElementsByClassName('fc-slide');
                    for (let node of imageNodes) {
                        // div with order "2" is the one being displayed by the carousel
                        if (node.style.order === '2') {
                            
                            // sometimes the carousel puts images inside a <figure class="fc-image"> elem
                            if (node.children[0].className === "fc-image") {
                                //selectedImageSrc = node.children[0].children[0].src;
                                let bgColor = getBgColor(node.children[0].children[0]);
                                if (bgColor) {
                                    //setInputValue(modalBgColorPickerInput, rgbToHex(bgColor))
                                    setInputValue(modalBgColorPickerInput, rgbToHex(bgColor))
                                }
                            } else {
                                //selectedImageSrc = node.children[0].src;
                                let bgColor = getBgColor(node.children[0]);
                                if (bgColor) {
                                    setInputValue(modalBgColorPickerInput, rgbToHex(bgColor))
                                }
                            }
                        }
                    }
                }
            });
        }

        let fcPrev = document.querySelector('.fc-prev');
        if (fcPrev) {
            fcPrev.addEventListener('click', function () {
                let cc = document.getElementById('customCarousel');
                if (cc) {
                    selectedImageSrc = customCarousel.children[0].src;
                    let bgColor = getBgColor(customCarousel.children[0]);
                    if (bgColor) {
                        setInputValue(modalBgColorPickerInput, rgbToHex(bgColor))
                    }
                } else {
                    let imageNodes = document.getElementsByClassName('fc-slide');
                    for (let node of imageNodes) {
                        // div with order "2" is the one being displayed by the carousel
                        if (node.style.order === '2') {
                            
                            // sometimes the carousel puts images inside a <figure class="fc-image"> elem
                            if (node.children[0].className === "fc-image") {
                                //selectedImageSrc = node.children[0].children[0].src;
                                let bgColor = getBgColor(node.children[0].children[0]);
                                if (bgColor) {
                                    //setInputValue(modalBgColorPickerInput, rgbToHex(bgColor))
                                    setInputValue(modalBgColorPickerInput, rgbToHex(bgColor))
                                }
                            } else {
                                //selectedImageSrc = node.children[0].src;
                                let bgColor = getBgColor(node.children[0]);
                                if (bgColor) {
                                    setInputValue(modalBgColorPickerInput, rgbToHex(bgColor))
                                }
                            }
                        }
                    }
                }
            });
        }

    }
}

function rectifyUrl(url) {
    if (url && !url.startsWith('https://') && !url.startsWith('http://') && !url.startsWith('file://') && !url.startsWith('chrome://')) {
        return 'https://' + url;
    } else {
        return url;
    }
}

function createDial() {
    let url = rectifyUrl(createDialModalURL.value.trim());
    if (!url || !createDialModalURL.parentId) {
        hideModals();
        return;
    }

    chrome.bookmarks.create({
        title: url,
        url: url,
        parentId: createDialModalURL.parentId
    }).then(node => {
        const scene = getSceneById(getActiveScene());
        if (node.parentId === swipeDeckId && scene?.defaultVisibility === 'hide') {
            addRuleToScene(scene.id, createSceneRule('show', 'bookmark.url', node.url));
        }
        hideModals();
    });
}

function openAllTabs() {
    let folder = currentFolder ? document.getElementById(currentFolder) : document.getElementById('wrap');

    if (folder) {
        let dials = [...folder.getElementsByClassName('tile')];

        dials?.forEach(dial => {
            if (dial.href) {
                chrome.tabs.create({
                    url: dial.href,
                    active: false
                });
            }
        });
    }
}

function openTile(tile, event) {
    if (!tile || !tile.href) return false;

    const openInBackground = event?.metaKey || event?.ctrlKey || event?.button === 1;
    if (openInBackground) {
        chrome.tabs.create({ url: tile.href, active: false });
        return true;
    }

    if (settings.defaultOpen === 'newTab') {
        chrome.tabs.create({ url: tile.href });
        return true;
    }

    if (tile.href.startsWith('chrome:') || tile.href.startsWith('file:')) {
        chrome.tabs.update({ url: tile.href });
        return true;
    }

    return false;
}

function offscreenCanvasShim(w, h) {
    try {
        return new OffscreenCanvas(w, h);
    } catch (err) {
        // offscreencanvas not supported in ff
        let canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        return canvas;
    }
}

function colorsAreSimilar(color1, color2, tolerance = 2) {
    return Math.abs(color1[0] - color2[0]) <= tolerance &&
           Math.abs(color1[1] - color2[1]) <= tolerance &&
           Math.abs(color1[2] - color2[2]) <= tolerance &&
           Math.abs(color1[3] - color2[3]) <= tolerance;
}

// calculate the bg color of a given image. returns rgba array [r, g, b, a]
// todo: duped in offscreen logic; punt this to a worker
function getBgColor(img) {
    let imgWidth = img.naturalWidth;
    let imgHeight = img.naturalHeight;
    let canvas = offscreenCanvasShim(imgWidth, imgHeight);
    let context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(img, 0, 0);

    let totalPixels = 0;
    let avgColor = [0, 0, 0, 0];
    let colorCounts = {};
    let hasTransparentPixel = false;

    // background color algorithm
    // think the results are best when sampling 2 pixels deep from the edges
    // 1px gives bad results from image artifacts, more than 2px means we average away any natural framing/background in the image

    // Sample the top and bottom edges
    for (let x = 0; x < imgWidth; x += 2) { // Sample every other pixel
        for (let y = 0; y < 2; y++) {
            let pixelTop = context.getImageData(x, y, 1, 1).data;
            let pixelBottom = context.getImageData(x, imgHeight - 1 - y, 1, 1).data;
            let colorKeyTop = `${pixelTop[0]},${pixelTop[1]},${pixelTop[2]},${pixelTop[3]}`;
            let colorKeyBottom = `${pixelBottom[0]},${pixelBottom[1]},${pixelBottom[2]},${pixelBottom[3]}`;
            colorCounts[colorKeyTop] = (colorCounts[colorKeyTop] || 0) + 1;
            colorCounts[colorKeyBottom] = (colorCounts[colorKeyBottom] || 0) + 1;
            avgColor[0] += pixelTop[0] + pixelBottom[0];
            avgColor[1] += pixelTop[1] + pixelBottom[1];
            avgColor[2] += pixelTop[2] + pixelBottom[2];
            avgColor[3] += pixelTop[3] + pixelBottom[3];
            totalPixels += 2;
            if (pixelTop[3] < 255 || pixelBottom[3] < 255) {
                hasTransparentPixel = true;
            }
        }
    }

    // Sample the left and right edges
    for (let y = 2; y < imgHeight - 2; y += 2) { // Sample every other pixel
        for (let x = 0; x < 2; x++) {
            let pixelLeft = context.getImageData(x, y, 1, 1).data;
            let pixelRight = context.getImageData(imgWidth - 1 - x, y, 1, 1).data;
            let colorKeyLeft = `${pixelLeft[0]},${pixelLeft[1]},${pixelLeft[2]},${pixelLeft[3]}`;
            let colorKeyRight = `${pixelRight[0]},${pixelRight[1]},${pixelRight[2]},${pixelRight[3]}`;
            colorCounts[colorKeyLeft] = (colorCounts[colorKeyLeft] || 0) + 1;
            colorCounts[colorKeyRight] = (colorCounts[colorKeyRight] || 0) + 1;
            avgColor[0] += pixelLeft[0] + pixelRight[0];
            avgColor[1] += pixelLeft[1] + pixelRight[1];
            avgColor[2] += pixelLeft[2] + pixelRight[2];
            avgColor[3] += pixelLeft[3] + pixelRight[3];
            totalPixels += 2;
            if (pixelLeft[3] < 255 || pixelRight[3] < 255) {
                hasTransparentPixel = true;
            }
        }
    }

    avgColor = avgColor.map(color => color / totalPixels);
    avgColor[3] = avgColor[3] / 255; // Normalize alpha value

    let mostCommonColor = null;
    let maxCount = 0;
    for (let colorKey in colorCounts) {
        let color = colorKey.split(',').map(Number);
        let similarColorKey = Object.keys(colorCounts).find(key => {
            let keyColor = key.split(',').map(Number);
            return colorsAreSimilar(color, keyColor);
        });
    
        if (similarColorKey && similarColorKey !== colorKey) {
            colorCounts[similarColorKey] += colorCounts[colorKey];
            delete colorCounts[colorKey];
        }
    
        if (colorCounts[similarColorKey || colorKey] > maxCount) {
            maxCount = colorCounts[similarColorKey || colorKey];
            mostCommonColor = color;
        }
    }

    if (maxCount > totalPixels / 2) {
        mostCommonColor[3] = mostCommonColor[3] / 255; // Normalize alpha value
        return [mostCommonColor[0], mostCommonColor[1], mostCommonColor[2], mostCommonColor[3]];

    } else {
        if (hasTransparentPixel) {
            avgColor[3] = 0; // Make the gradient transparent if any pixel is transparent
        }
        return [avgColor[0], avgColor[1], avgColor[2], avgColor[3]];
    }
}

function rgbToHex(rgbArray) {
    // Convert RGBA values to hex color (#RRGGBB or #RRGGBBAA)
    let r = Math.round(rgbArray[0]);
    let g = Math.round(rgbArray[1]);
    let b = Math.round(rgbArray[2]);
    let hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    // Append alpha if present and not fully opaque
    if (rgbArray.length > 3) {
        let a = rgbArray[3];
        // alpha could be 0-1 float (from gradient) or 0-255 int
        let alpha = a <= 1 ? Math.round(a * 255) : Math.round(a);
        if (alpha < 255) {
            hex += alpha.toString(16).padStart(2, '0');
        }
    }
    return hex;
}

function hexToRgba(hex) {
    // Convert hex color to RGBA values (supports #RRGGBB and #RRGGBBAA)
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    let a = hex.length === 9 ? parseInt(hex.slice(7, 9), 16) / 255 : 1;
    return [r, g, b, a];
}

function rgbaToCssGradient(rgba) {
    // Convert RGBA values to CSS gradient string
    // gradient is used as a shortcut to set the background color at same time as image
    return `linear-gradient(to bottom, rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]}) 50%, rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]}) 50%)`;
}

function hexToCssGradient(hex) {
    // Convert hex color to CSS gradient string
    let rgba = hexToRgba(hex);
    return rgbaToCssGradient(rgba);
}

function cssGradientToHex(gradientString) {
    // css string is in format: 'linear-gradient(to bottom, rgba(255,255,255,1) 50%, rgba(0,0,0,1) 50%)'
    const rgbaString = gradientString.split('rgba(')[1].split(')')[0];
    const [r, g, b, a] = rgbaString.split(',').map(Number);
    return [r, g, b, a];
}

function saveBookmarkSettings() {
    // todo: cleanup this abomination when im not on drugs
    let title = modalTitle.value;
    let url = targetTileHref;
    let newUrl = rectifyUrl(modalURL.value.trim());
    let selectedImageSrc = null;
    let thumbIndex = 0;
    let imageNodes = document.getElementsByClassName('fc-slide');
    let bgColor = null;
    let colorPickerColor = modalBgColorPickerInput.value;

    let customCarousel = document.getElementById('customCarousel');
    if (customCarousel) {
        selectedImageSrc = customCarousel.children[0].src;
        bgColor = getBgColor(customCarousel.children[0]);
        if (colorPickerColor && colorPickerColor !== rgbToHex(bgColor)) {
            //console.log("colors dont match, using the picker!")
            bgColor = hexToCssGradient(colorPickerColor);
        } else {
            bgColor = rgbaToCssGradient(bgColor);
        }
        targetNode.children[0].children[0].style.backgroundImage = `url('${selectedImageSrc}'), ${bgColor}`;
        //targetNode.children[0].children[0].style.backgroundColor = bgColor;
        chrome.storage.local.get(url)
            .then(result => {
                let thumbnails = [];
                if (result[url]) {
                    thumbnails = result[url].thumbnails;
                    thumbnails.push(selectedImageSrc);
                    thumbIndex = thumbnails.indexOf(selectedImageSrc);
                } else {
                    thumbnails.push(selectedImageSrc);
                    thumbIndex = 0;
                }
                chrome.storage.local.set({ [newUrl]: { thumbnails, thumbIndex, bgColor } }).then(result => {
                    //tabMessagePort.postMessage({updateCache: true, url: newUrl, i: thumbIndex});
                    if (title !== targetTileTitle) {
                        updateTitle()
                    }
                });
            });
    } else {
        for (let node of imageNodes) {
            // div with order "2" is the one being displayed by the carousel
            if (node.style.order === '2' || imageNodes.length === 1) {
                // sometimes the carousel puts images inside a <figure class="fc-image"> elem
                if (node.children[0].className === "fc-image") {
                    selectedImageSrc = node.children[0].children[0].src;
                    bgColor = getBgColor(node.children[0].children[0]);
                } else {
                    selectedImageSrc = node.children[0].src;
                    bgColor = getBgColor(node.children[0]);
                }

                if (colorPickerColor && colorPickerColor !== rgbToHex(bgColor)) {
                    bgColor = hexToCssGradient(colorPickerColor);
                } else {
                    bgColor = rgbaToCssGradient(bgColor);
                }

                // update tile
                targetNode.children[0].children[0].style.backgroundImage = `url('${selectedImageSrc}'), ${bgColor}`;
                //targetNode.children[0].children[0].style.backgroundColor = bgColor;
                break;
            }
        }

        chrome.storage.local.get(url)
            .then(result => {
                if (result[url]) {
                    let thumbnails = result[url].thumbnails;
                    thumbIndex = thumbnails.indexOf(selectedImageSrc);
                    if (thumbIndex >= 0) {
                        chrome.storage.local.set({ [newUrl]: { thumbnails, thumbIndex, bgColor } }).then(result => {
                            //tabMessagePort.postMessage({updateCache: true, url: newUrl, i: thumbIndex});
                            if (title !== targetTileTitle || url !== newUrl) {
                                updateTitle()
                            }
                        });
                    } else {
                        if (title !== targetTileTitle || url !== newUrl) {
                            updateTitle()
                        }
                    }
                } else {
                    if (title !== targetTileTitle || url !== newUrl) {
                        updateTitle()
                    }
                }
            });
    }

    // find image index
    function updateTitle() {
        // allow ui to respond immediately while bookmark updated
        //targetNode.children[0].children[1].textContent = title;
        // sortable ids changed so rewrite to storage
        //let order = sortable.toArray();
        //chrome.storage.local.set({"sort":order});
        // todo: temp hack to match all until we start using bookmark ids
        chrome.bookmarks.search({ url })
            .then(bookmarks => {
                if (bookmarks.length <= 1 && (url !== newUrl)) {
                    // cleanup unused thumbnails
                    chrome.storage.local.remove(url)
                }
                for (let bookmark of bookmarks) {
                    let currentParent = currentFolder ? currentFolder : swipeDeckId
                    if (bookmark.parentId === currentParent) {
                        chrome.bookmarks.update(bookmark.id, {
                            title,
                            url: newUrl
                        });
                        if (currentParent === swipeDeckId) {
                            replaceHomeUrlSceneAssignment(url, newUrl);
                        }
                    }

                    if (url !== newUrl && toastContent.innerText === '') {
                        showToast(i18n('capturingImages'))
                    }
                }
            })
    }

    hideModals();
}

// todo: why did i debounce animate but not layout? (because we want tiles to move immediately as manually resizing window)
function layout(force = false) {
    if (force || layoutFolder || containerSize !== getComputedStyle(bookmarksContainer).maxWidth || windowSize !== window.innerWidth) {
        windowSize = window.innerWidth;
        containerSize = getComputedStyle(bookmarksContainer).maxWidth;

        let nodesToAnimate = [];
        let positions = [];

        // avoid layout thrashing
        // batch reads
        for (let i = 0; i < boxes.length; i++) {
            let box = boxes[i];
            positions[i] = { 
                node: box.node,
                x: box.node.offsetLeft,
                y: box.node.offsetTop,
                lastX: box.x,
                lastY: box.y
            };
        }

        // batch writes
        for (let i = 0; i < boxes.length; i++) {
            let box = positions[i];
            if (box.lastX !== box.x || box.lastY !== box.y || force) {
                TweenMax.killTweensOf(box.node); // prevent running tweens from modifying transforms during delay
                const x = boxes[i].transform.x + box.lastX - box.x;
                const y = boxes[i].transform.y + box.lastY - box.y;
                TweenMax.set(box.node, { x, y });
                nodesToAnimate.push(box.node);
            }
            boxes[i].x = box.x;
            boxes[i].y = box.y;
        }

        // layoutFolder true on folder open -- zero duration because we are just setting the positions of the dials, so whenever
        // a resize occurs the animation will start from the right position
        if (nodesToAnimate.length > 0 || force) {
            let duration = layoutFolder ? 0 : 0.6;
            if (duration === 0) {
                TweenMax.set(nodesToAnimate, { x: 0, y: 0, force3D: true });
            } else {
                if (nodesToAnimate.length < 150) {
                    TweenMax.staggerTo(nodesToAnimate, duration, { x: 0, y: 0, stagger: { amount: 0.2 }, ease });
                } else {
                    TweenMax.to(nodesToAnimate, duration, { x: 0, y: 0, force3D: true, ease });
                }
            }
        }

        layoutFolder = false;
    }
}

function ease(progress) {
    const omega = 12;
    const zeta = 0.8;
    const beta = Math.sqrt(1.0 - zeta * zeta);
    progress = 1 - Math.cos(progress * Math.PI / 2);
    progress = 1 / beta *
        Math.exp(-zeta * omega * progress) *
        Math.sin(beta * omega * progress + Math.atan(beta / zeta));
    return 1 - progress;
}

const animate = debounce(() => {
    requestAnimationFrame(() => { // Use requestAnimationFrame for smoother updates
    let currentParent;
    if (currentFolder) {
        currentParent = currentFolder
    }
    if (!currentParent) return;
    const nodes = document.querySelectorAll(`[id="${currentParent}"] > .tile`);
    const total = nodes.length;

    if (!nodes.length) return;
    TweenMax.set(nodes, { lazy: false, x: "+=0" }); // maybe lazy doesnt help, cant tell

    const nodePositions = [];
    for (let i = 0; i < total; i++) {
        let node = nodes[i];
        nodePositions.push({
            node,
            transform: node._gsTransform,
            x: node.offsetLeft,
            y: node.offsetTop
        });
    }

    for (let i = 0; i < total; i++) {
        boxes[i] = nodePositions[i];
    }
    boxes.length = total;

    layout();

    });
}, 300)

function readURL(input) {
    if (input.files && input.files[0]) {
        reader.readAsDataURL(input.files[0]);
    }
}

function getWallpaperResizeTarget(imgWidth, imgHeight) {
    const pixelRatio = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const viewportWidth = Math.max(window.innerWidth || 0, screen.width || 0);
    const viewportHeight = Math.max(window.innerHeight || 0, screen.height || 0);
    const targetWidth = Math.ceil(viewportWidth * pixelRatio);
    const targetHeight = Math.ceil(viewportHeight * pixelRatio);
    const coverScale = Math.max(targetWidth / imgWidth, targetHeight / imgHeight);
    const dimensionScale = wallpaperMaxDimension / Math.max(imgWidth, imgHeight);
    const pixelScale = Math.sqrt(wallpaperMaxPixels / (imgWidth * imgHeight));
    const scale = Math.min(1, coverScale, dimensionScale, pixelScale);

    return {
        width: Math.max(1, Math.round(imgWidth * scale)),
        height: Math.max(1, Math.round(imgHeight * scale)),
    };
}

function resizeBackground(dataURI) {
    return new Promise(function (resolve, reject) {
        let img = new Image();
        img.onload = function () {
            const target = getWallpaperResizeTarget(this.width, this.height);
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d', { willReadFrequently: true });
            const useJpeg = typeof chrome !== 'undefined' && Boolean(chrome.runtime?.getBrowserInfo);

            canvas.width = target.width;
            canvas.height = target.height;
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            if (useJpeg) {
                ctx.fillStyle = getThemeAwareSettingColor('backgroundColor') || defaults.backgroundColor;
                ctx.fillRect(0, 0, target.width, target.height);
            }

            ctx.drawImage(this, 0, 0, target.width, target.height);

            // todo: remove this whenever firefox supports webp. in meantime we fallback to jpg for speed
            if (useJpeg) {
                resolve(canvas.toDataURL('image/jpeg', 0.9));
            } else {
                resolve(canvas.toDataURL('image/webp', 0.88));
            }
        };
        img.onerror = reject;
        img.src = dataURI;
    })
}

// todo: completely offload this shit to the worker
function resizeThumb(dataURI) {
    return new Promise(function (resolve, reject) {
        let img = new Image();
        img.onload = async function () {
            if (this.height > 256 || this.width > 256) {
                // when im less lazy check use optimal w/h based on image
                // set height to 256 and scale
                //let height = 256;
                let height = 144;
                let ratio = height / this.height;
                let width = Math.round(this.width * ratio);

                let canvas = new OffscreenCanvas(width, height)
                let ctx = canvas.getContext('2d', { willReadFrequently: true });
                ctx.imageSmoothingEnabled = true;
                ctx.drawImage(this, 0, 0, width, height);

                // Use convertToBlob instead of toDataURL
                const blob = await canvas.convertToBlob({ type: 'image/webp', quality: 0.86 });
                const reader = new FileReader();
                reader.onload = function (e) {
                    resolve(e.target.result); // Resolve with the data URI
                };
                reader.onerror = function (err) {
                    reject(err);
                };
                reader.readAsDataURL(blob)
            } else {
                resolve(dataURI);
            }
        };
        img.src = dataURI;
    })
}

function readImage(input) {
    return new Promise(function (resolve, reject) {
        let filereader = new FileReader();
        filereader.onload = function (e) {
            resolve(e.target.result);
        };
        if (input.files && input.files[0]) {
            filereader.readAsDataURL(input.files[0]);
        }
    });
}

//todo: deletability yo
function addImage(image) {
    let carousel = document.getElementById('carousel');
    if (carousel) {
        carousel.style.display = "none";
        let customCarousel = document.getElementById('customCarousel');
        if (customCarousel) {
            customCarousel.remove();
        }
        customCarousel = document.createElement('div');
        customCarousel.setAttribute('id', 'customCarousel');
        customCarousel.style.height = "180px";

        let preview = document.createElement('img');
        preview.style.height = '100%';
        preview.style.width = '100%';
        preview.style.objectFit = 'contain';
        preview.setAttribute('src', image);

        customCarousel.appendChild(preview);
        modalImgContainer.appendChild(customCarousel);

        // set the color picker to the new image bg color
        preview.onload = function() {
            let bgColor = getBgColor(preview);
            if (bgColor) {
                setInputValue(modalBgColorPickerInput, rgbToHex(bgColor))
            }
        };
    }
}

function applySettings() {
    return new Promise(function (resolve, reject) {
        // apply settings to the deck
        applyThemeMode();
        const backgroundColor = getThemeAwareSettingColor('backgroundColor');
        const textColor = getThemeAwareSettingColor('textColor');

        if (settings.wallpaper && settings.wallpaperSrc) {
            // perf hack for default gradient bg image. user selected images are data URIs
            if (isDefaultWallpaperSrc(settings.wallpaperSrc)) {
                // Remove any existing background styles and add the animated gradient class
                document.documentElement.classList.remove('customWallpaper');
                document.body.style.background = '';
                document.body.style.backgroundColor = '';
                document.body.style.backgroundImage = '';
                document.body.style.backgroundRepeat = '';
                document.body.style.backgroundPosition = '';
                document.body.style.backgroundAttachment = '';
                document.body.style.backgroundSize = '';
                document.body.classList.add('gradientBackground');
            } else {
                // Remove the gradient class and apply custom background
                document.body.classList.remove('gradientBackground');
                setWallpaperCssVar(settings.wallpaperSrc);
                document.documentElement.classList.add('customWallpaper');
                document.body.style.background = '';
                document.body.style.backgroundColor = '';
                document.body.style.backgroundImage = '';
                document.body.style.backgroundRepeat = '';
                document.body.style.backgroundPosition = '';
                document.body.style.backgroundAttachment = '';
                document.body.style.backgroundSize = '';
            }
        } else {
            // Remove the gradient class and apply solid background color
            document.documentElement.classList.remove('customWallpaper');
            document.body.classList.remove('gradientBackground');
            document.body.style.background = `linear-gradient(var(--background-dim-overlay), var(--background-dim-overlay)), ${backgroundColor}`;
            document.body.style.backgroundColor = backgroundColor;
            document.body.style.backgroundImage = '';
            document.body.style.backgroundRepeat = '';
            document.body.style.backgroundPosition = '';
            document.body.style.backgroundAttachment = '';
            document.body.style.backgroundSize = '';
        }

        clearInitialPaintClasses({
            preserveWallpaperSrc: settings.wallpaper && settings.wallpaperSrc && !isDefaultWallpaperSrc(settings.wallpaperSrc),
        });
        syncInitialPaintSnapshot(backgroundColor, textColor);

        if (textColor) {
            document.documentElement.style.setProperty('--color', textColor);
        }

        const isFlowDial = settings.dialRatio === "flow";
        document.body.classList.toggle('flowDial', isFlowDial);
        document.documentElement.style.setProperty('--image-scaling', isFlowDial ? 'cover' : 'contain');

        /*
        if (settings.scaleImages) {
            document.documentElement.style.setProperty('--image-scaling', 'contain');
            //document.documentElement.style.setProperty('--image-width', '140px');
        } else {
            document.documentElement.style.setProperty('--image-scaling', 'cover');
            //document.documentElement.style.setProperty('--image-width', '188px');
        }
        */

        if (!isFlowDial && settings.maxCols && settings.maxCols !== "100") {
            //todo cleanup - fixed values
            let dialWidth = 220;
            let dialMargin = 14 * 2; // 18px on each side

            switch (settings.dialSize) {
                case "xx-large":
                    dialWidth = 300;
                    break;
                case "x-large":
                    dialWidth = 256;
                    break;
                case "large":
                    dialWidth = 220;
                    break;
                case "medium":
                    dialWidth = 178;
                    break;
                case "small":
                    dialWidth = 130;
                    break;
                case "x-small":
                    dialWidth = 100;
                    dialMargin = 12 * 2;
                    break;
                case "xx-small":
                    dialWidth = 80;
                    dialMargin = 8 * 2;
                    break;
                default:
                    dialWidth = 220;
            }
        
            const containerWidth = settings.maxCols * (dialWidth + dialMargin);
            document.documentElement.style.setProperty('--columns', `${containerWidth}px`);
            layout();
        } else {
            document.documentElement.style.setProperty('--columns', '100%');
            layout();
        }

        if (isFlowDial) {
            document.documentElement.style.setProperty('--dial-width', 'auto');
            document.documentElement.style.setProperty('--dial-height', '52px');
            document.documentElement.style.setProperty('--dial-content-height', '20px');
            document.documentElement.style.setProperty('--dial-margin', '0');
            document.documentElement.style.setProperty('--folder-drop-padding', '60px');
            document.documentElement.style.setProperty('--flow-dial-min-width', '112px');
            document.documentElement.style.setProperty('--flow-dial-max-width', '260px');
        } else if (settings.dialSize && settings.dialSize !== "large") {
            let dialWidth, dialHeight, dialContentHeight, dialMargin, folderDropPadding;
            switch (settings.dialSize) {
                case "xx-large":
                    dialWidth = '300px';
                    dialHeight = settings.dialRatio === "square" ? '318px' : '189px';
                    dialContentHeight = settings.dialRatio === "square" ? '300px' : '171px';
                    dialMargin = '14px';
                    folderDropPadding = '80px';
                    break;
                case "x-large":
                    dialWidth = '256px';
                    dialHeight = settings.dialRatio === "square" ? '274px' : '162px';
                    dialContentHeight = settings.dialRatio === "square" ? '256px' : '144px';
                    dialMargin = '14px';
                    folderDropPadding = '70px';
                    break;
                case "medium":
                    dialWidth = '178px';
                    dialHeight = settings.dialRatio === "square" ? '196px' : '118px';
                    dialContentHeight = settings.dialRatio === "square" ? '178px' : '100px';
                    dialMargin = '14px';
                    folderDropPadding = '45px';
                    break;
                case "small":
                    dialWidth = '130px';
                    dialHeight = settings.dialRatio === "square" ? '148px' : '91px';
                    dialContentHeight = settings.dialRatio === "square" ? '130px' : '73px';
                    dialMargin = '14px';
                    folderDropPadding = '35px';
                    break;
                case "x-small":
                    dialWidth = '100px';
                    dialHeight = settings.dialRatio === "square" ? '118px' : '74px';
                    dialContentHeight = settings.dialRatio === "square" ? '100px' : '56px';
                    dialMargin = '12px';
                    folderDropPadding = '25px';
                    break;
                case "xx-small":
                    dialWidth = '80px';
                    dialHeight = settings.dialRatio === "square" ? '98px' : '63px';
                    dialContentHeight = settings.dialRatio === "square" ? '80px' : '45px';
                    dialMargin = '8px';
                    folderDropPadding = '20px';
                    break;
                default:
                    dialWidth = '220px';
                    dialHeight = settings.dialRatio === "square" ? '238px' : '142px';
                    dialContentHeight = settings.dialRatio === "square" ? '220px' : '124px';
                    dialMargin = '14px';
                    folderDropPadding = '60px';
            }
            document.documentElement.style.setProperty('--dial-width', dialWidth);
            document.documentElement.style.setProperty('--dial-height', dialHeight);
            document.documentElement.style.setProperty('--dial-content-height', dialContentHeight);
            document.documentElement.style.setProperty('--dial-margin', dialMargin);
            document.documentElement.style.setProperty('--folder-drop-padding', folderDropPadding);
        } else {
            document.documentElement.style.setProperty('--dial-width', '220px');
            document.documentElement.style.setProperty('--dial-margin', '14px');
            document.documentElement.style.setProperty('--folder-drop-padding', '60px');
            if (settings.dialRatio === "square") {
                document.documentElement.style.setProperty('--dial-height', '238px');
                document.documentElement.style.setProperty('--dial-content-height', '220px');
            } else {
                document.documentElement.style.setProperty('--dial-height', '142px');
                document.documentElement.style.setProperty('--dial-content-height', '124px');
            }
        }

        if (settings.showFolders) {
            document.documentElement.style.setProperty('--show-folders', 'inline');
        } else {
            document.documentElement.style.setProperty('--show-folders', 'none');
        }

        if (settings.showClock) {
            clock.style.setProperty('--clock', 'flex');
        } else {
            clock.style.setProperty('--clock', 'none');
        }

        if (settings.showSettingsBtn) {
            settingsBtn.style.setProperty('--settings', 'grid');
        } else {
            settingsBtn.style.setProperty('--settings', 'none');
        }

        if (settings.showSearchBtn && getSceneRules(getActiveScene()).modules.searchEnabled) {
            searchBtn.style.setProperty('--search', 'grid');
        } else {
            searchBtn.style.setProperty('--search', 'none');
        }

        // Position search icon based on what's visible
        updateSearchIconPosition();
        updateFolderRailLayout();

        if (!settings.showTitles) {
            document.documentElement.style.setProperty('--title-opacity', '0');
        } else {
            document.documentElement.style.setProperty('--title-opacity', '1');
        }

        if (!settings.showAddSite) {
            document.documentElement.style.setProperty('--create-dial-display', 'none');
        } else {
            document.documentElement.style.setProperty('--create-dial-display', 'block');
        }


        resolve();

        // populate settings nav
        themeModeInput.value = settings.themeMode || defaults.themeMode;
        wallPaperEnabled.checked = settings.wallpaper;
        color_picker.value = backgroundColor;
        color_picker_wrapper.style.backgroundColor = backgroundColor;
        textColor_picker.value = textColor;
        textColor_picker_wrapper.style.backgroundColor = textColor;
        showTitlesInput.checked = settings.showTitles;
        showCreateDialInput.checked = settings.showAddSite;
        largeTilesInput.checked = settings.largeTiles;
        showFoldersInput.checked = settings.showFolders;
        showClockInput.checked = settings.showClock;
        showSettingsBtnInput.checked = settings.showSettingsBtn;
        showSearchBtnInput.checked = settings.showSearchBtn;
        maxColsInput.value = settings.maxCols;
        dialSizeInput.value = settings.dialSize;
        dialRatioInput.value = settings.dialRatio;
        defaultSortInput.value = settings.defaultSort;
        defaultOpenInput.value = settings.defaultOpen;
        newTabSoundInput.checked = settings.newTabSound !== false;
        newTabSoundTypeInput.value = validNewTabSoundTypes.includes(settings.newTabSoundType)
            ? settings.newTabSoundType
            : soundOpenZen;
        if (newTabSoundVolumeInput) {
            newTabSoundVolumeInput.value = String(getNewTabSoundVolumePercent());
            renderNewTabSoundVolumeValue();
        }
        renderActiveSceneOptions();
        activeSceneInput.value = getActiveScene();
        rememberFolderInput.checked = settings.rememberFolder;
        renderSceneControls();

        setWallpaperPreview(settings.wallpaperSrc || defaults.wallpaperSrc);

    });
}

function saveSettings() {
    settings.wallpaper = wallPaperEnabled.checked;
    settings.wallpaperSrc = imgPreview.dataset.defaultWallpaper === 'true'
        ? defaults.wallpaperSrc
        : getStoredWallpaperSrc(imgPreview.getAttribute('src') || imgPreview.src);
    settings.themeMode = themeModeInput.value;
    settings.backgroundColor = color_picker.value;
    settings.textColor = textColor_picker.value;
    settings.showTitles = showTitlesInput.checked;
    settings.showAddSite = showCreateDialInput.checked;
    settings.largeTiles = largeTilesInput.checked;
    settings.showFolders = showFoldersInput.checked;
    settings.showClock = showClockInput.checked;
    settings.showSettingsBtn = showSettingsBtnInput.checked;
    settings.showSearchBtn = showSearchBtnInput.checked;
    settings.maxCols = maxColsInput.value;
    settings.dialSize = dialSizeInput.value;
    settings.dialRatio = dialRatioInput.value;
    settings.defaultSort = defaultSortInput.value;
    settings.defaultOpen = defaultOpenInput.value;
    settings.newTabSound = newTabSoundInput.checked;
    settings.newTabSoundType = validNewTabSoundTypes.includes(newTabSoundTypeInput.value)
        ? newTabSoundTypeInput.value
        : soundOpenZen;
    settings.newTabSoundVolume = normalizeNewTabSoundVolume(Number(newTabSoundVolumeInput?.value ?? 100) / 100);
    setActiveScene(activeSceneInput.value);
    settings.rememberFolder = rememberFolderInput.checked;
    settings.currentFolder = currentFolder || null;
    normalizeSceneSettings();

    applySettings();

    Promise.all([
        chrome.storage.local.set({ settings }),
        saveSceneLocal(),
    ])
        .then(() => {
            /*
            settingsToast.style.opacity = "1";
            setTimeout(function () {
                settingsToast.style.opacity = "0";
            }, 3500);
             */

            //tabMessagePort.postMessage({updateSettings: true});
        })
        .catch(error => {
            console.warn('Unable to save settings:', error);
        });
}

// override context menu
document.addEventListener("contextmenu", function (e) {
    if (e.target.closest?.('.smartHomeSearchForm')) {
        return;
    }
    if (e.target.type === 'text' && (e.target.id === 'modalTitle' || e.target.id === 'modalURL' || e.target.id === 'modalImageURLInput' || e.target.id === 'createDialModalURL')) {
        return;
    }
    e.preventDefault();
    // prevent settings from being opened and immediately hidden when right-clicking the gear icon
    if (e.target.id === 'settingsDiv') {
        return;
    }
    hideSettings();
    const tileTarget = e.target.closest ? e.target.closest('.tile:not(.createDial), .smartHomeRecentItem') : null;
    if (tileTarget && (tileTarget.classList.contains('smartHomeRecentItem') || e.target.classList.contains('tile-content') || e.target.classList.contains('tile-title') || document.body.classList.contains('flowDial'))) {
        const tileContent = tileTarget.querySelector('.tile-content');
        const tileTitle = tileTarget.querySelector('.tile-title, .smartHomeRecentTitle');
        targetNode = tileTarget;
        targetTileHref = tileTarget.href;
        targetTileId = tileContent?.id;
        targetTileTitle = tileTitle?.innerText || '';
        showContextMenu(menu, e.pageY, e.pageX);
        return false;
    } else if (e.target.closest && e.target.closest('.folderTitle') && e.target.closest('.folderTitle').id !== "homeFolderLink") {
        const folderTitle = e.target.closest('.folderTitle');
        targetFolderLink = folderTitle;
        targetFolder = folderTitle.attributes.folderId.nodeValue;
        targetFolderName = folderTitle.textContent;
        showContextMenu(folderMenu, e.pageY, e.pageX);
        return false;
    } else if (e.target === document.body || e.target.className === 'folders' || e.target.className === 'folders-content' || e.target.className === 'container' || e.target.className === 'tileContainer' || e.target.className === 'cta-container' || e.target.className === 'default-content' || e.target.className === 'default-content helpText') {
        showContextMenu(settingsMenu, e.pageY, e.pageX);
        return false;
    }
});

// todo: tidy this up
window.addEventListener("click", async e => {
    if (typeof e.target.className === 'string' && e.target.className.indexOf('settingsCtl') >= 0) {
        return;
    }
    if (e.target.closest && e.target.closest('.tile:not(.createDial), .smartHomeRecentItem')) {
        let tile = e.target.closest('.tile:not(.createDial), .smartHomeRecentItem');
        if (openTile(tile, e)) {
            e.preventDefault();
        }
        return;
    }
    e.preventDefault();
});

window.addEventListener("auxclick", e => {
    if (e.button === 1 && e.target.closest && e.target.closest('.tile:not(.createDial), .smartHomeRecentItem')) {
        let tile = e.target.closest('.tile:not(.createDial), .smartHomeRecentItem');
        if (openTile(tile, e)) {
            e.preventDefault();
        }
    }
});

// listen for menu item
window.addEventListener("mousedown", e => {
    hideMenus();
    if (e.target.closest && e.target.closest('.sceneRulePanel')) {
        return;
    }
    if (e.target.type === 'text' || e.target.type === 'range' || e.target.id === 'themeMode' || e.target.id === 'maxcols' || e.target.id === 'defaultSort' || e.target.id === 'defaultOpen' || e.target.id === 'newTabSoundType' || e.target.id === 'activeScene' || e.target.id === 'dialSize' || e.target.id === 'dialRatio') {
        return
    }
    if (e.target.className.baseVal === 'gear') {
        openSettings();
        return;
    }
    if (e.target.closest('#splashAddDial')) {
        e.preventDefault();
        if (buildCreateDialModal(currentFolder)) {
            modalShowEffect(createDialModalContent, createDialModal);
        }
        return;
    }
    if (e.target.closest('#splashImport')) {
        e.preventDefault();
        modalShowEffect(importExportModalContent, importExportModal);
        //importFileInput.click();
        return;
    }

    switch (e.target.className) {
        // todo: invert this
        case 'default-content':
        case 'default-content helpText':
        case 'tile-content':
        case 'tile-title':
        case 'container':
        case 'tileContainer':
        case 'cta-container':
        case 'folders-content':
        case 'folders':
            hideSettings();
            break;
        case 'modal':
            hideModals();
            break;
        default: {
            const menuOption = e.target.closest('.menu-option');
            if (menuOption) {
            switch (menuOption.id) {
                case 'openSettings':
                    openSettings();
                    break;
                case 'newTab':
                    chrome.tabs.create({ url: targetTileHref });
                    break;
                case 'newBackgroundTab':
                    chrome.tabs.create({ url: targetTileHref, active: false });
                    break;
                case 'newWin':
                    chrome.windows.create({ "url": targetTileHref });
                    break;
                case 'newPrivate':
                    chrome.windows.create({ "url": targetTileHref, "incognito": true });
                    break;
                case 'openAll':
                    openAllTabs();
                    break;
                case 'edit':
                    if (!targetTileId) break;
                    buildModal(targetTileHref, targetTileTitle).then(() => {
                        modalShowEffect(modalContent, modal);
                    });
                    break;
                case 'refresh':
                    if (!targetTileId) break;
                    refreshThumbnails(targetTileHref, targetTileId);
                    break;
                case 'hideSimilarUrl': {
                    const domain = getDomainFromUrl(targetTileHref);
                    const isRecentTab = targetNode?.classList?.contains('smartHomeRecentItem');
                    addShortcutRule(
                        'hide',
                        domain ? (isRecentTab ? 'tab.domain' : 'bookmark.domain') : (isRecentTab ? 'tab.url' : 'bookmark.url'),
                        domain || targetTileHref
                    );
                    break;
                }
                case 'refreshAll':
                    modalShowEffect(refreshAllModalContent, refreshAllModal);
                    break;
                case 'delete':
                    if (!targetTileId) break;
                    removeBookmark(targetTileHref);
                    break;
                case 'editFolder':
                    //buildFolderModal(targetFolder, targetFolderName);
                    editFolderModalName.value = targetFolderName;
                    modalShowEffect(editFolderModalContent, editFolderModal);
                    break;
                case 'hideSimilarFolder':
                    addShortcutRule('hide', 'folder.title', targetFolderName);
                    break;
                case 'showOnlySimilarFolder':
                    addShortcutRule('show', 'folder.title', targetFolderName, { defaultVisibility: 'hide' });
                    break;
                case 'deleteFolder':
                    deleteFolderModalName.textContent = targetFolderName;
                    modalShowEffect(deleteFolderModalContent, deleteFolderModal);
                    break;
                case 'newDial':
                    // prevent default required to stop focus from leaving the modal input
                    e.preventDefault();
                    if (buildCreateDialModal(currentFolder)) {
                        modalShowEffect(createDialModalContent, createDialModal);
                    }
                    break;
                case 'newFolder':
                    e.preventDefault();
                    createFolder();
                    break;
            }
            } else {
                e.preventDefault();
            }
            break;
        }
    }
});

window.addEventListener("keydown", event => {
    if (event.code === "Escape") {
        // Close search if it's active (prioritize this over other actions)
        if (searchContainer.classList.contains('active')) {
            event.preventDefault();
            hideSearch();
            return;
        }
        hideMenus();
        hideModals();
    } else if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault(); // Prevent the default browser behavior
        activateExpandableSearch();
    }
});

modalSave.addEventListener("click", saveBookmarkSettings);
createDialModalSave.addEventListener("click", createDial);
addFolderButton.addEventListener("click", createFolder);
createFolderModalSave.addEventListener("click", saveFolder)
editFolderModalSave.addEventListener("click", editFolder)
deleteFolderModalSave.addEventListener("click", removeFolder);
refreshAllModalSave.addEventListener("click", refreshAllThumbnails);
searchBtn.addEventListener("click", function() {
    activateExpandableSearch();
});

function activateExpandableSearch() {
    document.body.classList.add('search-active');
    searchContainer.classList.add('active');
    setTimeout(() => searchInput.focus(), 300);
}

function hideSearch() {
    document.body.classList.remove('search-active');
    searchContainer.classList.remove('active');
    searchInput.blur();
    
    if (searchInput.value) {
        searchInput.value = '';
        filterDials(''); // Clear search results only if there was a search term
    }
}

for (let button of closeModal) {
    button.onclick = function (e) {
        e.preventDefault();
        hideModals();
    };
}

modalTitle.addEventListener('keydown', e => {
    if (e.code === "Enter") {
        e.preventDefault();
        saveBookmarkSettings();
    }
});

modalURL.addEventListener('keydown', e => {
    if (e.code === "Enter") {
        e.preventDefault();
        saveBookmarkSettings();
    }
});

createDialModalURL.addEventListener('keydown', e => {
    if (e.code === "Enter") {
        e.preventDefault();
        createDial();
    }
});

modalImgBtn.addEventListener('click', function () {
    document.getElementById('modalImgFile').click();
});

modalImgInput.onchange = function () {
    readImage(this).then(image => {
        resizeThumb(image).then(resizedImage => {
            addImage(resizedImage);
        })
    });
};

themeModeInput.oninput = function (e) {
    saveSettings()
}


maxColsInput.oninput = function (e) {
    saveSettings()
}

dialSizeInput.oninput = function (e) {
    saveSettings()
}

dialRatioInput.oninput = function (e) {
    saveSettings()
}

defaultSortInput.oninput = function (e) {
    if (settings.defaultSort !== defaultSortInput.value) {
        processRefresh();
        saveSettings()
    }
}

defaultOpenInput.oninput = function (e) {
    saveSettings()
}

newTabSoundInput.oninput = function (e) {
    saveSettings()
}

newTabSoundTypeInput.oninput = function (e) {
    saveSettings()
}

newTabSoundVolumeInput.oninput = function (e) {
    renderNewTabSoundVolumeValue();
    saveSettings()
}

activeSceneInput.oninput = function (e) {
    if (getActiveScene() !== activeSceneInput.value) {
        saveSettings();
        processRefresh();
    }
}

wallPaperEnabled.oninput = function (e) {
    saveSettings()
}

resetWallpaperBtn.onclick = function () {
    resetWallpaperToDefault();
}

color_picker.onchange = function () {
    color_picker_wrapper.style.backgroundColor = color_picker.value;
    saveSettings();
};

textColor_picker.onchange = function () {
    textColor_picker_wrapper.style.backgroundColor = textColor_picker.value;
    if (settings.textColor !== textColor_picker.value) {
        saveSettings();
    }
};

showTitlesInput.oninput = function (e) {
    saveSettings()
}

showCreateDialInput.oninput = function (e) {
    saveSettings()
}

showFoldersInput.oninput = function (e) {
    saveSettings()
}

showClockInput.oninput = function (e) {
    saveSettings()
}

rememberFolderInput.oninput = function (e) {
    saveSettings()
}

showSettingsBtnInput.oninput = function (e) {
    saveSettings()
}

showSearchBtnInput.oninput = function (e) {
    saveSettings()
}

reader.onload = function (e) {
    resizeBackground(e.target.result).then(imagedata => {
        wallPaperEnabled.checked = true;
        settings.wallpaper = true;
        imgPreview.classList.remove('defaultWallpaperPreview');
        imgPreview.dataset.defaultWallpaper = 'false';
        imgPreview.setAttribute('src', imagedata);
        imgPreview.style.display = 'block';
        resetWallpaperBtn.hidden = false;
        // dynamically set text color based on background
        /*
        getAverageRGB(imagedata).then(rgb => {
            let textColor = contrast(rgb);
            settings.textColor = textColor
            document.documentElement.style.setProperty('--color', textColor);
        });
         */
        syncWallpaperPreviewLayout();
        saveSettings();
        imgInput.value = '';
    }).catch(error => {
        console.warn('Unable to load wallpaper:', error);
        imgInput.value = '';
    })
};

imgInput.onchange = function () {
    readURL(this);
};

previewOverlay.onclick = function () {
    imgInput.click();
}

// add image from url button clicked, show the input field
modalImgUrlBtn.addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('modalBtnContainer').style.display = 'none';
    document.getElementById('imageUrlContainer').style.display = 'flex';
    modalImageURLInput.focus();
});

closeImgUrlBtn.addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('modalBtnContainer').style.display = 'flex';
    document.getElementById('imageUrlContainer').style.display = 'none';
    modalImageURLInput.value = '';
});

// fetch the image from the url
fetchImageButton.addEventListener('click', function (event) {
    event.preventDefault();
    const imageUrl = modalImageURLInput.value.trim();
    if (imageUrl) {
        resizeThumb(imageUrl).then(resizedImage => {
            addImage(resizedImage);
        }).catch(error => {
            // todo: show error message to user in the modal
            console.error('Error adding image from URL:', error);
        });
    }
});

modalBgColorPickerBtn.addEventListener('click', function (e) {
    if (e.target === modalBgColorPickerInput) return;
    modalBgColorPickerInput.dispatchEvent(new Event('click', { bubbles: true }));
});

modalBgColorPickerInput.addEventListener('input', function () {
    const color = this.value;
    // set the our button color to match
    modalBgColorPreview.style.fill = color;
});

// helper function for when we set the color picker value programmatically to update our button
function setInputValue(inputElement, value) {
    inputElement.value = value;
    inputElement.dispatchEvent(new Event('input'));
}

document.getElementById('closeSettingsBtn').addEventListener('click', () => {
    hideSettings();
});


function prepareExportV1() {
    chrome.storage.local.get(null).then(function (items) {
        // filter out unused thumbnails to keep exported file efficient
        let filteredItems = {};
        for (const [key, value] of Object.entries(items)) {
            if (key.startsWith('http') || key.startsWith('file:') || key.startsWith('chrome:')) {
                let thumbnails = [];
                let thumbIndex = 0;
                let bgColor = null;

                if (value.thumbnails && value.thumbnails.length) {
                    thumbnails.push(value.thumbnails[value.thumbIndex]);
                }
                if (value.bgColor) {
                    bgColor = value.bgColor;
                }
                filteredItems[key] = {
                    thumbnails: thumbnails,
                    thumbIndex: thumbIndex,
                    bgColor: value.bgColor
                };
            } else if (key.startsWith('settings')) {
                filteredItems[key] = value;
            }
        }

        // save as file; requires downloads permission
        const blob = new Blob([JSON.stringify(filteredItems)], { type: 'application/json' })
        const today = new Date();
        const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

        exportBtn.setAttribute('href', URL.createObjectURL(blob));
        exportBtn.download = `OhMySwipeDeck-export-${dateString}.json`;
        exportBtn.classList.remove('disabled');

    });
}

function prepareExport() {
    // exports an OhMySwipeDeck json file that includes all bookmarks within the root deck folder, along with settings and thumbnails from storage
    // in the following format:

    /*
    const swipeDeckJson = {
        "ohMySwipeDeck": {
            "bookmarks":[
                {"id":123,"title":"Site Title","url":"https://www.website.com","index":1,"folderid":3}
            ],
            "folders":[
                {"id":123,"title":"Folder Title","index":1}
            ],
            "settings":{
                "showClock":true,
                "backgroundImage":""
            },
            "dials": [
                {"https://361114779041.signin.aws.amazon.com/console":{"thumbnails":["data:image/webp;asdfasdf.png","sdfsdfsdfsdfsdf"],"thumbIndex":0,"bgColor":"red"}},
                {"https://361114779041.signin.aws.amazon.com/console":{"thumbnails":["data:image/webp;asdfasdf.png","sdfsdfsdfsdfsdf"],"thumbIndex":0,"bgColor":"red"}}
            ]
        }
    }
    */

    let swipeDeckJson = {
        ohMySwipeDeck: {
            version: 1,
            bookmarks: [],
            folders: [],
            settings: {},
            sceneSync: {},
            dials: []
        }
    };

    // Get bookmarks and folders within the OhMySwipeDeck folder
    chrome.bookmarks.getSubTree(swipeDeckId).then(bookmarkTreeNodes => {
        function traverseBookmarks(nodes, parentId = null) {
            nodes.forEach(node => {
                if (node.url) {
                    swipeDeckJson.ohMySwipeDeck.bookmarks.push({
                        id: node.id,
                        title: node.title,
                        url: node.url,
                        index: node.index,
                        folderid: parentId
                    });
                } else {
                    swipeDeckJson.ohMySwipeDeck.folders.push({
                        id: node.id,
                        title: node.title,
                        index: node.index
                    });
                    if (node.children) {
                        traverseBookmarks(node.children, node.id);
                    }
                }
            });
        }
        traverseBookmarks(bookmarkTreeNodes[0].children);

        // Get OhMySwipeDeck settings and thumbnails from storage
        chrome.storage.local.get(null).then(items => {
            swipeDeckJson.ohMySwipeDeck.settings = normalizeSettings(items.settings || settings);
            for (const [key, value] of Object.entries(items)) {
                if (key.startsWith('http') || key.startsWith('file:') || key.startsWith('chrome:')) {
                    let thumbnails = [];
                    if (value.thumbnails && value.thumbnails.length) {
                        thumbnails.push(value.thumbnails[value.thumbIndex]);
                    }
                    swipeDeckJson.ohMySwipeDeck.dials.push({
                        [key]: {
                            thumbnails: thumbnails,
                            thumbIndex: 0,
                            bgColor: value.bgColor
                        }
                    });
                }
            }

            // Save as file; requires downloads permission
            swipeDeckJson.ohMySwipeDeck.sceneSync = normalizeSceneSync(sceneSync);
            const blob = new Blob([JSON.stringify(swipeDeckJson)], { type: 'application/json' });
            const today = new Date();
            const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

            exportBtn.setAttribute('href', URL.createObjectURL(blob));
            exportBtn.download = `OhMySwipeDeck-export-${dateString}.json`;
            exportBtn.classList.remove('disabled');
        });
    });
}


importExportBtn.onclick = function () {
    hideSettings();
    importExportStatus.innerText = "";
    exportBtn.classList.add('disabled');
    prepareExport();
    modalShowEffect(importExportModalContent, importExportModal);
}

helpBtn.onclick = function () {
    chrome.tabs.create({ url: helpUrl });
}

resetSettingsBtn.onclick = function () {
    if (confirm(i18n('resetSettingsConfirm'))) {
        settings = cloneDefaultSettings();
        sceneSync = cloneDefaultSceneSync();
        sceneLocal = normalizeSceneLocal({ activeSceneId: sceneAll });
        setCurrentFolderForScene(null);
        Promise.all([
            chrome.storage.local.set({ settings, [sceneLocalStorageKey]: sceneLocal }),
            saveSceneSync(),
        ]).then(() => {
            applySettings();
            processRefresh();
        });
    }
}

importFileLabel.onclick = function () {
    importFileInput.click();
}

function parseJson(event) {
    try {
        return JSON.parse(event.target.result);
    } catch (err) {
        console.log(err);
        importExportStatus.innerText = i18n('importErrorParse');
        return null;
    }
}

// Add event listener for search input
searchInput.addEventListener('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();
    filterDials(searchTerm);
});

searchInput.addEventListener('keydown', async function (e) {
    if (e.key === 'Escape') {
        hideSearch();
        return;
    }

    if (e.key !== 'Enter') {
        return;
    }

    const searchTerm = searchInput.value.trim();
    if (!searchTerm) {
        return;
    }

    e.preventDefault();
    await queryDefaultSearch(searchTerm);
});

async function queryDefaultSearch(searchTerm) {
    const disposition = settings.defaultOpen === 'newTab' ? 'NEW_TAB' : 'CURRENT_TAB';
    try {
        if (chrome.search?.query) {
            await chrome.search.query({ text: searchTerm, disposition });
            return;
        }
        if (typeof browser !== 'undefined' && browser.search?.query) {
            await browser.search.query({ text: searchTerm, disposition });
            return;
        }
    } catch (error) {
        console.warn('Unable to search with default provider:', error);
    }
    showToast(i18n('searchUnavailable'));
}

function filterDials(searchTerm) {
    const currentParent = currentFolder;
    if (!currentParent) return;

    const currentContainer = document.getElementById(currentParent);
    if (!currentContainer) return;

    const dials = currentContainer.querySelectorAll('.tile, .smartHomeRecentItem');

    dials.forEach(dial => {
        if (!settings.showAddSite && dial.classList.contains('createDial')) {
            // dont show the create dial button
            return;
        }

        const title = (dial.querySelector('.tile-title, .smartHomeRecentTitle')?.textContent || '').toLowerCase();
        const url = (dial.href || dial.querySelector('.smartHomeRecentUrl')?.textContent || '').toLowerCase();

        if (title && title.includes(searchTerm) || url.includes(searchTerm)) {
            // Fade-in and scale-up for matching thumbnails
            TweenMax.to(dial, 0.3, { 
                opacity: 1, 
                scale: 1, 
                display: 'block', 
                ease: Power2.easeOut 
            });
        } else {
            // Fade-out and scale-down for non-matching thumbnails
            TweenMax.to(dial, 0.3, { 
                opacity: 0, 
                scale: 0.8, 
                display: 'none', 
                ease: Power2.easeIn 
            });
        }
    });

    // Recalculate layout after filtering
    animate();
}


document.getElementById('closeSearch').addEventListener('click', () => {
    hideSearch();
});

importFileInput.onchange = function (event) {
    let filereader = new FileReader();

    filereader.onload = function (event) {
        let json = parseJson(event);
        if (!json) return;

        // quiet the listeners so imports do not trigger repeated thumbnail refreshes
        chrome.runtime.sendMessage({ target: 'background', type: 'toggleBookmarkCreatedListener', data: { enable: false } });
        //todo: proceed once we get a response
        //todo: re-enable listener when import complete
        //todo: add an option to fetch new thumbnails or use the included ones

        if (json.dials && json.groups) {
            importFromSD2(json);
        } else if (json.db) {
            importFromFVD(json);
        } else if (json.ohMySwipeDeck) {
            importFromOhMySwipeDeck(json.ohMySwipeDeck);
        } else if (json.ohMySpeedDial) {
            // Backward compatibility with exports made before the project rename.
            importFromOhMySwipeDeck(json.ohMySpeedDial);
        } else if (json.yasd) {
            importFromLegacyExport(json.yasd);
        } else {
            importFromOldLegacyExport(json);
        }
    };

    if (event && event.target && event.target.files) {
        filereader.readAsText(event.target.files[0]);
    }
};

function importFromSD2(json) {
    let bookmarks = json.dials.map(dial => ({
        title: dial.title,
        url: dial.url,
        idgroup: dial.idgroup
    }));

    let groups = json.groups.map(group => ({
        id: group.id,
        title: group.title
    }));

    chrome.storage.local.clear().then(() => {
        // Create groups and bookmarks
        let groupPromises = groups.map(group => {
            if (group.id === 0) {
                return Promise.resolve(swipeDeckId);
            } else {
                return chrome.bookmarks.search({ title: group.title }).then(existingGroups => {
                    const matchingGroups = existingGroups.filter(group => group.parentId === swipeDeckId);
                    if (matchingGroups.length > 0) {
                        return matchingGroups[0].id;
                    } else {
                        return chrome.bookmarks.create({
                            title: group.title,
                            parentId: swipeDeckId
                        }).then(node => node.id);
                    }
                });
            }
        });

        Promise.all(groupPromises).then(groupIds => {
            let bookmarkPromises = bookmarks.map(bookmark => {
                let parentId = groupIds[bookmark.idgroup];
                return chrome.bookmarks.search({ url: bookmark.url }).then(existingBookmarks => {
                    let existsInFolder = existingBookmarks.some(b => b.parentId === parentId);
                    if (!existsInFolder) {
                        return chrome.bookmarks.create({
                            title: bookmark.title,
                            url: bookmark.url,
                            parentId: parentId
                        });
                    }
                });
            });

            return Promise.all(bookmarkPromises);
        }).then(() => {
            hideModals();
            // refresh page
            processRefresh();
            chrome.runtime.sendMessage({ target: 'background', type: 'toggleBookmarkCreatedListener', data: { enable: true } });
        }).catch(err => {
            console.log(err)
            importExportStatus.innerText = i18n('importErrorCreateFoldersSD2')
        });

    }).catch(err => {
        console.log(err)
        importExportStatus.innerText = i18n('genericErrorTryAgain')
    });
}

function importFromFVD(json) {
    let bookmarks = json.db.dials.map(dial => ({
        title: dial.title,
        url: dial.url,
        groupId: dial.group_id
    }));

    let groups = json.db.groups.map(group => ({
        id: group.id,
        title: group.name
    }));

    // clear previous settings and import
    chrome.storage.local.clear().then(() => {
        // Create groups and bookmarks
        let groupPromises = groups.map(group => {
            if (group.id === 1) {
                return Promise.resolve(swipeDeckId);
            } else {
                return chrome.bookmarks.search({ title: group.title }).then(existingGroups => {
                    const matchingGroups = existingGroups.filter(group => group.parentId === swipeDeckId);
                    if (matchingGroups.length > 0) {
                        return matchingGroups[0].id;
                    } else {
                        return chrome.bookmarks.create({
                            title: group.title,
                            parentId: swipeDeckId
                        }).then(node => node.id);
                    }
                });
            }
        });

        Promise.all(groupPromises).then(groupIds => {
            let bookmarkPromises = bookmarks.map(bookmark => {
                let parentId = groupIds[bookmark.groupId];
                return chrome.bookmarks.search({ url: bookmark.url }).then(existingBookmarks => {
                    let existsInFolder = existingBookmarks.some(b => b.parentId === parentId);
                    if (!existsInFolder) {
                        return chrome.bookmarks.create({
                            title: bookmark.title,
                            url: bookmark.url,
                            parentId: parentId
                        });
                    }
                });
            });

            return Promise.all(bookmarkPromises);
        }).then(() => {
            hideModals();
            // refresh page
            processRefresh();
            chrome.runtime.sendMessage({ target: 'background', type: 'toggleBookmarkCreatedListener', data: { enable: true } });
        }).catch(err => {
            console.log(err);
            importExportStatus.innerText = i18n('importErrorCreateFoldersFVD');
        });

    }).catch(err => {
        console.log(err);
        importExportStatus.innerText = i18n('genericErrorTryAgain');
    });
}

function getImportedSettings(exportedSettings) {
    if (!exportedSettings || typeof exportedSettings !== 'object') {
        return cloneDefaultSettings();
    }

    // Older OhMySwipeDeck exports nested the stored settings under a "settings" key.
    if (exportedSettings.settings && typeof exportedSettings.settings === 'object'
        && !Object.prototype.hasOwnProperty.call(exportedSettings, 'activeScene')
        && !Object.prototype.hasOwnProperty.call(exportedSettings, 'wallpaper')) {
        return normalizeSettings(exportedSettings.settings);
    }

    return normalizeSettings(exportedSettings);
}

function remapImportedSceneSettings(importedSettings, folderIdMap) {
    const remappedSettings = normalizeSettings(importedSettings);
    remappedSettings.sceneFolders = {
        work: uniqueStringList(remappedSettings.sceneFolders?.work)
            .map(folderKey => folderKey === '__home__' ? '__home__' : folderIdMap[folderKey])
            .filter(Boolean),
        life: uniqueStringList(remappedSettings.sceneFolders?.life)
            .map(folderKey => folderKey === '__home__' ? '__home__' : folderIdMap[folderKey])
            .filter(Boolean),
    };
    return remappedSettings;
}

function importFromOhMySwipeDeck(swipeDeckData) {
    // Clear previous settings and import new data
    chrome.storage.local.clear().then(() => {
        const importedSettings = getImportedSettings(swipeDeckData.settings);
        const hasImportedSceneSync = !!swipeDeckData.sceneSync;
        const importedSceneSync = normalizeSceneSync(swipeDeckData.sceneSync);
        const importedDials = Array.isArray(swipeDeckData.dials) ? swipeDeckData.dials : [];
        const importedFolders = Array.isArray(swipeDeckData.folders) ? swipeDeckData.folders : [];
        const importedBookmarks = Array.isArray(swipeDeckData.bookmarks) ? swipeDeckData.bookmarks : [];

        // Store dials
        let dialPromises = importedDials.map(dial => {
            let url = Object.keys(dial)[0];
            let dialData = dial[url];
            return chrome.storage.local.set({ [url]: dialData });
        });

        // Create folders and get their IDs
        let folderPromises = importedFolders.sort((a, b) => a.index - b.index).map(folder => {
            return chrome.bookmarks.search({ title: folder.title }).then(existingFolders => {
                const matchingFolders = existingFolders.filter(f => f.parentId === swipeDeckId);
                if (matchingFolders.length > 0) {
                    return { oldId: folder.id, newId: matchingFolders[0].id };
                } else {
                    return chrome.bookmarks.create({
                        title: folder.title,
                        parentId: swipeDeckId
                    }).then(node => {
                        return { oldId: folder.id, newId: node.id };
                    });
                }
            });
        });

        Promise.all(folderPromises).then(folderIdMappings => {
            let folderIdMap = {};
            folderIdMappings.forEach(mapping => {
                folderIdMap[mapping.oldId] = mapping.newId;
            });

            // Create bookmarks using the new folder IDs
            let bookmarkPromises = importedBookmarks.map(bookmark => {
                let parentId = folderIdMap[bookmark.folderid] || swipeDeckId;
                return chrome.bookmarks.search({ url: bookmark.url }).then(existingBookmarks => {
                    let existsInFolder = existingBookmarks.some(b => b.parentId === parentId);
                    if (!existsInFolder) {
                        return chrome.bookmarks.create({
                            title: bookmark.title,
                            url: bookmark.url,
                            parentId: parentId
                        });
                    }
                });
            });

            const remappedSettings = remapImportedSceneSettings(importedSettings, folderIdMap);

            Promise.all([
                ...dialPromises,
                ...bookmarkPromises,
                chrome.storage.local.set({ settings: remappedSettings }),
                chrome.storage.sync
                    ? chrome.storage.sync.set({ [sceneSyncStorageKey]: importedSceneSync })
                    : Promise.resolve(),
            ]).then(() => {
                settings = remappedSettings;
                sceneSync = importedSceneSync;
                sceneLocal = normalizeSceneLocal({ activeScene: remappedSettings.activeScene });
                chrome.storage.local.set({ [sceneLocalStorageKey]: sceneLocal });
                hideModals();
                const finishImport = () => {
                    processRefresh();
                    chrome.runtime.sendMessage({ target: 'background', type: 'toggleBookmarkCreatedListener', data: { enable: true } });
                };
                if (hasImportedSceneSync) {
                    finishImport();
                } else {
                    migrateLegacySceneSettings().then(finishImport);
                }
            }).catch(err => {
                console.log(err);
                importExportStatus.innerText = i18n('importErrorBookmarksDials');
            });
        }).catch(err => {
            console.log(err);
            importExportStatus.innerText = i18n('importErrorCreateFolders');
        });
    }).catch(err => {
        console.log(err);
        importExportStatus.innerText = i18n('genericErrorTryAgain');
    });
}

function importFromLegacyExport(legacyData) {
    importFromOhMySwipeDeck(legacyData);
}

function importFromOldLegacyExport(json) {
    // import from old extension storage format
    chrome.storage.local.clear().then(() => {
        chrome.storage.local.set(json).then(result => {
            hideModals();
            // refresh page
            //tabMessagePort.postMessage({handleImport: true});
            processRefresh();
            chrome.runtime.sendMessage({ target: 'background', type: 'toggleBookmarkCreatedListener', data: { enable: true } });
        }).catch(err => {
            console.log(err)
            importExportStatus.innerText = i18n('importErrorParse')
        });
    }).catch(err => {
        console.log(err)
        importExportStatus.innerText = i18n('genericErrorTryAgain')
    })
}

// native handlers for folder tab target
// container-level handlers to expand/collapse all folder titles
function folderContainerDragEnter(ev) {
    ev.preventDefault();
    this.classList.add('folders-drag-active');
}

function folderContainerDragLeave(ev) {
    // only collapse when truly leaving the container (not entering a child)
    if (this.contains(ev.relatedTarget)) return;
    this.classList.remove('folders-drag-active');
    clearTimeout(folderNavTimeout);
    document.querySelectorAll('.folderTitle.drag-hover').forEach(el => el.classList.remove('drag-hover'));
}

function folderContainerDragOver(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}

// individual folder title handlers for highlight + navigation
function dragenterHandler(ev) {
    ev.preventDefault();
    const el = ev.currentTarget;
    if (!el.classList.contains("folderTitle")) return;

    // clear hover from siblings, highlight this one
    document.querySelectorAll('.folderTitle.drag-hover').forEach(t => t.classList.remove('drag-hover'));
    el.classList.add("drag-hover");

    const folderId = el.getAttribute("folderid");
    clearTimeout(folderNavTimeout);
    if (currentFolder !== folderId) {
        folderNavTimeout = setTimeout(() => {
            selectFolder(folderId);
        }, 350);
    }
}

function dragleaveHandler(ev) {
    const el = ev.currentTarget;
    // ignore if still inside the element (entering a child node)
    if (el.contains(ev.relatedTarget)) return;

    el.classList.remove("drag-hover");

    // only clear nav timeout if we're not entering another folder title
    if (!foldersContainer.querySelector('.folderTitle.drag-hover')) {
        clearTimeout(folderNavTimeout);
    }
}

// Sortable helper fns
function onMoveHandler(evt) {
    if (evt.related) {
        if (evt.to.children.length > 1) {
            // when no bookmarks are present we keep the createdial enabled so we have a drop target for dials dragged into folder
            return !evt.related.classList.contains('createDial');
        } else {
            // force new dial to drop before add dial button
            evt.to.prepend(evt.dragged);
            return false;
        }
    }
}

function dewrap(str) {
    // unlike folder tabs, main dial container doesnt include the folder id
    // todo: cleanup
    if (str === "wrap") {
        return swipeDeckId
    } else {
        return str
    }
}

function onEndHandler(evt) {
    // clean up folder drag-hover state
    document.getElementById('foldersContainer').classList.remove('folders-drag-active');
    document.querySelectorAll('.folderTitle.drag-hover').forEach(el => el.classList.remove('drag-hover'));

    if (evt && evt.clone.href) {
        let id = evt.clone.dataset.id;
        let fromParentId = dewrap(evt.from.id);
        let toParentId = dewrap(evt.to.id);
        let newSiblingId = evt.item.nextElementSibling ? evt.item.nextElementSibling.dataset.id : null;
        let newSiblingParentId = newSiblingId ? dewrap(evt.item.nextElementSibling.parentElement.id) : null;
        let oldIndex = evt.oldIndex;
        let newIndex = evt.newIndex;

        // check if dropped directly onto a folder title (may happen before the 350ms nav timeout fires)
        let dropTarget = evt.originalEvent.target;
        let folderTitleEl = dropTarget.closest ? dropTarget.closest('.folderTitle') : null;
        let droppedOnFolderId = folderTitleEl ? folderTitleEl.getAttribute('folderid') : null;

        // todo: test if this is needed
        if (fromParentId !== toParentId && toParentId !== evt.originalEvent.target.id) {
            // sortable's position doesn't match the dom's drop target
            // this may happen if the tile is dragged over a sortable list but then ultimately dropped somewhere else
            // for example directly on the folder name, or directly onto the new dial button. so use the folder target if available or else currentFolder
            toParentId = droppedOnFolderId || currentFolder || swipeDeckId;
        }

        if (fromParentId === toParentId && fromParentId !== currentFolder) {
            // occurs when there is no sortable target -- for example dropping the dial onto the folder name
            // or some space of the page outside the sortable container element
            toParentId = droppedOnFolderId || currentFolder || swipeDeckId;
        }

        // if the sibling's parent doesnt match the parent we are moving to discard this sibling
        // can occur when dropping onto a non sortable target (like folder name)
        if (newSiblingParentId && newSiblingParentId !== toParentId) {
            newSiblingId = -1;
        }

        if ((fromParentId && toParentId && fromParentId !== toParentId) || oldIndex !== newIndex) {
            moveBookmark(id, fromParentId, toParentId, oldIndex, newIndex, newSiblingId)
        }
    } else if (evt && evt.clone.classList.contains('folderTitle')) {
        let oldIndex = evt.oldIndex;
        let newIndex = evt.newIndex;

        if (newIndex !== oldIndex) {
            if (evt.clone.attributes.folderid) {
                let id = evt.clone.attributes.folderid.value;
                let newSiblingId = evt.item.nextElementSibling ? evt.item.nextElementSibling.attributes.folderid.value : null;
                moveFolder(id, oldIndex, newIndex, newSiblingId)
                requestAnimationFrame(() => centerFolderInRail(currentFolder, 'smooth'));
            }
        }
    }
}

const processRefresh = debounce(({ foldersOnly = false } = {}) => {
    if (foldersOnly) {
        buildFolderPages(swipeDeckId)
    } else {
        // prevent page scroll on refresh
        // react where are you...
        scrollPos = bookmarksContainerParent.scrollTop;
        //noBookmarks.style.display = 'none';
        addFolderButton.style.display = 'inline';
        searchBtn.style.display = '';

        //bookmarksContainer.style.opacity = "0";

        //getBookmarks(swipeDeckId)
        buildDialPages(swipeDeckId, currentFolder).then(() => {
            // rebuild boxes[] with the new dom nodes for the layout animations
            animate();
        });
    }
}, 650, true);

async function getBookmarkFolderByTitle(title) {
    const results = await chrome.bookmarks.search({ title });
    return results.find(bookmark => !bookmark.url) || null;
}

async function getSwipeDeckId() {
    let deckFolder = await getBookmarkFolderByTitle(swipeDeckFolderTitle);

    if (!deckFolder) {
        deckFolder = await getBookmarkFolderByTitle(legacySpeedDialFolderTitle);
        if (deckFolder) {
            await chrome.bookmarks.update(deckFolder.id, { title: swipeDeckFolderTitle });
        }
    }

    if (!deckFolder) {
        deckFolder = await chrome.bookmarks.create({ title: swipeDeckFolderTitle });
    }

    swipeDeckId = deckFolder.id;
    const results = await chrome.bookmarks.getChildren(swipeDeckId);
    folderIds = results
        .filter(result => !result.url && result.title)
        .map(result => result.id);
}

// Preload the image before setting the background
function preloadImage(url) {
    const img = new Image();
    img.src = url;
    return new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
    });
}

/*
// replaced by setBackgroundImages()
function setBackgroundImage(thumb) {
    const setImage = async (element) => {
        if (element) {
            try {
                //await preloadImage(thumb.thumbnail);
                // todo: use a solid color not this gradient shit failed experiment
                element.style.backgroundImage = `url('${thumb.thumbnail}'), ${thumb.bgColor}`;
                // unset the existing bg color
                element.style.backgroundColor = "unset";
            } catch (error) {
                console.error('Error preloading image:', error);
            }
        }
    };

    const id = thumb.parentId + "-" + thumb.id;
    let element = document.getElementById(id);

    if (element) {
        setImage(element);
    } else {
        const observer = new MutationObserver((mutations, obs) => {
            element = document.getElementById(id);
            if (element) {
                setImage(element);
                obs.disconnect();
            }
        });

        const parentElement = document.getElementById(thumb.parentId);

        observer.observe(parentElement, {
            childList: true,
            subtree: true
        });
    }
}
*/

function setBackgroundImages(thumbnails) {
    const elementsToUpdate = [];
    const observers = new Map();

    thumbnails.forEach(thumb => {
        const id = thumb.parentId + "-" + thumb.id;
        let element = document.getElementById(id);

        if (element) {
            elementsToUpdate.push({ element, thumb });
        } else {
            let observer = observers.get(thumb.parentId);
            if (!observer) {
                const parentElement = document.getElementById(thumb.parentId);
                if (!parentElement) return; // Skip if parent is missing

                observer = new MutationObserver((mutations, obs) => {
                    thumbnails.forEach(t => {
                        const el = document.getElementById(t.parentId + "-" + t.id);
                        if (el) {
                            elementsToUpdate.push({ element: el, thumb: t });
                        }
                    });

                    if (elementsToUpdate.length) {
                        batchApplyImages(elementsToUpdate);
                        obs.disconnect();
                    }
                });

                observer.observe(parentElement, { childList: true, subtree: true });
                observers.set(thumb.parentId, observer);
            }
        }
    });

    if (elementsToUpdate.length) {
        batchApplyImages(elementsToUpdate);
    }
}

function batchApplyImages(elements) {
    requestAnimationFrame(() => {
        elements.forEach(({ element, thumb }) => {
            element.classList.remove('favicon-thumb');
            element.style.backgroundColor = "unset";
            element.style.backgroundImage = `url('${thumb.thumbnail}'), ${thumb.bgColor}`;
        });
    });
}

function handleMessages(message) {
    //console.log(message);
    if (!message.target === 'newtab') {
        return
    }

    if (message.data.refresh) {
        hideToast();
        processRefresh();
    } else if(message.data.reloadFolders) {
        hideToast();
        processRefresh({ foldersOnly: true });

    } else if(message.type === 'thumbBatch') {
        // lets update the backgroundImage with the thumbnail for each element using its id (parentId + id)
        // data.thumbs is an array of objects containing id, parentId, thumbnail and bgcolor
        //console.log(message.data);
        // todo: background not working?
        setBackgroundImages(message.data);
        hideToast();
    }
}

function onResize() {
    if (!resizing) {
        requestAnimationFrame(() => {
            layout();
            updateFolderRailLayout();
            centerFolderInRail(currentFolder, 'auto');
            resizing = false;
        });
        resizing = true;
    }
}

function handleSystemThemeChange() {
    if (settings && (!settings.themeMode || settings.themeMode === 'system')) {
        applySettings();
    }
}

if (systemThemeQuery?.addEventListener) {
    systemThemeQuery.addEventListener('change', handleSystemThemeChange);
} else if (systemThemeQuery?.addListener) {
    systemThemeQuery.addListener(handleSystemThemeChange);
}

async function loadInitialSettings() {
    const [localResult, syncResult] = await Promise.all([
        chrome.storage.local.get(['settings', sceneLocalStorageKey]),
        chrome.storage.sync
            ? chrome.storage.sync.get([sceneSyncStorageKey, legacySceneSyncStorageKey]).catch(error => {
                console.warn('Unable to load synced scene settings:', error);
                return {};
            })
            : Promise.resolve({}),
    ]);

    settings = normalizeSettings(localResult.settings || cloneDefaultSettings());
    sceneLocal = normalizeSceneLocal(localResult[sceneLocalStorageKey] || { activeScene: settings.activeScene });
    sceneSync = normalizeSceneSync(syncResult[sceneSyncStorageKey] || syncResult[legacySceneSyncStorageKey]);
    normalizeSceneSettings();
    if (!syncResult[sceneSyncStorageKey] && syncResult[legacySceneSyncStorageKey]) {
        await saveSceneSync();
    }
}

async function migrateLegacySceneSettings() {
    const children = await chrome.bookmarks.getChildren(swipeDeckId);
    const foldersForMigration = getSortedDeckFolders(children);
    const rootHomeBookmarks = children.filter(bookmark => bookmark.url);
    let changed = false;

    for (const sceneId of ['work', 'life']) {
        const legacyKeys = uniqueStringList(settings.sceneFolders?.[sceneId]);
        if (!legacyKeys.length) continue;

        let scene = getSceneById(sceneId);
        if (!scene) {
            scene = normalizeSceneConfig({
                id: sceneId,
                name: getLegacySceneName(sceneId),
                defaultVisibility: 'hide',
                modules: { ...defaultSceneModules },
                rules: [],
            }, sceneId);
            sceneSync.scenes.push(scene);
            changed = true;
        }

        const addMigratedRule = rule => {
            const normalizedRule = normalizeSceneRuleEntry(rule);
            const exists = scene.rules.some(existing =>
                existing.action === normalizedRule.action
                && existing.field === normalizedRule.field
                && existing.value === normalizedRule.value
            );
            if (!exists) {
                scene.rules.push(normalizedRule);
                changed = true;
            }
        };

        for (const legacyKey of legacyKeys) {
            if (legacyKey === '__home__') {
                for (const bookmark of rootHomeBookmarks) {
                    addMigratedRule(createSceneRule('show', 'bookmark.url', bookmark.url));
                }
                continue;
            }

            const matchingFolder = foldersForMigration.find(folder => folder.id === legacyKey);
            addMigratedRule(createSceneRule('show', 'folder.title', matchingFolder?.title || legacyKey));
        }
    }

    if (changed) {
        await saveSceneSync();
    }
}

function init() {

    document.querySelectorAll('[data-locale]').forEach(elem => {
        elem.textContent = i18n(elem.dataset.locale);
    })

    // Handle placeholder translations separately
    document.querySelectorAll('[data-locale-placeholder]').forEach(elem => {
        elem.placeholder = i18n(elem.dataset.localePlaceholder)
    })

    loadInitialSettings()
        .then(() => getSwipeDeckId())
        .then(() => migrateLegacySceneSettings())
        .then(() => {
            if (settings.rememberFolder && settings.currentFolder) {
                currentFolder = settings.currentFolder;
            } else {
                currentFolder = null;
            }
            applySettings().then(() => buildDialPages(swipeDeckId, currentFolder));
        })
        .catch(error => {
            console.log(error);
        });



    sidenav.style.display = "flex";

    // container-level drag listeners for expanding folder titles
    const foldersContainerEl = document.getElementById('foldersContainer');
    foldersContainerEl.addEventListener('dragenter', folderContainerDragEnter);
    foldersContainerEl.addEventListener('dragleave', folderContainerDragLeave);
    foldersContainerEl.addEventListener('dragover', folderContainerDragOver);
    window.addEventListener('wheel', handleFolderRailWheel, { passive: false });
    foldersRail.addEventListener('scroll', () => requestAnimationFrame(updateFolderRailEdgeState), { passive: true });

    sortable = new Sortable(foldersContainer, {
        animation: 150,
        direction: 'horizontal',
        forceFallback: true,
        fallbackOnBody: true,
        fallbackTolerance: 3,
        swapThreshold: 0.48,
        invertedSwapThreshold: 0.7,
        scroll: true,
        scrollSensitivity: 64,
        scrollSpeed: 12,
        filter: "#homeFolderLink",
        ghostClass: 'folderSortGhost',
        fallbackClass: 'folderSortFallback',
        dragClass: 'dragging',
        chosenClass: 'folderSortChosen',
        onChoose: function (evt) {
            setFolderDragGrabOffset(evt.originalEvent, evt.item);
        },
        onStart: function (evt) {
            clearTimeout(folderRailSettleTimeout);
            clearTimeout(folderNavTimeout);
            clearFolderRailPreview();
            document.body.classList.add('folderRailDragging');
            document.getElementById('foldersContainer').classList.remove('folders-drag-active');
            document.querySelectorAll('.folderTitle.drag-hover').forEach(el => el.classList.remove('drag-hover'));
            startFolderDragPointerSync(evt.originalEvent);
        },
        onMove: function (evt) {
            return !evt.related || evt.related.id !== 'homeFolderLink';
        },
        onEnd: function (evt) {
            stopFolderDragSync();
            document.body.classList.remove('folderRailDragging');
            onEndHandler(evt);
            requestAnimationFrame(() => centerFolderInRail(currentFolder, 'smooth'));
        },
        onUnchoose: function () {
            stopFolderDragSync();
        }
    });

    window.addEventListener('resize', onResize);

}

init();
