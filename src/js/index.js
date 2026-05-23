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
let isToastVisible = false;
const folderRailSettleDelay = 115;
const systemThemeQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
const themePalettes = {
    dark: {
        backgroundColor: '#0d0f0f',
        textColor: '#f4f1e8',
    },
    light: {
        backgroundColor: '#f4efe6',
        textColor: '#17201b',
    },
};
const themeDefaultColors = {
    backgroundColor: new Set(Object.values(themePalettes).map(palette => palette.backgroundColor.toLowerCase())),
    textColor: new Set(Object.values(themePalettes).map(palette => palette.textColor.toLowerCase())),
};

let folderIds = [];

let defaults = {
    wallpaper: true,
    wallpaperSrc: 'img/bg.jpg',
    themeMode: 'system',
    backgroundColor: '#0d0f0f',
    largeTiles: true,
    rememberFolder: false,
    showTitles: true,
    showAddSite: true,
    showFolders: true,
    showSettingsBtn: true,
    showClock: false,
    showSearchBtn: true,
    maxCols: '100',
    defaultSort: 'first',
    defaultOpen: 'current',
    textColor: '#f4f1e8',
    dialSize: 'large',
    dialRatio: 'wide',
    currentFolder: null,
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

function i18n(key) {
    return chrome.i18n.getMessage(key) || key;
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
    document.body.classList.toggle('themeLight', resolvedTheme === 'light');
    document.body.classList.toggle('themeDark', resolvedTheme === 'dark');
    document.documentElement.dataset.theme = resolvedTheme;
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

    const children = await getChildren(swipeDeckId);
    if (!children.length) {
        // new install
        addFolderButton.style.display = 'none';
        searchBtn.style.display = 'none';
        printNewSetup();
        return;
    }

    const folders = children.filter(folder => !folder.url);

    // Include the root deck folder
    folders.push({ id: swipeDeckId, title: homeFolderTitle, index: -1 });

    // sort folders
    folders.sort((a, b) => {
        return (a.index || 0) - (b.index || 0);
    });

    // clear any existing data so we can refresh
    foldersContainer.innerHTML = '';

    // Build folder header links
    if (folders && folders.length > 1) {
        for (let folder of folders) {
            folderLink(folder.title, folder.id);
        }
        requestAnimationFrame(() => {
            updateFolderRailLayout();
            centerFolderInRail(currentFolderId, 'auto');
        });
    }

    // Process the current folder's children first
    const currentChildren = await getChildren(currentFolderId);
    await printBookmarks(currentChildren, currentFolderId);


    // Process the rest of the folders, if there are more. exclude the current folder
    if (folders.length > 1) {
        for (let folder of folders) {
            if (folder.id !== currentFolderId) {
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

    const children = await getChildren(swipeDeckId);
    if (!children.length) {
        // new install
        addFolderButton.style.display = 'none';
        searchBtn.style.display = 'none';
        printNewSetup();
        return;
    }

    const folders = children.filter(folder => !folder.url);

    // Include the root deck folder
    folders.push({ id: swipeDeckId, title: homeFolderTitle, index: -1 });

    // sort folders
    folders.sort((a, b) => {
        return (a.index || 0) - (b.index || 0);
    });

    // clear any existing data so we can refresh
    foldersContainer.innerHTML = '';

    // Build folder header links
    if (folders && folders.length > 1) {
        for (let folder of folders) {
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

function showFolder(id) {
    hideSettings();
    let folders = document.getElementsByClassName('container');
    for (let folder of folders) {
        if (folder.id === id) {
            folder.style.display = "flex"
            folder.style.opacity = "0";
            layoutFolder = true;
            // transition between folders. todo more elegant solution
            setTimeout(function () {
                //layoutFolder = id;
                folder.style.opacity = "1";
                animate()
            }, 20);
        } else {
            folder.style.display = "none";
        }
    }
    // style the active tab
    let folderTitles = document.getElementsByClassName('folderTitle');
    for (let title of folderTitles) {
        if (title.attributes.folderid.value === id) {
            title.classList.add('activeFolder');
        } else {
            title.classList.remove('activeFolder');
        }
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
    centerFolderInRail(id);

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
    document.body.classList.remove('folderRailScrubbing');
    document.querySelectorAll('.folderTitle.scrubPreviewFolder').forEach(folder => {
        folder.classList.remove('scrubPreviewFolder');
    });
    folderRailScrubTarget = null;
    folderRailScrubStartIndex = null;
    folderRailScrubDelta = 0;
}

function updateFolderRailPreview(folder) {
    if (!folder) return null;
    const nextTarget = folder.getAttribute('folderid');
    if (nextTarget === folderRailScrubTarget) return folder;

    document.body.classList.add('folderRailScrubbing');
    document.querySelectorAll('.folderTitle.scrubPreviewFolder').forEach(previewFolder => {
        previewFolder.classList.remove('scrubPreviewFolder');
    });
    folder.classList.add('scrubPreviewFolder');
    folderRailScrubTarget = nextTarget;
    centerFolderInRail(nextTarget, 'smooth');

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
    selectFolder(targetId, { keepRailPreview: true });
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
    const targetIndex = Math.min(
        folders.length - 1,
        Math.max(0, folderRailScrubStartIndex + indexOffset)
    );

    requestAnimationFrame(() => {
        updateFolderRailEdgeState();
        updateFolderRailPreview(folders[targetIndex]);
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
    let parent = currentFolder ? currentFolder : swipeDeckId;

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
        folderContainerEl.style.opacity = "0";

        if (currentFolder === swipeDeckId) {
            setTimeout(() => {
                folderContainerEl.style.opacity = "1";
                animate();
            }, 20);
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
        buildCreateDialModal(parentId);
        modalShowEffect(createDialModalContent, createDialModal);
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

async function printBookmarks(bookmarks, parentId) {
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

            if (bookmark.url?.startsWith("http") || bookmark.url?.startsWith("file:") || bookmark.url?.startsWith("chrome:")) {
                //let images = thumbnails[bookmark.url] || {};
                //let thumbUrl = images.thumbnails?.[images.thumbIndex] || null;
                //let thumbBg = images.bgColor || null;

                let a = document.createElement('a');
                a.classList.add('tile');
                a.href = bookmark.url;
                a.setAttribute('data-id', bookmark.id);

                let main = document.createElement('div');
                main.classList.add('tile-main');

                let content = document.createElement('div');
                content.setAttribute('id', bookmark.parentId + "-" + bookmark.id);
                content.classList.add('tile-content', 'favicon-thumb');
                //content.style.backgroundImage = thumbBg ? `url('${thumbUrl}'), ${thumbBg}` : '';
                //content.style.backgroundColor = thumbBg ? '' : 'rgba(255, 255, 255, 0.5)';
                content.style.backgroundImage = `url("${getFaviconUrl(bookmark.url)}")`;

                let title = document.createElement('div');
                title.classList.add('tile-title');
                if (!settings.showTitles) {
                    title.classList.add('hide');
                }
                title.textContent = bookmark.title;

                main.append(content, title);
                a.appendChild(main);
                fragment.appendChild(a);
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
    let folderContainerEl = document.getElementById(parentId);
    if (!folderContainerEl) {
        folderContainerEl = document.createElement('div');
        folderContainerEl.id = parentId;
        folderContainerEl.classList.add('container');
        folderContainerEl.style.display = currentFolder === parentId ? 'flex' : 'none';
        //folderContainerEl.style.opacity = settings.rememberFolder && currentFolder === parentId ? '0' : '1';
        folderContainerEl.style.opacity = "0";

        if (currentFolder === parentId) {
            setTimeout(() => {
                folderContainerEl.style.opacity = "1";
                animate();
            }, 20);
            document.querySelector(`[folderid="${currentFolder}"]`)?.classList.add('activeFolder');
        }
        bookmarksContainerParent.append(folderContainerEl);
    }

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
    createDialModalURL.value = '';
    createDialModalURL.parentId = parentId ? parentId : swipeDeckId;
    createDialModalURL.focus();
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

    chrome.bookmarks.create({
        title: url,
        url: url,
        parentId: createDialModalURL.parentId
    }).then(node => {
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

function resizeBackground(dataURI) {
    return new Promise(function (resolve, reject) {
        let img = new Image();
        img.onload = function () {
            if (this.height > screen.height) {
                let height = screen.height;
                let ratio = height / this.height;
                let width = Math.round(this.width * ratio);

                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d', { willReadFrequently: true });
                ctx.imageSmoothingEnabled = true;

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(this, 0, 0, width, height);

                // todo: remove this whenever firefox supports webp. in meantime we fallback to jpg for speed
                if (chrome.runtime.getBrowserInfo) {
                    const newDataURI = canvas.toDataURL('image/jpeg', 0.8);
                    resolve(newDataURI);
                } else {
                    const newDataURI = canvas.toDataURL('image/webp', 0.87);
                    resolve(newDataURI);
                }
            } else {
                resolve(dataURI);
            }
        };
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
                document.body.style.background = '';
                document.body.style.backgroundSize = '';
                document.body.classList.add('gradientBackground');
            } else {
                // Remove the gradient class and apply custom background
                document.body.classList.remove('gradientBackground');
                document.body.style.background = `url("${settings.wallpaperSrc}") no-repeat top center fixed`;
                document.body.style.backgroundSize = 'cover';
            }
        } else {
            // Remove the gradient class and apply solid background color
            document.body.classList.remove('gradientBackground');
            document.body.style.background = backgroundColor;
        }

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
            clock.style.setProperty('--clock', 'block');
        } else {
            clock.style.setProperty('--clock', 'none');
        }

        if (settings.showSettingsBtn) {
            settingsBtn.style.setProperty('--settings', 'block');
        } else {
            settingsBtn.style.setProperty('--settings', 'none');
        }

        if (settings.showSearchBtn) {
            searchBtn.style.setProperty('--search', 'block');
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
        rememberFolderInput.checked = settings.rememberFolder;

        if (settings.wallpaperSrc) {
            imgPreview.setAttribute('src', getStoredWallpaperSrc(settings.wallpaperSrc));
            //imgPreview.style.display = 'block';
            imgPreview.onload = function (e) {
                if (settings.wallpaper) {
                    backgroundColorContainer.style.display = "none";
                    previewContainer.style.opacity = '1';
                    switchesContainer.style.transform = "translateY(0)";

                    //backgroundColorContainer.style.display = 'none';
                } else {
                    backgroundColorContainer.style.display = "flex";
                    previewContainer.style.opacity = '0';
                    switchesContainer.style.transform = `translateY(-${previewContainer.offsetHeight}px)`;
                }
            }
            imgPreview.onerror = function (e) {
                // reset to default on error with user image
                settings.wallpaperSrc = 'img/bg.jpg';
                imgPreview.setAttribute('src', settings.wallpaperSrc);
                chrome.storage.local.set({ settings });
            }
        }

    });
}

function saveSettings() {
    settings.wallpaper = wallPaperEnabled.checked;
    settings.wallpaperSrc = getStoredWallpaperSrc(imgPreview.getAttribute('src') || imgPreview.src);
    settings.themeMode = themeModeInput.value;
    settings.backgroundColor = color_picker.value;
    settings.textColor = textColor_picker.value;
    settings.showTitles = showTitlesInput.checked;
    settings.showAddSite = showCreateDialInput.checked;
    settings.largeTiles = largeTilesInput.checked;
    settings.showFolders = showFoldersInput.checked;
    settings.showClock = showClock.checked;
    settings.showSettingsBtn = showSettingsBtn.checked;
    settings.showSearchBtn = showSearchBtnInput.checked;
    settings.maxCols = maxColsInput.value;
    settings.dialSize = dialSizeInput.value;
    settings.dialRatio = dialRatioInput.value;
    settings.defaultSort = defaultSortInput.value;
    settings.defaultOpen = defaultOpenInput.value;
    settings.rememberFolder = rememberFolderInput.checked;
    settings.currentFolder = currentFolder ? currentFolder : swipeDeckId;

    applySettings();

    chrome.storage.local.set({ settings })
        .then(() => {
            /*
            settingsToast.style.opacity = "1";
            setTimeout(function () {
                settingsToast.style.opacity = "0";
            }, 3500);
             */

            //tabMessagePort.postMessage({updateSettings: true});
        });
}

// override context menu
document.addEventListener("contextmenu", function (e) {
    if (e.target.type === 'text' && (e.target.id === 'modalTitle' || e.target.id === 'modalURL' || e.target.id === 'modalImageURLInput' || e.target.id === 'createDialModalURL')) {
        return;
    }
    e.preventDefault();
    // prevent settings from being opened and immediately hidden when right-clicking the gear icon
    if (e.target.id === 'settingsDiv') {
        return;
    }
    hideSettings();
    const tileTarget = e.target.closest ? e.target.closest('.tile:not(.createDial)') : null;
    if (tileTarget && (e.target.classList.contains('tile-content') || e.target.classList.contains('tile-title') || document.body.classList.contains('flowDial'))) {
        const tileContent = tileTarget.querySelector('.tile-content');
        const tileTitle = tileTarget.querySelector('.tile-title');
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
window.addEventListener("click", e => {
    if (typeof e.target.className === 'string' && e.target.className.indexOf('settingsCtl') >= 0) {
        return;
    }
    if (e.target.closest && e.target.closest('.tile:not(.createDial)')) {
        let tile = e.target.closest('.tile');
        if (openTile(tile, e)) {
            e.preventDefault();
        }
        return;
    }
    e.preventDefault();
});

window.addEventListener("auxclick", e => {
    if (e.button === 1 && e.target.closest && e.target.closest('.tile:not(.createDial)')) {
        let tile = e.target.closest('.tile');
        if (openTile(tile, e)) {
            e.preventDefault();
        }
    }
});

// listen for menu item
window.addEventListener("mousedown", e => {
    hideMenus();
    if (e.target.type === 'text' || e.target.id === 'themeMode' || e.target.id === 'maxcols' || e.target.id === 'defaultSort' || e.target.id === 'defaultOpen' || e.target.id === 'dialSize' || e.target.id === 'dialRatio') {
        return
    }
    if (e.target.className.baseVal === 'gear') {
        openSettings();
        return;
    }
    if (e.target.closest('#splashAddDial')) {
        e.preventDefault();
        buildCreateDialModal(currentFolder);
        modalShowEffect(createDialModalContent, createDialModal);
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
                    buildModal(targetTileHref, targetTileTitle).then(() => {
                        modalShowEffect(modalContent, modal);
                    });
                    break;
                case 'refresh':
                    refreshThumbnails(targetTileHref, targetTileId);
                    break;
                case 'refreshAll':
                    modalShowEffect(refreshAllModalContent, refreshAllModal);
                    break;
                case 'delete':
                    removeBookmark(targetTileHref);
                    break;
                case 'editFolder':
                    //buildFolderModal(targetFolder, targetFolderName);
                    editFolderModalName.value = targetFolderName;
                    modalShowEffect(editFolderModalContent, editFolderModal);
                    break;
                case 'deleteFolder':
                    deleteFolderModalName.textContent = targetFolderName;
                    modalShowEffect(deleteFolderModalContent, deleteFolderModal);
                    break;
                case 'newDial':
                    // prevent default required to stop focus from leaving the modal input
                    e.preventDefault();
                    buildCreateDialModal(currentFolder);
                    modalShowEffect(createDialModalContent, createDialModal);
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

wallPaperEnabled.oninput = function (e) {
    saveSettings()
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
        imgPreview.setAttribute('src', imagedata);
        imgPreview.style.display = 'block';
        // dynamically set text color based on background
        /*
        getAverageRGB(imagedata).then(rgb => {
            let textColor = contrast(rgb);
            settings.textColor = textColor
            document.documentElement.style.setProperty('--color', textColor);
        });
         */
        saveSettings()
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
            for (const [key, value] of Object.entries(items)) {
                if (key.startsWith('settings')) {
                    swipeDeckJson.ohMySwipeDeck.settings[key] = value;
                } else if (key.startsWith('http') || key.startsWith('file:') || key.startsWith('chrome:')) {
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
        settings = JSON.parse(JSON.stringify(defaults));
        chrome.storage.local.set({ settings }).then(() => {
            applySettings();
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

function filterDials(searchTerm) {
    const currentParent = currentFolder;
    const dials = document.querySelectorAll(`[id="${currentParent}"] > .tile`);

    dials.forEach(dial => {
        if (!settings.showAddSite && dial.classList.contains('createDial')) {
            // dont show the create dial button
            return;
        }

        const title = dial.querySelector('.tile-title')?.textContent.toLowerCase();
        const url = dial.href.toLowerCase();

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

function importFromOhMySwipeDeck(swipeDeckData) {
    // Clear previous settings and import new data
    chrome.storage.local.clear().then(() => {
        // Store settings
        if (swipeDeckData.settings) {
            chrome.storage.local.set({ settings: swipeDeckData.settings });
        }

        // Store dials
        let dialPromises = swipeDeckData.dials.map(dial => {
            let url = Object.keys(dial)[0];
            let dialData = dial[url];
            return chrome.storage.local.set({ [url]: dialData });
        });

        // Create folders and get their IDs
        let folderPromises = swipeDeckData.folders.sort((a, b) => a.index - b.index).map(folder => {
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
            let bookmarkPromises = swipeDeckData.bookmarks.map(bookmark => {
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

            Promise.all([...dialPromises, ...bookmarkPromises]).then(() => {
                hideModals();
                // Refresh page
                processRefresh();
                chrome.runtime.sendMessage({ target: 'background', type: 'toggleBookmarkCreatedListener', data: { enable: true } });
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

function init() {

    document.querySelectorAll('[data-locale]').forEach(elem => {
        elem.textContent = chrome.i18n.getMessage(elem.dataset.locale);
    })

    // Handle placeholder translations separately
    document.querySelectorAll('[data-locale-placeholder]').forEach(elem => {
        elem.placeholder = chrome.i18n.getMessage(elem.dataset.localePlaceholder)
    })

    // init what used to be background work"
    // build a thumbnail cache of url:thumbUrl pairs
    // todo: slow; lets get the current tab first
    chrome.storage.local.get('settings').then(result => {
        if (result) {
            if (result.settings) {
                settings = Object.assign({}, defaults, result.settings);
            } else {
                settings = defaults;
            }
            /*
            const entries = Object.entries(result);
            for (let e of entries) {
                //console.log(e);
                // todo: filter folder ids
                if (e[0] !== "settings" && e[1].thumbnails) {
                    let index = e[1].thumbIndex;
                    cache[e[0]] = [e[1].thumbnails[index], e[1].bgColor];
                }
            }
            */
        }

        getSwipeDeckId().then(() => {
            if (settings.rememberFolder && settings.currentFolder
                && folderIds.includes(settings.currentFolder)) {
                currentFolder = settings.currentFolder;
            } else {
                currentFolder = swipeDeckId;
            }
            applySettings().then(() => buildDialPages(swipeDeckId, currentFolder));
        }, error => {
            console.log(error);
        });
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
