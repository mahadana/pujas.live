module.exports = {
  async rewrites() {
    return [
      {
        source: '/test',
        destination: '/api/test',
      },
    ]
  },
}
