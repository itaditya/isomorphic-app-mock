export default (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  setTimeout(() => {
    res.end(JSON.stringify(['p', 'q', 'r']));
  }, 1000);
};
