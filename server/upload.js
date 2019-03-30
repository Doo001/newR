var inspect = require('util').inspect;
var path = require('path');
var fs = require('fs');
var os = require('os');
var crypto = require('crypto');
var Busboy = require('busboy');
var fileBase = "/mnt/gfsdir/VPSDTQ-P4/seal/images/omega/";
var config = require('./config')
function getMd5(fileName) {
     let md5 = crypto.createHash('md5');
     return md5.update(`${fileName}${Date.now()}`).digest('hex')
}


/**
 * 同步创建文件目录
 * @param  {string} dirname 目录绝对地址
 * @return {boolean}        创建目录结果
 */
function mkdirsSync( dirname ) {
    if (fs.existsSync( dirname )) {
        return true
    } else {
        if (mkdirsSync( path.dirname(dirname)) ) {
            fs.mkdirSync( dirname )
            return true
        }
    }
}

function getSuffixName( fileName ) {
    let nameList = fileName.split('.')
    return nameList[nameList.length - 1]
}

function saveFile (ctx) {
    let req = ctx.req;
    let res = ctx.res
    let busboy = new Busboy({headers:  req.headers})
    return new Promise((resolve, reject) => {
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            let uri = getMd5(filename), ext = path.extname(filename);
            // product
            let target = path.join(fileBase, uri.substr(0,2), uri.substr(2,2), uri)
            file.pipe(fs.createWriteStream(`${target}${ext}`));

            // local
           /* let target = path.join(__dirname, 'upload/')
            config.DATA_IMG_PREFIX = `http://math.core.xdf.cn:3000/`;
            file.pipe(fs.createWriteStream(`${target}${uri}${ext}`))*/

            file.on('end', function() {
                console.log('文件上传成功！')
                resolve({
                    error: 0,
                    uploaded: 1, url: `${config.DATA_IMG_PREFIX}${uri}${ext}`, fileName: `${uri}${ext}`
                })
            })
            file.on('error', function (e) {
                reject(e)
            })
        });
        busboy.on('finish', function() {
            console.log('解析完成')
        });
        busboy.on('error', function (e) {
            reject(e)
        })
        req.pipe(busboy)
    })
}
exports.upload =  async function (ctx, next) {
    try {
        ctx.body = await saveFile(ctx)
    } catch (e) {
        ctx.body = {
            uploaded: 0,
            error: {
                message: e.message
            }
        }
    }

}