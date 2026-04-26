/*
  Clean Marmite Theme JavaScript

  This file contains basic interactivity for the theme.
  You can extend it with your own custom functionality.
*/

// Theme switcher - light/dark
const themeSwitcher = {
    // Config
    _scheme: "auto",
    toggleButton: document.querySelectorAll(".theme-toggle"),
    rootAttribute: "data-theme",
    localStorageKey: "picoPreferredColorScheme",

    // Init
    init() {
        this.scheme = this.schemeFromLocalStorage;
        this.initToggle();
        this.updateIcon();
    },

    // Get color scheme from local storage
    get schemeFromLocalStorage() {
        return window.localStorage?.getItem(this.localStorageKey);
    },

    // Preferred color scheme
    get preferredColorScheme() {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    },

    // Init toggle
    initToggle() {
        // for each toggle button add event listener
        this.toggleButton.forEach((button) => {
            button.addEventListener(
                "click",
                (event) => {
                    event.preventDefault();
                    // Toggle scheme
                    this.scheme = this.scheme === "dark" ? "light" : "dark";
                    this.updateIcon();
                },
                false
            );
        });
    },

    // Set scheme
    set scheme(scheme) {
        if (scheme == "auto") {
            this._scheme = this.preferredColorScheme;
        } else if (scheme == "dark" || scheme == "light") {
            this._scheme = scheme;
        }
        this.applyScheme();
        this.schemeToLocalStorage();
    },

    // Get scheme
    get scheme() {
        return this._scheme;
    },

    // Apply scheme
    applyScheme() {
        document.querySelector("html")?.setAttribute(this.rootAttribute, this.scheme);
        const githubTheme = this.scheme === "dark" ? "-dark" : "";
        document.querySelector("#highlightjs-theme")?.setAttribute("href", `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/github${githubTheme}.min.css`);
    },

    // Store scheme to local storage
    schemeToLocalStorage() {
        window.localStorage?.setItem(this.localStorageKey, this.scheme);
    },

    // Update icon based on the current scheme
    updateIcon() {
        // for each toggle button update icon
        this.toggleButton.forEach((button) => {
            if (this.scheme === "dark") {
                button.innerHTML = "&#9788;"; // Sun icon for light mode
                button.title = "light mode";
            } else {
                button.innerHTML = "&#9789;"; // Moon icon for dark mode
                button.title = "dark mode";
            }
        });
    },
};

// Init theme switcher
themeSwitcher.init();

// Colorscheme switcher
function colorschemeSwitcher() {
    const colorschemes = [
        'catppuccin',
        'clean',
        'dracula',
        'github',
        'gruvbox',
        'iceberg',
        'minimal',
        'minimal_wb',
        'monokai',
        'nord',
        'one',
        'solarized',
        'typewriter'
    ];

    const colorschemeDropdown = document.querySelectorAll('.colorscheme-toggle');

    colorschemeDropdown.forEach((dropdown) => {

        dropdown.addEventListener('change', function () {
            const colorscheme = this.value;
            const colorschemeLink = document.querySelector('#colorscheme-link');
            if (colorscheme === 'default') {
                if (colorschemeLink) {
                    colorschemeLink.remove();
                }

                localStorage.removeItem('marmitePreferredColorScheme');
                return;
            }
            if (colorschemeLink) {
                colorschemeLink.href = `static/colorschemes/${colorscheme}.css`;
            } else {
                const link = document.createElement('link');
                link.id = 'colorscheme-link';
                link.rel = 'stylesheet';
                link.href = `static/colorschemes/${colorscheme}.css`;
                document.head.appendChild(link);
            }
            localStorage.setItem('marmitePreferredColorScheme', colorscheme);

            colorschemeDropdown.forEach((dropdown) => {
                dropdown.value = colorscheme;
            });
        });

        colorschemes.forEach((colorscheme) => {
            const option = document.createElement('option');
            option.value = colorscheme;
            option.textContent = colorscheme;
            dropdown.appendChild(option);
        });

        const colorscheme = localStorage.getItem('marmitePreferredColorScheme');
        if (colorscheme) {
            dropdown.value = colorscheme;
            dropdown.dispatchEvent(new Event('change'));
        }
    });
}

// Add event listener for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    themeSwitcher.scheme = e.matches ? 'dark' : 'light';
});

document.addEventListener('DOMContentLoaded', function() {
    document.documentElement.classList.add('js');

    // Smooth top loading indicator between page navigations
    initializePageLoadingProgress();

    // Search functionality
    initializeSearch();
    
    // Mobile menu toggle (if you add a mobile menu)
    initializeMobileMenu();
    
    // Gallery thumbnail drag scrolling
    initializeGalleryThumbnailScroll();

    // Scroll reveal for gallery blocks
    initializeGalleryScrollAnimations();

    // Dynamic author hero accents
    initializeAuthorProfileHero();

    // Dynamic Material-like palette from post banner image
    initializeDynamicPostPalette();

    // Smooth scrolling for anchor links
    initializeSmoothScroll();
    
    // External link handling
    initializeExternalLinks();
});

/**
 * Generate and apply a dynamic Material-like palette for individual post pages
 * using the post banner image as source color.
 */
function initializeDynamicPostPalette() {
    const isPostPage = Boolean(document.querySelector('.content-article'));
    if (!isPostPage) {
        return;
    }

    const bannerImage = document.querySelector('main .item-banner img');
    if (!bannerImage) {
        return;
    }

    let isSameOrigin = false;
    try {
        const bannerUrl = new URL(bannerImage.currentSrc || bannerImage.src, window.location.href);
        isSameOrigin = bannerUrl.origin === window.location.origin;
    } catch (error) {
        isSameOrigin = false;
    }

    // Skip cross-origin images to avoid canvas CORS issues.
    if (!isSameOrigin) {
        return;
    }

    const applyPalette = () => {
        const sourceHsl = extractImageSourceHsl(bannerImage);
        if (!sourceHsl) {
            return;
        }

        const palette = buildMaterial3Palette(sourceHsl);
        if (!palette) {
            return;
        }

        const root = document.documentElement;
        document.body.classList.add('dynamic-post-palette');
        root.style.setProperty('--m3-primary', palette.primary);
        root.style.setProperty('--m3-on-primary', palette.onPrimary);
        root.style.setProperty('--m3-primary-container', palette.primaryContainer);
        root.style.setProperty('--m3-secondary', palette.secondary);
        root.style.setProperty('--m3-tertiary', palette.tertiary);
        root.style.setProperty('--m3-surface', palette.surface);
        root.style.setProperty('--m3-surface-container', palette.surfaceContainer);
        root.style.setProperty('--m3-outline', palette.outline);
        root.style.setProperty('--m3-on-surface', palette.onSurface);

        // Apply palette to existing theme tokens used by the stylesheet.
        root.style.setProperty('--primary-color', palette.primary);
        root.style.setProperty('--link-color', palette.primary);
        root.style.setProperty('--link-hover-color', palette.secondary);
        root.style.setProperty('--secondary-color', palette.surfaceContainer);
        root.style.setProperty('--background-color', palette.surface);
        root.style.setProperty('--border-color', palette.outline);
        root.style.setProperty('--text-color', palette.onSurface);
    };

    if (bannerImage.complete && bannerImage.naturalWidth > 0) {
        applyPalette();
        return;
    }

    bannerImage.addEventListener('load', applyPalette, { once: true });
}

function extractImageSourceHsl(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
        return null;
    }

    const size = 32;
    canvas.width = size;
    canvas.height = size;

    try {
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;

        for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3];
            if (alpha < 180) {
                continue;
            }

            const pr = data[i];
            const pg = data[i + 1];
            const pb = data[i + 2];
            const luminance = 0.2126 * pr + 0.7152 * pg + 0.0722 * pb;

            // Ignore only extreme near-black/near-white noise; preserve dark images.
            if (luminance < 4 || luminance > 251) {
                continue;
            }

            r += pr;
            g += pg;
            b += pb;
            count += 1;
        }

        if (count === 0) {
            return null;
        }

        return rgbToHsl(Math.round(r / count), Math.round(g / count), Math.round(b / count));
    } catch (error) {
        return null;
    }
}

function buildMaterial3Palette(sourceHsl) {
    if (!sourceHsl || sourceHsl.length !== 3) {
        return null;
    }

    const [h, s, l] = sourceHsl;
    const isDark = isCurrentThemeDark();

    const sourceTone = clampNumber(l, 2, 98);
    const primaryChroma = clampNumber(s + 8, 16, 88);
    const secondaryChroma = clampNumber((s * 0.45) + 8, 8, 42);
    const tertiaryChroma = clampNumber((s * 0.58) + 8, 10, 50);
    const neutralChroma = clampNumber((s * 0.16) + 4, 4, 18);
    const neutralVariantChroma = clampNumber((s * 0.22) + 6, 6, 26);

    if (isDark) {
        const surfaceTone = clampNumber((sourceTone * 0.36) + 6, 6, 22);
        const surfaceContainerTone = clampNumber(surfaceTone + 5, 10, 28);
        const primaryTone = sourceTone < 20 ? 58 : 68;
        const secondaryTone = clampNumber(primaryTone + 3, 62, 76);
        const tertiaryTone = clampNumber(primaryTone + 1, 62, 76);

        return {
            primary: hslToHex(h, primaryChroma, primaryTone),
            onPrimary: hslToHex(h, Math.max(8, neutralChroma), 12),
            primaryContainer: hslToHex(h, Math.max(10, primaryChroma - 20), 32),
            secondary: hslToHex((h + 22) % 360, secondaryChroma, secondaryTone),
            tertiary: hslToHex((h + 58) % 360, tertiaryChroma, tertiaryTone),
            surface: hslToHex(h, neutralChroma, surfaceTone),
            surfaceContainer: hslToHex(h, neutralVariantChroma, surfaceContainerTone),
            outline: hslToHex(h, neutralVariantChroma, clampNumber(surfaceContainerTone + 14, 24, 42)),
            onSurface: '#f3f4f6'
        };
    }

    const surfaceTone = clampNumber((sourceTone * 0.82) + 14, 16, 97);
    const surfaceContainerTone = clampNumber(surfaceTone - 4, 12, 94);
    const primaryTone = sourceTone < 20 ? 40 : 42;
    const secondaryTone = clampNumber(primaryTone - 6, 30, 40);
    const tertiaryTone = clampNumber(primaryTone - 4, 30, 40);

    const surfaceHex = hslToHex(h, neutralChroma, surfaceTone);
    const onSurface = getReadableOnColor(hexToRgb(surfaceHex));

    return {
        primary: hslToHex(h, primaryChroma, primaryTone),
        onPrimary: hslToHex(h, Math.max(8, neutralChroma), 97),
        primaryContainer: hslToHex(h, Math.max(10, primaryChroma - 20), 88),
        secondary: hslToHex((h + 22) % 360, secondaryChroma, secondaryTone),
        tertiary: hslToHex((h + 58) % 360, tertiaryChroma, tertiaryTone),
        surface: surfaceHex,
        surfaceContainer: hslToHex(h, neutralVariantChroma, surfaceContainerTone),
        outline: hslToHex(h, neutralVariantChroma, clampNumber(surfaceContainerTone - 20, 24, 74)),
        onSurface
    };
}

function clampNumber(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function initializePageLoadingProgress() {
    if (window.__marmiteProgressInitialized) {
        return;
    }
    window.__marmiteProgressInitialized = true;

    const progress = document.createElement('div');
    progress.className = 'page-load-progress';
    progress.innerHTML = '<div class="page-load-progress-bar"></div>';
    document.body.prepend(progress);

    const bar = progress.firstElementChild;
    let progressValue = 0;
    let trickleTimer = null;

    const setProgress = (value) => {
        progressValue = clampNumber(value, 0, 100);
        bar.style.transform = `scaleX(${progressValue / 100})`;
    };

    const start = () => {
        document.body.classList.add('is-page-loading');
        progress.classList.add('is-active');
        progress.classList.remove('is-done');
        setProgress(8);

        if (trickleTimer) {
            window.clearInterval(trickleTimer);
        }

        trickleTimer = window.setInterval(() => {
            if (progressValue >= 88) {
                return;
            }
            setProgress(progressValue + Math.random() * 7);
        }, 150);
    };

    const finish = () => {
        if (trickleTimer) {
            window.clearInterval(trickleTimer);
            trickleTimer = null;
        }

        setProgress(100);
        progress.classList.add('is-done');
        document.body.classList.remove('is-page-loading');

        window.setTimeout(() => {
            progress.classList.remove('is-active', 'is-done');
            setProgress(0);
        }, 320);
    };

    window.addEventListener('beforeunload', start);
    window.addEventListener('pageshow', finish);
    window.addEventListener('load', finish);

    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href]');
        if (!link) {
            return;
        }

        if (link.target === '_blank' || link.hasAttribute('download')) {
            return;
        }

        const href = link.getAttribute('href') || '';
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('javascript:')) {
            return;
        }

        let targetUrl;
        try {
            targetUrl = new URL(link.href, window.location.href);
        } catch (error) {
            return;
        }

        const samePage = targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search;
        if (samePage || targetUrl.origin !== window.location.origin) {
            return;
        }

        start();
        setProgress(18);
    });

    finish();
}

function isCurrentThemeDark() {
    const htmlTheme = document.documentElement.getAttribute('data-theme');
    if (htmlTheme === 'dark') {
        return true;
    }
    if (htmlTheme === 'light') {
        return false;
    }

    const bgColor = getComputedStyle(document.body).backgroundColor;
    const rgb = parseCssRgb(bgColor);
    if (!rgb) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    const [r, g, b] = rgb;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance < 130;
}

function parseCssRgb(value) {
    const match = value && value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!match) {
        return null;
    }

    return [Number.parseInt(match[1], 10), Number.parseInt(match[2], 10), Number.parseInt(match[3], 10)];
}

/**
 * Initialize dynamic author profile accent colors from avatar image.
 */
function initializeAuthorProfileHero() {
    const authorProfiles = document.querySelectorAll('.author-hero-card');

    authorProfiles.forEach((profile) => {
        const avatar = profile.querySelector('.author-avatar');
        if (!avatar) {
            return;
        }

        const avatarUrl = avatar.currentSrc || avatar.src;
        const authorName = profile.querySelector('.author-hero-title')?.textContent?.trim() || avatar.alt || avatarUrl;
        const applyFallbackAccent = () => {
            const computedStyles = getComputedStyle(document.documentElement);
            const secondaryColor = computedStyles.getPropertyValue('--secondary-color').trim() || getComputedStyle(document.body).backgroundColor || '#e0e0e0';
            const textColor = computedStyles.getPropertyValue('--text-color').trim() || '#1f1f1f';
            profile.style.setProperty('--author-accent', secondaryColor);
            profile.style.setProperty('--author-accent-dark', mixHexColors(secondaryColor, textColor, 0.28));
            profile.style.setProperty('--author-accent-soft', mixHexColors(secondaryColor, '#ffffff', 0.32));
            profile.style.setProperty('--author-accent-ink', textColor);
            profile.style.setProperty('--author-accent-on', textColor);
        };

        const applyAccentFromAvatar = (sampleImage) => {
            const colors = extractAvatarAccentColors(sampleImage, authorName);
            if (!colors) {
                return;
            }

            profile.style.setProperty('--author-accent', colors.accent);
            profile.style.setProperty('--author-accent-dark', colors.dark);
            profile.style.setProperty('--author-accent-soft', colors.soft);
            profile.style.setProperty('--author-accent-ink', colors.ink);
            profile.style.setProperty('--author-accent-on', colors.on);
        };

        const loadSampleImage = async () => {
            const localAvatarUrl = await downloadImageAsObjectUrl(avatarUrl);
            if (!localAvatarUrl) {
                applyFallbackAccent();
                return;
            }

            const sampleImage = createAvatarSampleImage(localAvatarUrl);
            const cleanup = () => URL.revokeObjectURL(localAvatarUrl);

            sampleImage.addEventListener('load', () => {
                applyAccentFromAvatar(sampleImage);
                cleanup();
            }, { once: true });

            sampleImage.addEventListener('error', () => {
                cleanup();
                applyFallbackAccent();
            }, { once: true });
        };

        if (avatar.complete && avatar.naturalWidth > 0) {
            loadSampleImage();
            return;
        }

        avatar.addEventListener('load', loadSampleImage, { once: true });
    });
}

function createAvatarSampleImage(src) {
    const sampleImage = new Image();
    sampleImage.decoding = 'async';
    sampleImage.src = src;
    return sampleImage;
}

async function downloadImageAsObjectUrl(src) {
    try {
        const response = await fetch(src, {
            mode: 'cors',
            credentials: 'omit',
            cache: 'force-cache',
            referrerPolicy: 'no-referrer'
        });

        if (!response.ok) {
            return null;
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        return null;
    }
}

/**
 * Sample avatar image and generate a vibrant accent palette.
 */
function extractAvatarAccentColors(img, seed = '') {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
        return buildSeededAccentColors(seed);
    }

    const size = 28;
    canvas.width = size;
    canvas.height = size;

    try {
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;

        for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3];
            if (alpha < 180) {
                continue;
            }

            const pr = data[i];
            const pg = data[i + 1];
            const pb = data[i + 2];
            const luminance = 0.2126 * pr + 0.7152 * pg + 0.0722 * pb;

            // Ignore very dark pixels to avoid muddy accents.
            if (luminance < 30) {
                continue;
            }

            r += pr;
            g += pg;
            b += pb;
            count += 1;
        }

        if (count === 0) {
            return buildSeededAccentColors(seed);
        }

        const avgR = Math.round(r / count);
        const avgG = Math.round(g / count);
        const avgB = Math.round(b / count);
        const [h, s, l] = rgbToHsl(avgR, avgG, avgB);

        const accent = hslToHex(h, Math.max(68, s), Math.max(46, Math.min(56, l + 8)));
        const accentRgb = hexToRgb(accent);
        const on = getReadableOnColor(accentRgb);
        const dark = mixHexColors(accent, on, 0.2);
        const soft = mixHexColors(accent, '#ffffff', 0.36);
        const ink = mixHexColors(accent, on, 0.82);

        return { accent, dark, soft, ink, on };
    } catch (error) {
        return buildSeededAccentColors(seed);
    }
}

function buildSeededAccentColors(seed) {
    const hash = hashString(seed || 'avatar');
    const hue = hash % 360;
    const saturation = 56 + (hash % 14);
    const lightness = 48 + (hash % 8);

    return {
        accent: hslToHex(hue, saturation, lightness),
        dark: mixHexColors(hslToHex(hue, saturation, lightness), '#1f1f1f', 0.28),
        soft: mixHexColors(hslToHex(hue, saturation, lightness), '#ffffff', 0.36),
        ink: getReadableOnColor(hexToRgb(hslToHex(hue, saturation, lightness))),
        on: getReadableOnColor(hexToRgb(hslToHex(hue, saturation, lightness)))
    };
}

function hexToRgb(hex) {
    const normalized = hex.replace('#', '').trim();
    if (normalized.length !== 6) {
        return [31, 31, 31];
    }

    return [
        Number.parseInt(normalized.slice(0, 2), 16),
        Number.parseInt(normalized.slice(2, 4), 16),
        Number.parseInt(normalized.slice(4, 6), 16)
    ];
}

function getReadableOnColor(rgb) {
    if (!rgb || rgb.length !== 3) {
        return '#111111';
    }

    const [r, g, b] = rgb;
    const luminance = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
    return luminance > 150 ? '#111111' : '#ffffff';
}

function mixHexColors(firstHex, secondHex, secondWeight) {
    const firstRgb = hexToRgb(firstHex);
    const secondRgb = hexToRgb(secondHex);
    const weight = Math.max(0, Math.min(1, secondWeight));
    const firstWeight = 1 - weight;

    const mixed = firstRgb.map((value, index) => Math.round((value * firstWeight) + (secondRgb[index] * weight)));
    return rgbToHex(mixed[0], mixed[1], mixed[2]);
}

function rgbToHex(r, g, b) {
    return `#${[r, g, b].map((value) => Math.max(0, Math.min(255, value)).toString(16).padStart(2, '0')).join('')}`;
}

function hashString(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }

    return Math.abs(hash >>> 0);
}

function rgbToHsl(r, g, b) {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
        if (max === rn) {
            h = ((gn - bn) / delta) % 6;
        } else if (max === gn) {
            h = (bn - rn) / delta + 2;
        } else {
            h = (rn - gn) / delta + 4;
        }
    }

    h = Math.round((h * 60 + 360) % 360);
    const l = (max + min) / 2;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    return [h, Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h, s, l) {
    const sat = s / 100;
    const light = l / 100;
    const c = (1 - Math.abs(2 * light - 1)) * sat;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = light - c / 2;

    let r = 0;
    let g = 0;
    let b = 0;

    if (h < 60) {
        r = c; g = x; b = 0;
    } else if (h < 120) {
        r = x; g = c; b = 0;
    } else if (h < 180) {
        r = 0; g = c; b = x;
    } else if (h < 240) {
        r = 0; g = x; b = c;
    } else if (h < 300) {
        r = x; g = 0; b = c;
    } else {
        r = c; g = 0; b = x;
    }

    const toHex = (value) => {
        const hex = Math.round((value + m) * 255).toString(16).padStart(2, '0');
        return hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Initialize search overlay functionality
 */
function initializeSearch() {
    const searchToggle = document.getElementById('search-toggle');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.getElementById('search-close');

    if (!searchToggle || !searchOverlay) {
        return; // Search not enabled
    }

    // Show search overlay
    searchToggle.addEventListener('click', function(e) {
        e.preventDefault();
        searchOverlay.style.display = 'flex';
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
    });

    // Hide search overlay
    function hideSearch() {
        searchOverlay.style.display = 'none';
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';
        const searchResults = document.getElementById('search-results');
        if (searchResults) searchResults.innerHTML = '';
    }
    
    if (searchClose) {
        searchClose.addEventListener('click', hideSearch);
    }
    
    // Hide on overlay click
    searchOverlay.addEventListener('click', function(e) {
        if (e.target === searchOverlay) {
            hideSearch();
        }
    });
    
    // Hide on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchOverlay.style.display === 'flex') {
            hideSearch();
        }
    });
    
    // Show search with Ctrl+Shift+F (or Cmd+Shift+F on Mac)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
            e.preventDefault();
            searchOverlay.style.display = 'flex';
            const searchInput = document.getElementById('search-input');
            if (searchInput) searchInput.focus();
        }
    });
}

/**
 * Initialize mobile menu functionality
 */
function initializeMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.querySelector('.site-nav ul');
    
    if (!menuToggle || !menu) {
        return;
    }
    
    menuToggle.addEventListener('click', function() {
        menu.classList.toggle('mobile-menu-open');
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScroll() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize external link handling
 */
function initializeExternalLinks() {
    // Open external links in new tab
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.hostname || link.hostname !== window.location.hostname) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            

        }
    });
}

/**
 * Initialize draggable gallery thumbnail scrolling
 */
function initializeGalleryThumbnailScroll() {
    const galleryTracks = document.querySelectorAll('.gallery-thumbnail-scroll');

    galleryTracks.forEach((track) => {
        if (track.dataset.dragScrollInitialized === 'true') {
            return;
        }

        track.dataset.dragScrollInitialized = 'true';

        // Force scrollable behavior even when gallery markup injects inline styles.
        track.style.overflowX = 'auto';
        track.style.overflowY = 'hidden';
        track.style.whiteSpace = 'nowrap';
        track.style.scrollBehavior = 'smooth';

        let isDragging = false;
        let hasMoved = false;
        let startX = 0;
        let startScrollLeft = 0;

        const pointerPosition = (event) => (event.touches && event.touches.length ? event.touches[0].pageX : event.pageX);
        const ensureSelectedVisible = () => {
            const selectedThumb = track.querySelector('.gallery-thumbnail.selected');
            if (!selectedThumb) {
                return;
            }

            selectedThumb.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        };

        const beginDrag = (event) => {
            if (event.button !== undefined && event.button !== 0) {
                return;
            }

            isDragging = true;
            hasMoved = false;
            startX = pointerPosition(event);
            startScrollLeft = track.scrollLeft;
            track.classList.add('is-dragging');

            if (track.setPointerCapture && event.pointerId !== undefined) {
                try {
                    track.setPointerCapture(event.pointerId);
                } catch (error) {
                    // Ignore capture errors when the pointer is already captured elsewhere.
                }
            }
        };

        const moveDrag = (event) => {
            if (!isDragging) {
                return;
            }

            event.preventDefault();
            const currentX = pointerPosition(event);
            const distance = currentX - startX;

            if (Math.abs(distance) > 4) {
                hasMoved = true;
            }

            track.scrollLeft = startScrollLeft - distance;
        };

        const endDrag = () => {
            isDragging = false;
            track.classList.remove('is-dragging');
        };

        track.addEventListener('pointerdown', beginDrag);
        track.addEventListener('pointermove', moveDrag);
        track.addEventListener('pointerup', endDrag);
        track.addEventListener('pointercancel', endDrag);
        track.addEventListener('pointerleave', endDrag);
        track.addEventListener('dragstart', (event) => event.preventDefault());

        track.addEventListener('wheel', (event) => {
            if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
                return;
            }

            event.preventDefault();
            track.scrollLeft += event.deltaY;
        }, { passive: false });

        track.querySelectorAll('.gallery-thumbnail').forEach((thumb) => {
            thumb.addEventListener('click', () => {
                window.setTimeout(ensureSelectedVisible, 0);
            });
        });

        const thumbnailContainer = track.closest('.gallery-thumbnail-container');
        if (thumbnailContainer) {
            thumbnailContainer.querySelectorAll('.gallery-nav-next, .gallery-nav-prev').forEach((button) => {
                button.textContent = '';
                const isNext = button.classList.contains('gallery-nav-next');
                button.setAttribute('aria-label', isNext ? 'Next image' : 'Previous image');
                button.addEventListener('click', () => {
                    window.setTimeout(ensureSelectedVisible, 30);
                });
            });
        }

        track.addEventListener('click', (event) => {
            if (!hasMoved) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            hasMoved = false;
        }, true);

        window.setTimeout(ensureSelectedVisible, 0);
    });
}

/**
 * Animate gallery blocks when they enter viewport.
 */
function initializeGalleryScrollAnimations() {
    const galleries = document.querySelectorAll('.shortcode-gallery');
    if (!galleries.length) {
        return;
    }

    if (!('IntersectionObserver' in window)) {
        galleries.forEach((gallery) => gallery.classList.add('is-inview'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('is-inview');
            observer.unobserve(entry.target);
        });
    }, {
        root: null,
        threshold: 0.14,
        rootMargin: '0px 0px -8% 0px'
    });

    galleries.forEach((gallery) => observer.observe(gallery));
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility function to throttle function calls
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

