export function mix(target, source, map) {

    // target上没有key, 或者target上的key不存在
    map = map || function (t, s, key) {
        if (!(target[key] || (key in target))) {
            return s;
        }
        return t;
    };

    if (map === true) { // override
        map = function (t, s) {
            return s;
        }
    }

    for (var key in source) {
        target[key] = map(target[key], source[key], key);
        if (target[key] === 'undefined') {
            delete target[key];
        }
    }

    return target;
}

export function getQuery(key, url) {
    var sUrl = url ? url : window.location.search;
    var r = sUrl.match(new RegExp('[?&]{1}' + encodeURIComponent(key) + '=([^&]*)'));
    return (r === null ? null : decodeURIComponent(r[1]));
}

export function throttle(handler, interval = 200, max = 1000) {
    if (typeof handler !== 'function') {
        throw new Error('handler must be function')
    }

    var timer = null
    var start_time, now_time

    return function () {
        var self = this
        var args = Array.prototype.slice.call(arguments)
        var now_time = +new Date()

        // 处理第一次
        if (!start_time) {
            start_time = now_time
            handler.call(self, args)
        }

        if (now_time - start_time >= 1000) {
            clearTimeout(timer)
            start_time = now_time
            handler.call(self, args)
        }

        timer && clearTimeout(timer)
        timer = setTimeout(function () {
            start_time = now_time
            handler.call(self, args)
        }, interval)
    }
}

export function debounce(handler, interval = 200) {
    if (typeof handler !== 'function') {
        throw new Error('handler must be function')
    }

    var timer = null

    return function () {
        var self = this
        var args = Array.prototype.slice.call(arguments)

        timer && clearTimeout(timer)
        timer = setTimeout(function () {
            handler.call(self, args)
        }, interval)
    }
}

export function belowthefold(element, settings) {
    var fold, $window = $(window);
    fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
    return fold <= $(element).offset().top - settings.threshold;
}

export function rightoffold(element, settings) {
    var fold, $window = $(window);
    fold = $window.width() + $window.scrollLeft();
    return fold <= $(element).offset().left - settings.threshold;
}

export function abovethetop(element, settings) {
    var fold, $window = $(window);
    fold = $window.scrollTop();
    return fold >= $(element).offset().top + settings.threshold + $(element).height();
}

export function leftofbegin(element, settings) {
    var fold, $window = $(window);
    fold = $window.scrollLeft();
    return fold >= $(element).offset().left + settings.threshold + $(element).width();
}

export function inviewport(element, settings) {
    return !rightoffold(element, settings) && !leftofbegin(element, settings) &&
        !belowthefold(element, settings) && !abovethetop(element, settings);
}

export function createEvent(obj) {
    var event = {};

    mix(obj, {
        on: function (eventType, fn) {
            event[eventType] = event[eventType] || [];
            event[eventType].push(fn);
        },
        fire: function (eventType, arg) {
            var i,
                handlers = event[eventType] || [],
                lens = handlers.length;
            arg = arg || {};

            $.extend(arg, {
                target: obj,
                type: eventType,
                preventDefault: function () {
                    arg.returnValue = false;
                }
            });

            for (i = 0; i < lens; i++) {
                handlers[i](arg);
                if (arg.returnValue === false) {
                    break;
                }
            }
        }
    });

    obj.trigger = obj.fire;
    obj.bind = obj.on;

    return obj;
}