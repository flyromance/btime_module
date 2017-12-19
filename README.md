## 启动
npm run dev

## 开发说明
- src/entry/feed 这个代表一个页面也就是一个组件
- src/entry/feed/index.js 代表入口文件
- src/entry/feed/index.html
    - 入口文件输出的html，用到了html-webpack-plugin, 入口的chunks自动插入到文件里面

## 开发调试页面
浏览器中打开 127.0.0.1:8001/dist/views/feed/index.html


## 构建线上代码
npm run build