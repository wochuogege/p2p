# P2P Chat Application

这是一个使用WebRTC和Socket.io实现的P2P聊天应用，包括Node.js信令服务器和HTML/JS客户端。

## 项目结构
- `package.json`: 项目依赖和脚本配置。
- `server.js`: 信令服务器代码，使用Socket.io处理WebRTC信令。
- `client/`
  - `index.html`: 客户端HTML结构。
  - `style.css`: 客户端CSS样式，提供现代UI。
  - `app.js`: 客户端JavaScript，实现WebRTC连接和消息传输。
- `render.yaml`: Render部署配置文件。

## 依赖安装
在项目根目录运行：
```
npm install
```
这将安装socket.io等依赖。

## 运行方式
- **本地运行**（可选，如果需要测试）：运行 `npm start` 启动信令服务器。
- 客户端：打开 `client/index.html` 在浏览器中。

**注意**：由于指定本地不执行命令行，本地测试需手动部署或在支持环境中运行。

## Render部署步骤
1. 将项目推送到GitHub仓库。
2. 在Render.com创建新Web Service，选择你的GitHub仓库。
3. 使用 `render.yaml` 中的配置：构建命令 `npm install`，启动命令 `npm start`。
4. 设置环境变量如 `NODE_ENV=production`。
5. 部署后，获取服务器URL，并更新 `client/app.js` 中的socket连接URL。
6. 客户端可通过浏览器访问index.html，使用部署的服务器URL进行P2P连接。

## 测试
- 部署后，打开两个浏览器窗口，连接同一房间，发送消息验证P2P通信。
- 确保STUN服务器配置有效，支持NAT穿越。