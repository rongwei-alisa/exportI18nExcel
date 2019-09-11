/*
 * @Description: file content
 * @Author: RongWei
 * @Date: 2019-09-08 23:47:47
 * @LastEditors: RongWei
 * @LastEditTime: 2019-09-11 20:01:25
 */
const Koa = require("koa");
const router = require("koa-router")();
const fs = require("fs");
const path = require('path');
const readline = require('readline');
const nodeExcel = require('excel-export');

const app = new Koa();
const filePath = path.resolve('../../maycur/maycur-form-web/src/components');
const excelData = [];

app.use(router.routes());

router.get("/", (ctx) => {
    ctx.body = fs.readFileSync("./index.html", "utf-8");
});

//导出Excel，xlsx格式
router.get('/exportexcel', async (ctx) => {
    //导出
    function exportdata(v) {
        let conf = {};
        conf.name = "mysheet";//表格名
        let alldata = new Array();
        for (let i = 0; i < v.length; i++) {
            let arr = new Array();
            arr.push(v[i].NameSpace);
            arr.push(v[i].Key1);
            arr.push(v[i].Key2);
            arr.push(v[i].zh);
            arr.push(v[i].en);
            alldata.push(arr);
        }
        //决定列名和类型
        conf.cols = [{
            caption: 'NameSpace',
            type: 'string'
        }, {
            caption: 'Key1',
            type: 'string'
        }, {
            caption: 'Key2',
            type: 'string'
        }, {
            caption: 'zh',
            type: 'string',
        }, {
            caption: 'en',
            type: 'string',
        }];
        conf.rows = alldata;//填充数据
        let result = nodeExcel.execute(conf);
        //最后3行express框架是这样写
        // res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        // res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
        // res.end(result, 'binary');
        let data = new Buffer(result, 'binary');
        ctx.set('Content-Type', 'application/vnd.openxmlformats');
        ctx.set("Content-Disposition", "attachment; filename=" + "i18n.xlsx");
        ctx.body = data;
    }

    await exportdata(excelData)
});

// 读取文件
function iterateFile(filePath) {
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath, function (err, files) {
        if (err) {
            console.warn(err)
        } else {
            //遍历读取到的文件列表
            files.forEach(function (filename) {
                //获取当前文件的绝对路径
                const filedir = path.join(filePath, filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir, async (eror, stats) => {
                    if (eror) {
                        console.warn('获取文件stats失败');
                    } else {
                        const isFile = stats.isFile();//是文件
                        const isDir = stats.isDirectory();//是文件夹
                        const extname = path.extname(filedir);
                        const reg = new RegExp(/(.jsx)$/)
                        if (isFile && reg.test(extname)) {
                            // 读取文件内容
                            const rl = readline.createInterface({
                                input: fs.createReadStream(filedir)
                            });
                            rl.on('line', (line) => {
                                // 排除注释
                                const annotationReg = new RegExp(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g);
                                if (!annotationReg.test(line)) {
                                    const ch = (/[\u4e00-\u9fa5\uFF00-\uFFFF]+/g).exec(line);
                                    if (ch) {
                                        const pathArr = filedir.split('/');
                                        const pathArrLength = pathArr.length
                                        const fileName = pathArr[pathArrLength - 1].split('.')[0];
                                        excelData.unshift({
                                            NameSpace: fileName,
                                            Key1: '',
                                            Key2: '',
                                            zh: ch[0],
                                            en: ''
                                        })
                                    }
                                }
                            });

                            rl.on('close', () => {
                                console.log('finish', filedir)
                            });
                        }
                        if (isDir) {
                            iterateFile(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                })
            });
        }
    });
}

iterateFile(filePath);

app.listen(3000);
