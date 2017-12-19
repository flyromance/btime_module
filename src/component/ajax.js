import $ from 'jquery'

function setWeblogMonitorMap(arr) {
    if (typeof arr !== 'object' || !(arr instanceof Array)) return;
    var weblogMap = window.weblogMap ? window.weblogMap : {};
    for (var i = 0, len = arr.length; i < len; i++) {
        var item = arr[i];
        if (!weblogMap[item.gid]) {
            weblogMap[item.gid] = item.s_log;
        }
    }
    window.weblogMap = weblogMap;
}

export default function fetchData(options = {}) {
    var dfd = $.Deferred();

    $.ajax(options)
        .then(function (res) {
            var self = this,
                data;
                
            // 验证规则
            if (res.errno === 0 && res.data && res.data.length) {
                data = res.data
            } else {
                dfd.reject()
                return
            }

            setWeblogMonitorMap(data); // 记录gidmap

            dfd.resolve(data);
        }, function (res) {
            dfd.reject(res);
        })

    return dfd;
}