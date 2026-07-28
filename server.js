const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// 帖子存储文件路径
const DB_PATH = path.join(__dirname, 'posts.json');

// 初始化帖子文件（不存在就创建空数组）
function initDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, '[]', 'utf8');
  }
}
initDB();

// 读取所有帖子
function getPosts() {
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(raw);
}

// 写入帖子数据到文件
function savePosts(list) {
  fs.writeFileSync(DB_PATH, JSON.stringify(list, null, 2), 'utf8');
}

// 中间件：解析表单数据、托管前端静态页面
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API：获取全部帖子
app.get('/api/posts', (req, res) => {
  res.json(getPosts());
});

// API：提交新帖子
app.post('/api/newpost', (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    return res.send('标题、内容、昵称不能为空 <a href="/">返回</a>');
  }

  const posts = getPosts();
  // 组装帖子数据
  const newPost = {
    id: Date.now(), // 用时间戳当做唯一ID
    title,
    content,
    author,
    time: new Date().toLocaleString()
  };
  posts.unshift(newPost); // 新帖子放最顶部
  savePosts(posts);

  res.redirect('/'); // 发帖成功跳转首页
});

// 启动服务
app.listen(port, () => {
  console.log(`论坛运行地址：http://localhost:${port}`);
});
