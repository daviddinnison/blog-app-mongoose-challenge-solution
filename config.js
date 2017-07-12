exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://devdev:devdev1@ds023448.mlab.com:23448/test-blog-db';
exports.PORT = process.env.PORT || 8080;