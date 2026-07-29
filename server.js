// 云端平台会自动分配端口，本地默认3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`服务启动成功，端口：${port}`);
});
