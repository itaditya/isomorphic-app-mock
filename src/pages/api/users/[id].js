export default (req, res) => {
  const {
    query: { id },
  } = req;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  setTimeout(() => {
    res.end(
      JSON.stringify({
        name: `User ${id}`,
      }),
    );
  }, 1000);
};
