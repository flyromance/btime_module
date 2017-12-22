let config = require('./build/config')
let qcdn = require('@q/qcdn')
let $util = require('./build/util')
let util = require('util')
let fs = require('fs')
let path = require('path')
var static_file = path.join(config.baseDir, 'static.data')

var file_arr = $util.getFiles();
qcdn.default(file_arr, {
    static: {}
}).then(function (ret) {
    record(util.inspect(ret))
}, function (err) {

})

function record(content) {
    fs.exists(static_file, function (ret) {
        var _now = Date.now();

        if (!ret) {
            // 如果已经有文件了，writeFile会覆盖原来的static.data文件，不会报错
            fs.writeFile('static.data', `${_now}\n${content}`, function (e) {
                if (e) {
                    throw e
                }
                console.log('success')
            })
        } else {
            fs.open('static.data', 'a', function (e, fd) {
                fs.write(fd, `\n\r${_now}\n${content}`, function (e) {
                    if (e) throw e;
                    fs.closeSync(fd);
                })
            })
        }
    })
}
