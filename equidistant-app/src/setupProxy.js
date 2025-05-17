const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/maps',
    createProxyMiddleware({
      target: 'https://maps.googleapis.com',
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        '^/maps': '/maps'
      },
      onProxyRes: function(proxyRes, req, res) {
        // Add CORS headers
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
      },
      logLevel: 'debug'
    })
  );
};