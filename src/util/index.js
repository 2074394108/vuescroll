import Vue from 'vue';

/* istanbul ignore next */
export const isServer = () => Vue.prototype.$isServer;

export function deepCopy(source, target) {
  target = (typeof target === 'object' && target) || {};
  for (var key in source) {
    target[key] =
      typeof source[key] === 'object'
        ? deepCopy(source[key], (target[key] = {}))
        : source[key];
  }
  return target;
}

export function deepMerge(from, to, force) {
  to = to || {};
  for (var key in from) {
    if (typeof from[key] === 'object') {
      if (typeof to[key] === 'undefined') {
        to[key] = {};
        deepCopy(from[key], to[key]);
      } else {
        deepMerge(from[key], to[key]);
      }
    } else {
      if (typeof to[key] === 'undefined' || force) to[key] = from[key];
    }
  }
  return to;
}

export function defineReactive(target, key, source, souceKey) {
  let getter = null;
  /* istanbul ignore if */
  if (!source[key] && typeof source !== 'function') {
    return;
  }
  souceKey = souceKey || key;
  if (typeof source === 'function') {
    getter = source;
  }
  Object.defineProperty(target, key, {
    get:
      getter ||
      function() {
        return source[souceKey];
      },
    configurable: true
  });
}

let scrollBarWidth;

export function getGutter() {
  /* istanbul ignore next */
  if (isServer()) return 0;
  if (scrollBarWidth !== undefined) return scrollBarWidth;
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';
  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  const widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  scrollBarWidth = widthNoScroll - widthWithScroll;
  return scrollBarWidth;
}

export function eventCenter(
  dom,
  eventName,
  hander,
  capture = false,
  type = 'on'
) {
  type == 'on'
    ? dom.addEventListener(eventName, hander, capture)
    : dom.removeEventListener(eventName, hander, capture);
}

export const error = msg => {
  console.error(`[vuescroll] ${msg}`);
};
export const warn = msg => {
  console.warn(`[vuescroll] ${msg}`);
};

export function isChildInParent(child, parent) {
  let flag = false;
  if (!child || !parent) {
    return flag;
  }
  while (
    child.parentNode !== parent &&
    child.parentNode.nodeType !== 9 &&
    !child.parentNode._isVuescroll
  ) {
    child = child.parentNode;
  }
  if (child.parentNode == parent) {
    flag = true;
  }
  return flag;
}

const pxValueReg = /(.*?)px/;
export function extractNumberFromPx(value) {
  const _return = pxValueReg.exec(value);
  return _return && _return[1];
}

function _isSupportTouch() {
  return 'ontouchstart' in window;
}
export function isSupportTouch() {
  /* istanbul ignore if */
  if (isServer()) return false;
  return _isSupportTouch();
}

export function getPrefix(global) {
  var docStyle = document.documentElement.style;
  var engine;
  /* istanbul ignore if */
  if (
    global.opera &&
    Object.prototype.toString.call(opera) === '[object Opera]'
  ) {
    engine = 'presto';
  } /* istanbul ignore next */ else if ('MozAppearance' in docStyle) {
    engine = 'gecko';
  } else if ('WebkitAppearance' in docStyle) {
    engine = 'webkit';
  } /* istanbul ignore next */ else if (
    typeof navigator.cpuClass === 'string'
  ) {
    engine = 'trident';
  }
  var vendorPrefix = {
    trident: 'ms',
    gecko: 'moz',
    webkit: 'webkit',
    presto: 'O'
  }[engine];
  return vendorPrefix;
}

export function _isSupportGivenStyle(property, value) {
  const compatibleValue = `-${getPrefix(window)}-${value}`;
  const testElm = document.createElement('div');
  testElm.style[property] = compatibleValue;
  if (testElm.style[property] == compatibleValue) {
    return compatibleValue;
  }
  /* istanbul ignore next */
  return false;
}
export function isSupportGivenStyle(property, value) {
  /* istanbul ignore if */
  if (isServer()) return false;
  return _isSupportGivenStyle(property, value);
}

export function _isIE() /* istanbul ignore next */ {
  var agent = navigator.userAgent.toLowerCase();
  return (
    agent.indexOf('msie') !== -1 ||
    agent.indexOf('trident') !== -1 ||
    agent.indexOf(' edge/') !== -1
  );
}
export function isIE() {
  /* istanbul ignore if */
  if (isServer()) return false;
  return _isIE();
}

export function insertChildrenIntoSlot(h, parentVnode, childVNode, data) {
  parentVnode = parentVnode[0] ? parentVnode[0] : parentVnode;

  const isComponent = !!parentVnode.componentOptions;

  const tag = isComponent ? parentVnode.componentOptions.tag : parentVnode.tag;

  const _data = parentVnode.componentOptions || parentVnode.data || {};

  if (isComponent) {
    data.nativeOn = data.on;
    _data.props = _data.propsData;

    delete data.on;
    delete data.propsData;
  }

  return h(
    tag,
    {
      ...data,
      ..._data
    },
    childVNode
  );
}

export function getRealParent(ctx) {
  let parent = ctx.$parent;

  if (!parent._isVuescrollRoot && parent) {
    parent = parent.$parent;
  }

  return parent;
}
