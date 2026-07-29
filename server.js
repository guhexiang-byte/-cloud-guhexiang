const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`服务启动成功，端口：${port}`);
});
