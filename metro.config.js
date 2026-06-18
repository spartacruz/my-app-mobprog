const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Tambahkan wasm ke asset extensions untuk expo-sqlite web support
config.resolver.assetExts.push('wasm');

// Tambahkan COOP/COEP headers agar SharedArrayBuffer bisa digunakan di browser
// (diperlukan oleh WASM SQLite engine pada expo-sqlite)
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    return middleware(req, res, next);
  };
};

module.exports = config;
