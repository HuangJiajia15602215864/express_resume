const express = require('express');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const hostname = 'localhost';
const port = 3000;

//创建一个 Express 服务器对象 
const app = express();

// 指定模板存放目录
app.set('views', 'views');
// 指定模板引擎为 Handlebars
app.set('view engine', 'hbs');

// 引入中间件
function loggingMiddleware(req, res, next) {
  const time = new Date();
  console.log(`[${time.toLocaleString()}] ${req.method} ${req.url}`);
  next();
}

// 全局中间件
app.use(loggingMiddleware);

app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/api', apiRouter);

// 服务器内部错误
app.get('/broken', (req, res) => {
  throw new Error('Broken!');
});

app.use('*', (req, res) => {
  res.status(404).render('404', { url: req.originalUrl });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500');
});


//调用 listen 方法开启服务器
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});