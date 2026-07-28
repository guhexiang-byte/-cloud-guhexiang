const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// 跨域配置
app.all('*', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const POSTS_FILE = path.join(__dirname, 'posts.json');

// 初始化空帖子文件
function initDatabase() {
  if (!fs.existsSync(POSTS_FILE)) {
    fs.writeFileSync(POSTS_FILE, '[]', 'utf-8');
  }
}
initDatabase();

// 读取帖子
function readAllPosts() {
  const fileText = fs.readFileSync(POSTS_FILE, 'utf-8');
  return JSON.parse(fileText);
}

// 保存帖子
function writePosts(postList) {
  fs.writeFileSync(POSTS_FILE, JSON.stringify(postList, null, 2), 'utf-8');
}

// 强制UTF-8解析表单数据
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }));
app.use(express.static(path.join(__dirname, '../frontend')));

// 获取帖子接口
app.get('/api/posts', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.json(readAllPosts());
});

// 发帖接口
app.post('/api/newpost', (req, res) => {
  const { author, title, content } = req.body;
  if (!author || !title || !content) {
    return res.send('内容不能为空');
  }

  const newPost = {
    id: Date.now(),
    author,
    title,
    content,
    createTime: new Date().toLocaleString()
  };

  const allPosts = readAllPosts();
  allPosts.unshift(newPost);
  writePosts(allPosts);

  res.send('发帖成功');
});

app.listen(PORT, () => {
  console.log(`服务启动：http://localhost:${PORT}`);
});
