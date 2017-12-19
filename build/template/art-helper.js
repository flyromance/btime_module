/**
  *	@fileOverview	扩展artTemplate模板功能，增加过滤器等方法
  *	由于这里新增逻辑会打包到运行环境中，因此尽量保证性能
*/
const runtime = require('art-template/lib/runtime');


/**
  *	@desp	设置图片尺寸，沿用之前方法
*/
runtime.cutter = (source, format) => {
    var ret, _index, path, size, matches;
    if (!source) {
        return '//p0.ssl.qhimg.com/t01742f4d8eae91b502.png';
    }
    if (source.indexOf('qhimg.com') < 0 && source.indexOf('qhmsg.com') && source.indexOf('cdn.btime.com') < 0) {
        return source;
    }

    if (format) {
        size = format.split('-')[0] + '_' + format.split('-')[1] + '_';
        matches = source.match(/^(https?:\/\/.+?)(\/.+)*(\/.+)$/);
        if (matches && matches.length > 0) {
            ret = [matches[1], '/', 'dmfd', '/', size, matches[3]].join('');
        }
    }

    return ret ? ret : source;
};

/**
  * @desp 从 slog 的值中分离出 channel_position 的值
*/
runtime.getChannelPosition = (slog) => {
    if (slog) {
        // 拼装一个属性，用来存放数据放回的 channel_position
        return JSON.stringify(slog.channel_position ? slog.channel_position[1] : '');
    }
};

/**
  *	@desp	计算字符长度，之前strCount
*/
runtime.len = (str, setlen) => {
    var str = $.trim(str);
    var count = 0,
        re = /[\u4e00-\u9fa5]/,
        uFF61 = parseInt("FF61", 16),
        uFF9F = parseInt("FF9F", 16),
        uFFE8 = parseInt("FFE8", 16),
        uFFEE = parseInt("FFEE", 16);

    for (var i = 0, len = str.length; i < len; i++) {
        if (re.test(str[i])) {
            count += 1;
        } else {
            var c = parseInt(str.charCodeAt(i));
            if (c < 256) {
                count += 0.5;
            } else {
                if ((uFF61 <= c) && (c <= uFF9F)) {
                    count += 0.5;
                } else if ((uFFE8 <= c) && (c <= uFFEE)) {
                    count += 0.5;
                } else {
                    count += 1;
                }
            }
        }
    }
    return count;
}


module.exports = runtime;

