export default (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  setTimeout(() => {
    res.end(JSON.stringify([
      {
        id: '1',
        text: 'Task 1',
      },
      {
        id: '2',
        text: 'Task 2',
      },
      {
        id: '3',
        text: 'Task 3',
      },
    ]));
  }, 1000);
};
