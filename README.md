<!--
 * @Description: file content
 * @Author: RongWei
 * @Date: 2019-09-09 09:27:10
 * @LastEditors: RongWei
 * @LastEditTime: 2019-09-11 20:07:59
 -->
# exportI18nExcel

## 使用步骤
```
1. 下载本项目
2. npm i
3. 将 app.js 中的 filePath 改为目标文件夹
4. 运行 node app，在浏览器中打开 localhost:3000, 点击导出按钮，就可以导出 Excel 啦
```

**暂时写的是将目标文件夹中的所有 jsx 文件遍历，找出其中的中文导出至 Excel，如果要导出 js 文件中的中文，需要修改代码。**    
**因为 index.js 文件中会导入其他文件，所以 jsx 和 js 一起遍历时，有些文件会输出两边。**