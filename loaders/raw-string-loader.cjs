// Turns any file into `export default "<file contents>"`.
module.exports = function rawStringLoader(source) {
  return `export default ${JSON.stringify(source)};`;
};
