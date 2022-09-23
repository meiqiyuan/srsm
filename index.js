(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) : (global.stable = factory());
}(this, (function () {
    'use strict';
    const gv = {
        id: 0, key: '_key', react: null, event: null
    }
    const uniqueId = function () {
        return (++gv.id).toString();
    }
    const srsm = function (arg1, arg2) {
        if (!gv.react || !gv.event) {
            throw new Error('srsm: You must call initialize() before using srsm.');
        }
        const event = typeof arg1 === 'object' && arg1 || {};
        const factory = typeof (arg2 || arg1) === "function" && (arg2 || arg1);
        const emitMap = {};
        const eventName = uniqueId();
        event.listener = event.component = function useListener(props) {
            const state = gv.react.useState("");
            gv.react.useEffect(() => {
                const hasKey_ = props && props.hasOwnProperty(gv.key);
                const listener = () => {
                    (state[1])(uniqueId());
                }
                if (hasKey_) {
                    emitMap[`${eventName}_${props[gv.key]}`] = listener;
                }
                gv.event.on(eventName, listener);
                return () => {
                    if (hasKey_) {
                        delete emitMap[`${eventName}_${props[gv.key]}`];
                    }
                    gv.event.off(eventName, listener);
                }
            }, []);
            return factory ? factory(props) : gv.react.createElement(gv.react.Fragment, null);
        };
        event.emit = function (data) {
            if (typeof data === 'function') {
                Promise.resolve(data(event)).then(() => {
                    gv.event.emit(eventName);
                });
            } else if (typeof data === 'string' || typeof data === 'number') {
                if (emitMap[`${eventName}_${data}`]) {
                    emitMap[`${eventName}_${data}`]();
                }
            } else {
                gv.event.emit(eventName);
            }
        };
        return event;
    };
    srsm.init = function (react, event) {
        gv.react = react;
        gv.event = new event();
    };
    return srsm;
})));
