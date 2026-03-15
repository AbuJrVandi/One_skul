const configs = import.meta.glob('../*/config.json', { eager: true });

const configMap = Object.entries(configs).reduce((acc, [path, mod]) => {
    const parts = path.split('/');
    const slug = parts[parts.length - 2];
    acc[slug] = mod?.default ?? mod;
    return acc;
}, {});

export function getSchoolConfig(slug) {
    if (!slug) return {};
    return configMap[slug] || {};
}
