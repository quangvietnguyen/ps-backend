module.exports = async (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://vietnguyen.dev');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
};
