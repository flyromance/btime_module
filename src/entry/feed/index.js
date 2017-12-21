import monitor from "@/component/monitor/plus"
import InfoFlow from './js/feed'
import feed_1 from './tpl/feed_1.html' // 左图右文
import feed_5 from './tpl/feed_5.html' // 四图
import './css/alert.css'
import './css/feed.css'
import './css/figure.css'
import './css/media.css'
import './css/index.css'
import $ from 'jquery'

const CONFIG = {
    from: 'gamelou',
    guid: monitor.util.getGuid(),
    url: 'http://third.api.btime.com/News/list',
}
var $container = $('<div></div>', {
    id: 'feed-container',
    bk: 'btime-bk',
}).appendTo('#btime-feed-wrapper')

var _monitorDataGetBase = monitor.data.getBase
monitor.data.getBase = function () {
    return {
        ts: +new Date()
    }
}

var _monitorDataGetTrack = monitor.data.getTrack
monitor.data.getTrack = function () {
    return {
        action: 'page_view',
        guid: monitor.util.getGuid(),
        client_id: 38,
        from: 'gamelow',
    }
}

// 默认URL配置，并启用鼠标点击和按键统计
monitor.setConf({
    defaultUrl: '//click.btime.com/api/weblog',
    // trackUrl: 'https://click.btime.com/api/weblog',
    // clickUrl: 'https://click.btime.com/api/weblog',
    // viewUrl: 'https://click.btime.com/api/weblog',
});

monitor.getTrack()
monitor.getClickAndKeydown()

// 不需要可视窗打点
// monitor.getScroll({
//     container: $container,
//     scrollBindTarget: window,
//     selector: '.js-feed'
// })

// 用模板把数据转成字符串
function toHtml(data, prefix, hasDislike) {
    var news_array = null,
        _prefix = prefix || 'feed',
        has_dislike = hasDislike;

    function getHtml(data) {
        var lens = data.length,
            _html = '',
            item;

        for (var i = 0; i < lens; i++) {
            item = data[i];
            item.has_dislike = has_dislike;
            switch (+item.module) {
                case 1:
                    _html += feed_1(item);
                    break;
                case 5:
                    _html += feed_5(item);
                    break;
                default:
                    break;
            }
        }

        return _html || '';
    }

    return getHtml(data) || '';
}

var feed_config = {

    // 数据处理函数：data to string：传入数据，返回字符串
    transformData: function (obj) {
        obj.handledData = toHtml(obj.data || [], 'feed', obj.hasDislike);
    },

    uniqueTag: 'feed', // 信息流唯一标识
    container: $container, // 插入信息流的外层容器
    hasFirstPageData: false,
    baseLoad: {
        baseUrl: CONFIG.url,
        pagingName: 'page', // 分页参数，默认是page
        timestamp: 'timestamp',
        // countName: 'count',
        // countNum: 13,
        urlParam: { // 接口参数
            os: 'win',
            net_level: 1,
            from: CONFIG.from,
            uid: CONFIG.guid,
            cid: 0,
        }
    },
    hasScrollLoad: true, // 滚动加载，默认打开
    scrollLoad: {
        urlParam: {
            refresh_type: 2
        }
    },
    thresholdTime: 200, // 100ms内连续滚动，加载事件被取消掉
    thresholdVal: 200, // 提前100px，开始加载数据

    hasRemindLoad: false, // 未读提醒加载，默认关闭
    remindLoad: {
        urlParam: {
            refresh_type: 1
        }
    },
    remindTime: 1 / 6, // 隔5分钟，推荐一次
    updateTime: 1, // 一分钟更新一次，推荐提醒，前几分钟看到这里
    alertUI: {
        result: '<div class="alerts j-alert-result"><span class="alerts-text j-alert-text"></span></div>',
        loading: '<div class="alerts j-alert-loading hide-text"><span class="loading j-alert-text">正在加载...</span></div>',
        unread: '<div class="alerts j-alert-unread">' +
            '<span class="alerts-text">您有未读新闻, 点击查看</span>' +
            '<span class="alerts-btn-close j-unread-close"><i>&times;</i></span></div>',
        refresh: '<div class="alerts alerts-inline j-alert-refresh" data-record-time="1">' +
            '<span class="alerts-text"><span class="j-refresh-time">1分钟</span>前看到这里, 点击刷新</span></div>'
    }
};

new InfoFlow(feed_config)

