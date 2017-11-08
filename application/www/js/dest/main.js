'use strict';

var babelHelpers = {};
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var jsx = function () {
  var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7;
  return function createRawReactElement(type, props, key, children) {
    var defaultProps = type && type.defaultProps;
    var childrenLength = arguments.length - 3;

    if (!props && childrenLength !== 0) {
      props = {};
    }

    if (props && defaultProps) {
      for (var propName in defaultProps) {
        if (props[propName] === void 0) {
          props[propName] = defaultProps[propName];
        }
      }
    } else if (!props) {
      props = defaultProps || {};
    }

    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);

      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 3];
      }

      props.children = childArray;
    }

    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type: type,
      key: key === undefined ? null : '' + key,
      ref: null,
      props: props,
      _owner: null
    };
  };
}();

var asyncIterator = function (iterable) {
  if (typeof Symbol === "function") {
    if (Symbol.asyncIterator) {
      var method = iterable[Symbol.asyncIterator];
      if (method != null) return method.call(iterable);
    }

    if (Symbol.iterator) {
      return iterable[Symbol.iterator]();
    }
  }

  throw new TypeError("Object is not async iterable");
};

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

var asyncGeneratorDelegate = function (inner, awaitWrap) {
  var iter = {},
      waiting = false;

  function pump(key, value) {
    waiting = true;
    value = new Promise(function (resolve) {
      resolve(inner[key](value));
    });
    return {
      done: false,
      value: awaitWrap(value)
    };
  }

  

  if (typeof Symbol === "function" && Symbol.iterator) {
    iter[Symbol.iterator] = function () {
      return this;
    };
  }

  iter.next = function (value) {
    if (waiting) {
      waiting = false;
      return value;
    }

    return pump("next", value);
  };

  if (typeof inner.throw === "function") {
    iter.throw = function (value) {
      if (waiting) {
        waiting = false;
        throw value;
      }

      return pump("throw", value);
    };
  }

  if (typeof inner.return === "function") {
    iter.return = function (value) {
      return pump("return", value);
    };
  }

  return iter;
};

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var defineEnumerableProperties = function (obj, descs) {
  for (var key in descs) {
    var desc = descs[key];
    desc.configurable = desc.enumerable = true;
    if ("value" in desc) desc.writable = true;
    Object.defineProperty(obj, key, desc);
  }

  return obj;
};

var defaults = function (obj, defaults) {
  var keys = Object.getOwnPropertyNames(defaults);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = Object.getOwnPropertyDescriptor(defaults, key);

    if (value && value.configurable && obj[key] === undefined) {
      Object.defineProperty(obj, key, value);
    }
  }

  return obj;
};

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var _instanceof = function (left, right) {
  if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
    return right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
};

var interopRequireDefault = function (obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
};

var interopRequireWildcard = function (obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj.default = obj;
    return newObj;
  }
};

var newArrowCheck = function (innerThis, boundThis) {
  if (innerThis !== boundThis) {
    throw new TypeError("Cannot instantiate an arrow function");
  }
};

var objectDestructuringEmpty = function (obj) {
  if (obj == null) throw new TypeError("Cannot destructure undefined");
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var selfGlobal = typeof global === "undefined" ? self : global;

var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var slicedToArrayLoose = function (arr, i) {
  if (Array.isArray(arr)) {
    return arr;
  } else if (Symbol.iterator in Object(arr)) {
    var _arr = [];

    for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
      _arr.push(_step.value);

      if (i && _arr.length === i) break;
    }

    return _arr;
  } else {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }
};

var taggedTemplateLiteral = function (strings, raw) {
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
};

var taggedTemplateLiteralLoose = function (strings, raw) {
  strings.raw = raw;
  return strings;
};

var temporalRef = function (val, name, undef) {
  if (val === undef) {
    throw new ReferenceError(name + " is not defined - temporal dead zone");
  } else {
    return val;
  }
};

var temporalUndefined = {};

var toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

babelHelpers;

var BunnyElement = {
  getCurrentDocumentPosition: function getCurrentDocumentPosition() {
    var top = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    //return Math.abs(document.body.getBoundingClientRect().y);
    return top ? window.scrollY : window.scrollY + window.innerHeight;
  },
  getPosition: function getPosition(el) {
    var top = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var curTop = 0;
    var originalEl = el;
    if (el.offsetParent) {
      do {
        curTop += el.offsetTop;
      } while (el = el.offsetParent);
    }
    if (!top) {
      curTop += originalEl.offsetHeight;
    }
    return curTop;
  },
  isInViewport: function isInViewport(el) {
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var top = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var docPos = this.getCurrentDocumentPosition(top);
    var elPos = this.getPosition(el, top);
    return elPos + offset <= docPos;
  },
  scrollToIfNeeded: function scrollToIfNeeded(target) {
    var viewportOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var viewportTop = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var duration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 500;
    var scrollOffset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    if (!this.isInViewport(target, viewportOffset, viewportTop)) {
      this.scrollTo(target, duration, scrollOffset);
    }
  },


  /**
   * Smooth scrolling to DOM element or to relative window position
   * If target is string it should be CSS selector
   * If target is object it should be DOM element
   * If target is number - it is used to relatively scroll X pixels form current position
   *
   * Based on https://www.sitepoint.com/smooth-scrolling-vanilla-javascript/
   *
   * @param {HTMLElement, string, number} target
   * @param {Number|function} duration
   * @param {Number} offset
   * @param {HTMLElement} rootElement
   */
  scrollTo: function scrollTo(target) {
    var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
    var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var rootElement = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : window;

    return new Promise(function (onAnimationEnd) {

      var element = void 0;
      if (typeof target === 'string') {
        element = document.querySelector(target);
      } else if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object') {
        element = target;
      } else {
        // number
        element = null;
      }

      if (element !== null && element.offsetParent === null) {
        // element is not visible, scroll to top of parent element
        element = element.parentNode;
      }

      var start = rootElement === window ? window.pageYOffset : rootElement.scrollTop;
      var distance = 0;
      if (element !== null) {
        distance = element.getBoundingClientRect().top;
      } else {
        // number
        distance = target;
      }

      distance = distance + offset;

      if (typeof duration === 'function') {
        duration = duration(distance);
      }

      var timeStart = 0;
      var timeElapsed = 0;

      requestAnimationFrame(function (time) {
        timeStart = time;
        loop(time);
      });

      function setScrollYPosition(el, y) {
        if (el === window) {
          window.scrollTo(0, y);
        } else {
          el.scrollTop = y;
        }
      }

      function loop(time) {
        timeElapsed = time - timeStart;
        setScrollYPosition(rootElement, easeInOutQuad(timeElapsed, start, distance, duration));
        if (timeElapsed < duration) {
          requestAnimationFrame(loop);
        } else {
          end();
        }
      }

      function end() {
        setScrollYPosition(rootElement, start + distance);
        onAnimationEnd();
      }

      // Robert Penner's easeInOutQuad - http://robertpenner.com/easing/
      function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      }
    });
  },
  hide: function hide(element) {
    return new Promise(function (resolve) {
      element.style.opacity = 0;
      element.style.overflow = 'hidden';
      var steps = 40;
      var step_delay_ms = 10;
      var height = element.offsetHeight;
      var height_per_step = Math.round(height / steps);
      element._originalHeight = height;

      var _loop = function _loop(k) {
        if (k === steps) {
          setTimeout(function () {
            element.style.display = 'none';
            element.style.height = '0px';
            resolve();
          }, step_delay_ms * k);
        } else {
          setTimeout(function () {
            element.style.height = height_per_step * (steps - k) + 'px';
          }, step_delay_ms * k);
        }
      };

      for (var k = 1; k <= steps; k++) {
        _loop(k);
      }
    });
  },
  show: function show(element) {
    if (element._originalHeight === undefined) {
      throw new Error('element._originalHeight is undefined. Save original height when hiding element or use BunnyElement.hide()');
    }
    return new Promise(function (resolve) {
      element.style.display = '';
      var steps = 40;
      var step_delay_ms = 10;
      var height = element._originalHeight;
      var height_per_step = Math.round(height / steps);
      delete element._originalHeight;

      var _loop2 = function _loop2(k) {
        if (k === steps) {
          setTimeout(function () {
            element.style.opacity = 1;
            element.style.height = '';
            element.style.overflow = '';
            resolve();
          }, step_delay_ms * k);
        } else {
          setTimeout(function () {
            element.style.height = height_per_step * k + 'px';
          }, step_delay_ms * k);
        }
      };

      for (var k = 1; k <= steps; k++) {
        _loop2(k);
      }
    });
  },
  remove: function remove(element) {
    element.parentNode.removeChild(element);
  }
};

/* jshint esversion: 6 */
// upravený

//import {BunnyFile} from "./bunnyjs/file/file";
//import {BunnyImage} from "./bunnyjs/file/image";
//import {Ajax} from "./bunnyjs/bunny.ajax";
// MF upraveny hodnoty
var ValidationConfig = {

    // div/node class name selector which contains one label, one input, one help text etc.
    classInputGroup: 'form-input',
    // class to be applied on input group node if it has invalid input
    classInputGroupError: 'form-error',
    // class to be applied on input group node if it input passed validation (is valid)
    classInputGroupSuccess: 'form-success',

    // label to pick textContent from to insert field name into error message
    classLabel: 'form-control-label',

    // error message tag name
    tagNameError: 'small',
    // error message class
    classError: 'form-help',

    // query selector to search inputs within input groups to validate
    selectorInput: '[name]'

};

/**
 * Bunny Form Validation default Translations (EN)
 *
 * object key = validator method name
 * may use additional parameters in rejected (invalid) Promise
 * each invalid input will receive {label} parameter anyway
 * ajax error message should be received from server via JSON response in "message" key
 */
var ValidationLang = {

    required: "'{label}' is required",
    email: "'{label}' should be a valid e-mail address",
    url: "{label} should be a valid website URL",
    tel: "'{label}' is not a valid telephone number",
    maxLength: "'{label}' length must be < '{maxLength}'",
    minLength: "'{label}' length must be > '{minLength}'",
    maxFileSize: "Max file size must be < {maxFileSize}MB, uploaded {fileSize}MB",
    image: "'{label}' should be an image (JPG or PNG)",
    minImageDimensions: "'{label}' must be > {minWidth}x{minHeight}, uploaded {width}x{height}",
    maxImageDimensions: "'{label}' must be < {maxWidth}x{maxHeight}, uploaded {width}x{height}",
    requiredFromList: "Select '{label}' from list",
    confirmation: "'{label}' is not equal to '{originalLabel}'",
    minOptions: "Please select at least {minOptionsCount} options"

};

/**
 * Bunny Validation helper - get file to validate
 * @param {HTMLInputElement} input
 * @returns {File|Blob|boolean} - If no file uploaded - returns false
 * @private
 */
var _bn_getFile = function _bn_getFile(input) {
    // if there is custom file upload logic, for example, images are resized client-side
    // generated Blobs should be assigned to fileInput._file
    // and can be sent via ajax with FormData

    // if file was deleted, custom field can be set to an empty string

    // Bunny Validation detects if there is custom Blob assigned to file input
    // and uses this file for validation instead of original read-only input.files[]
    if (input._file !== undefined && input._file !== '') {
        if (input._file instanceof Blob === false) {
            console.error('Custom file for input ' + input.name + ' is not an instance of Blob');
            return false;
        }
        return input._file;
    }
    return input.files[0] || false;
};

/**
 * Bunny Form Validation Validators
 *
 * Each validator is a separate method
 * Each validator return Promise
 * Each Promise has valid and invalid callbacks
 * Invalid callback may contain argument - string of error message or object of additional params for lang error message
 */
var ValidationValidators = {
    required: function required(input) {
        return new Promise(function (valid, invalid) {
            if (input.hasAttribute('required')) {
                // input is required, check value
                if (input.getAttribute('type') !== 'file' && input.value === '' || (input.type === 'radio' || input.type === 'checkbox') && !input.checked || input.getAttribute('type') === 'file' && _bn_getFile(input) === false) {
                    // input is empty or file is not uploaded
                    // MF

                    if (input.type === 'radio' || input.type === 'checkbox') {
                        var inputGroup = ValidationUI.getInputGroup(input);
                        var hiddenInputs = inputGroup.getElementsByTagName('input');

                        if (Object.keys(hiddenInputs).length > 1) {

                            var selectedOptionsCount = 0;
                            [].forEach.call(hiddenInputs, function (hiddenInput) {
                                if (hiddenInput.checked) {
                                    selectedOptionsCount++;
                                }
                            });

                            if (selectedOptionsCount > 0) {
                                valid();
                            }
                        }
                    }
                    invalid();
                } else {
                    valid();
                }
            } else {
                valid();
            }
        });
    },
    email: function email(input) {
        return new Promise(function (valid, invalid) {
            if (input.value.length > 0 && input.getAttribute('type') === 'email') {
                // input is email, parse string to match email regexp
                var Regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
                if (Regex.test(input.value)) {
                    valid();
                } else {
                    invalid();
                }
            } else {
                valid();
            }
        });
    },
    url: function url(input) {
        return new Promise(function (valid, invalid) {
            if (input.value.length > 0 && input.getAttribute('type') === 'url') {
                // input is URL, parse string to match website URL regexp
                var Regex = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
                if (Regex.test(input.value)) {
                    valid();
                } else {
                    invalid();
                }
            } else {
                valid();
            }
        });
    },
    tel: function tel(input) {
        return new Promise(function (valid, invalid) {
            if (input.value.length > 0 && input.getAttribute('type') === 'tel') {
                // input is tel, parse string to match tel regexp
                // MF
                var Regex = /^[0-9\-\+\(\)\#\ \*]{9,20}$/;
                if (Regex.test(input.value)) {
                    valid();
                } else {
                    invalid();
                }
            } else {
                valid();
            }
        });
    },

    /*
    maxLength(input) {
        return new Promise((valid, invalid) => {
            if (input.getAttribute('maxlength') !== null && input.value.length > input.getAttribute('maxlength')) {
                invalid({maxLength: input.getAttribute('maxlength')});
            } else {
                valid();
            }
        });
    },
      minLength(input) {
        return new Promise((valid, invalid) => {
            if (input.getAttribute('minlength') !== null && input.value.length < input.getAttribute('minlength')) {
                invalid({minLength: input.getAttribute('minlength')});
            } else {
                valid();
            }
        });
    },
      maxFileSize(input) {
        return new Promise((valid, invalid) => {
            if (
                input.getAttribute('type') === 'file'
                && input.hasAttribute('maxfilesize')
                && _bn_getFile(input) !== false
            ) {
                const maxFileSize = parseFloat(input.getAttribute('maxfilesize')); // in MB
                const fileSize = (_bn_getFile(input).size / 1000000).toFixed(2); // in MB
                if (fileSize <= maxFileSize) {
                    valid(input);
                } else {
                    invalid({maxFileSize, fileSize});
                }
            } else {
                valid(input);
            }
        });
    },
      // if file input has "accept" attribute and it contains "image",
    // then check if uploaded file is a JPG or PNG
    image(input) {
        return new Promise((valid, invalid) => {
            if (
                input.getAttribute('type') === 'file'
                && input.getAttribute('accept').indexOf('image') > -1
                && _bn_getFile(input) !== false
            ) {
                BunnyFile.getSignature(_bn_getFile(input)).then(signature => {
                    if (BunnyFile.isJpeg(signature) || BunnyFile.isPng(signature)) {
                        valid();
                    } else {
                        invalid({signature});
                    }
                }).catch(e => {
                    invalid(e);
                });
            } else {
                valid();
            }
        });
    },
      minImageDimensions(input) {
        return new Promise((valid, invalid) => {
            if (input.hasAttribute('mindimensions') && _bn_getFile(input) !== false) {
                const [minWidth, minHeight] = input.getAttribute('mindimensions').split('x');
                BunnyImage.getImageByBlob(_bn_getFile(input)).then(img => {
                    const width = BunnyImage.getImageWidth(img);
                    const height = BunnyImage.getImageHeight(img);
                    if (width < minWidth || height < minHeight) {
                        invalid({width: width, height: height, minWidth, minHeight});
                    } else {
                        valid();
                    }
                }).catch(e => {
                    invalid(e);
                });
            } else {
                valid();
            }
        });
    },
      maxImageDimensions(input) {
        return new Promise((valid, invalid) => {
            if (input.hasAttribute('maxdimensions') && _bn_getFile(input) !== false) {
                const [maxWidth, maxHeight] = input.getAttribute('maxdimensions').split('x');
                BunnyImage.getImageByBlob(_bn_getFile(input)).then(img => {
                    const width = BunnyImage.getImageWidth(img);
                    const height = BunnyImage.getImageHeight(img);
                    if (width > maxWidth || height > maxHeight) {
                        invalid({width: width, height: height, maxWidth, maxHeight});
                    } else {
                        valid();
                    }
                }).catch(e => {
                    invalid(e);
                });
            } else {
                valid();
            }
        });
    },
      // MF tady je nějaký bug
    requiredFromList(input) {
        return new Promise((valid, invalid) => {
            let id;
            if (input.hasAttribute('requiredfromlist')) {
                id = input.getAttribute('requiredfromlist')
            } else {
                id = input.name + '_id';
            }
            const srcInput = document.getElementById(id);
            if (srcInput) {
                if (srcInput.value.length > 0) {
                    valid();
                } else {
                    invalid();
                }
            } else {
                valid();
            }
        });
    },
    */
    minOptions: function minOptions(input) {
        return new Promise(function (valid, invalid) {
            if (input.hasAttribute('minoptions')) {
                var minOptionsCount = parseInt(input.getAttribute('minoptions'));
                var inputGroup = ValidationUI.getInputGroup(input);
                var hiddenInputs = inputGroup.getElementsByTagName('input');
                var selectedOptionsCount = 0;
                [].forEach.call(hiddenInputs, function (hiddenInput) {
                    if (hiddenInput !== input && hiddenInput.value !== '') {
                        selectedOptionsCount++;
                    }
                });
                if (selectedOptionsCount < minOptionsCount) {
                    invalid({ minOptionsCount: minOptionsCount });
                } else {
                    valid();
                }
            } else {
                valid();
            }
        });
    },
    confirmation: function confirmation(input) {
        return new Promise(function (valid, invalid) {
            if (input.name.indexOf('_confirmation') > -1) {
                var originalInputId = input.name.substr(0, input.name.length - 13);
                var originalInput = document.getElementById(originalInputId);
                if (originalInput.value == input.value) {
                    valid();
                } else {
                    invalid({ originalLabel: ValidationUI.getLabel(ValidationUI.getInputGroup(originalInput)).textContent });
                }
            } else {
                valid();
            }
        });
    }
};

/**
 * @package BunnyJS
 * @component Validation
 *
 * Base Object to work with DOM, creates error messages
 * and searches for inputs within "input groups" and related elements
 * Each input should be wrapped around an "input group" element
 * Each "input group" should contain one input, may contain one label
 * Multiple inputs within same "Input group" should not be used for validation
 * <fieldset> is recommended to be used to wrap more then one input
 */
var ValidationUI = {

    config: ValidationConfig,

    /* ************************************************************************
     * ERROR MESSAGE
     */

    /**
     * DOM algorithm - where to insert error node/message
     *
     * @param {HTMLElement} inputGroup
     * @param {HTMLElement} errorNode
     */
    insertErrorNode: function insertErrorNode(inputGroup, errorNode) {
        inputGroup.appendChild(errorNode);
    },


    /**
     * DOM algorithm - where to add/remove error class
     *
     * @param {HTMLElement} inputGroup
     */
    toggleErrorClass: function toggleErrorClass(inputGroup) {
        inputGroup.classList.toggle(this.config.classInputGroupError);
    },


    /**
     * Create DOM element for error message
     *
     * @returns {HTMLElement}
     */
    createErrorNode: function createErrorNode() {
        var el = document.createElement(this.config.tagNameError);
        el.classList.add(this.config.classError);
        return el;
    },


    /**
     * Find error message node within input group or false if not found
     *
     * @param {HTMLElement} inputGroup
     *
     * @returns {HTMLElement|boolean}
     */
    getErrorNode: function getErrorNode(inputGroup) {
        return inputGroup.getElementsByClassName(this.config.classError)[0] || false;
    },


    /**
     * Removes error node and class from input group if exists
     *
     * @param {HTMLElement} inputGroup
     */
    removeErrorNode: function removeErrorNode(inputGroup) {
        var el = this.getErrorNode(inputGroup);
        if (el) {
            // MF
            //el.parentNode.removeChild(el);
            el.textContent = '';
            this.toggleErrorClass(inputGroup);
        }
    },


    /**
     * Removes all error node and class from input group if exists within section
     *
     * @param {HTMLElement} section
     */
    removeErrorNodesFromSection: function removeErrorNodesFromSection(section) {
        var _this = this;

        [].forEach.call(this.getInputGroupsInSection(section), function (inputGroup) {
            _this.removeErrorNode(inputGroup);
        });
    },


    /**
     * Creates and includes into DOM error node or updates error message
     *
     * @param {HTMLElement} inputGroup
     * @param {String} message
     */
    setErrorMessage: function setErrorMessage(inputGroup, message) {
        var errorNode = this.getErrorNode(inputGroup);
        if (errorNode === false) {
            // container for error message doesn't exists, create new
            errorNode = this.createErrorNode();
            this.toggleErrorClass(inputGroup);
            this.insertErrorNode(inputGroup, errorNode);
        }
        // set or update error message
        errorNode.textContent = message;
    },


    /**
     * Marks input as valid
     *
     * @param {HTMLElement} inputGroup
     */
    setInputValid: function setInputValid(inputGroup) {
        inputGroup.classList.add(this.config.classInputGroupSuccess);
    },


    /* ************************************************************************
     * SEARCH DOM
     */

    /**
     * DOM Algorithm - which inputs should be selected for validation
     *
     * @param {HTMLElement} inputGroup
     *
     * @returns {HTMLElement|boolean}
     */
    getInput: function getInput(inputGroup) {
        return inputGroup.querySelector(this.config.selectorInput) || false;
    },


    /**
     * Find closest parent inputGroup element by Input element
     *
     * @param {HTMLElement} input
     *
     * @returns {HTMLElement}
     */
    getInputGroup: function getInputGroup(input) {
        var el = input;
        while ((el = el.parentNode) && !el.classList.contains(this.config.classInputGroup)) {}
        return el;
    },


    /**
     * Find inputs in section
     *
     * @meta if second argument true - return object with meta information to use during promise resolving
     *
     * @param {HTMLElement} node
     * @param {boolean} resolving = false
     *
     * @returns {Array|Object}
     */
    getInputsInSection: function getInputsInSection(node) {
        var resolving = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var inputGroups = this.getInputGroupsInSection(node);
        var inputs = void 0;
        if (resolving) {
            inputs = {
                inputs: {},
                invalidInputs: {},
                length: 0,
                unresolvedLength: 0,
                invalidLength: 0
            };
        } else {
            inputs = [];
        }
        for (var k = 0; k < inputGroups.length; k++) {
            var input = this.getInput(inputGroups[k]);
            if (input === false) {
                console.error(inputGroups[k]);
                throw new Error('Bunny Validation: Input group has no input');
            }
            if (resolving) {
                inputs.inputs[k] = {
                    input: input,
                    isValid: null
                };
                inputs.length++;
                inputs.unresolvedLength++;
            } else {
                inputs.push(input);
            }
        }
        return inputs;
    },


    /**
     * Find label associated with input within input group
     *
     * @param {HTMLElement} inputGroup
     *
     * @returns {HTMLElement|boolean}
     */
    getLabel: function getLabel(inputGroup) {
        return inputGroup.getElementsByTagName('label')[0] || false;
    },


    /**
     * Find all input groups within section
     *
     * @param {HTMLElement} node
     *
     * @returns {HTMLCollection}
     */
    getInputGroupsInSection: function getInputGroupsInSection(node) {
        return node.getElementsByClassName(this.config.classInputGroup);
    }
};

var Validation = {

    validators: ValidationValidators,
    lang: ValidationLang,
    ui: ValidationUI,

    init: function init(form) {
        var _this2 = this;

        var inline = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        // disable browser built-in validation
        form.setAttribute('novalidate', '');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var submitBtns = form.querySelectorAll('[type="submit"]');
            [].forEach.call(submitBtns, function (submitBtn) {
                submitBtn.disabled = true;
            });
            _this2.validateSection(form).then(function (result) {
                [].forEach.call(submitBtns, function (submitBtn) {
                    submitBtn.disabled = false;
                });
                if (result === true) {
                    // MF
                    if (form.getAttribute('id') == 'form-modal') {
                        kontakt_ajax(form);
                    } else {
                        form.submit();
                    }
                } else {
                    _this2.focusInput(result[0]);
                }
            });
        });

        if (inline) {
            this.initInline(form);
        }
    },
    initInline: function initInline(node) {
        var _this3 = this;

        var inputs = this.ui.getInputsInSection(node);
        inputs.forEach(function (input) {
            input.addEventListener('change', function () {
                _this3.checkInput(input).catch(function (e) {});
            });
        });
    },
    validateSection: function validateSection(node) {
        var _this4 = this;

        if (node.__bunny_validation_state === undefined) {
            node.__bunny_validation_state = true;
        } else {
            throw new Error('Bunny Validation: validation already in progress.');
        }
        return new Promise(function (resolve) {
            var resolvingInputs = _this4.ui.getInputsInSection(node, true);
            if (resolvingInputs.length === 0) {
                // nothing to validate, end
                _this4._endSectionValidation(node, resolvingInputs, resolve);
            } else {
                // run async validation for each input
                // when last async validation will be completed, call validSection or invalidSection
                var promises = [];

                var _loop = function _loop(i) {
                    var input = resolvingInputs.inputs[i].input;

                    _this4.checkInput(input).then(function () {
                        _this4._addValidInput(resolvingInputs, input);
                        if (resolvingInputs.unresolvedLength === 0) {
                            _this4._endSectionValidation(node, resolvingInputs, resolve);
                        }
                    }).catch(function (errorMessage) {
                        _this4._addInvalidInput(resolvingInputs, input);
                        if (resolvingInputs.unresolvedLength === 0) {
                            _this4._endSectionValidation(node, resolvingInputs, resolve);
                        }
                    });
                };

                for (var i = 0; i < resolvingInputs.length; i++) {
                    _loop(i);
                }

                // if there are not resolved promises after 3s, terminate validation, mark pending inputs as invalid
                setTimeout(function () {
                    if (resolvingInputs.unresolvedLength > 0) {
                        var unresolvedInputs = _this4._getUnresolvedInputs(resolvingInputs);
                        for (var i = 0; i < unresolvedInputs.length; i++) {
                            var _input = unresolvedInputs[i];
                            var inputGroup = _this4.ui.getInputGroup(_input);
                            _this4._addInvalidInput(resolvingInputs, _input);
                            _this4.ui.setErrorMessage(inputGroup, 'Validation terminated after 3s');
                            if (resolvingInputs.unresolvedLength === 0) {
                                _this4._endSectionValidation(node, resolvingInputs, resolve);
                            }
                        }
                    }
                }, 3000);
            }
        });
    },
    focusInput: function focusInput(input) {
        var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
        var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -50;

        BunnyElement.scrollTo(input, delay, offset);
        input.focus();
        if (input.offsetParent !== null && input.setSelectionRange !== undefined && ['text', 'search', 'url', 'tel', 'password'].indexOf(input.type) !== -1 && typeof input.setSelectionRange === 'function') {
            input.setSelectionRange(input.value.length, input.value.length);
        }
    },
    checkInput: function checkInput(input) {
        var _this5 = this;

        return new Promise(function (valid, invalid) {
            _this5._checkInput(input, 0, valid, invalid);
        });
    },
    _addValidInput: function _addValidInput(resolvingInputs, input) {
        resolvingInputs.unresolvedLength--;
        for (var k in resolvingInputs.inputs) {
            if (input === resolvingInputs.inputs[k].input) {
                resolvingInputs.inputs[k].isValid = true;
                break;
            }
        }
    },
    _addInvalidInput: function _addInvalidInput(resolvingInputs, input) {
        resolvingInputs.unresolvedLength--;
        resolvingInputs.invalidLength++;
        for (var k in resolvingInputs.inputs) {
            if (input === resolvingInputs.inputs[k].input) {
                resolvingInputs.inputs[k].isValid = false;
                resolvingInputs.invalidInputs[k] = input;
                break;
            }
        }
    },
    _getUnresolvedInputs: function _getUnresolvedInputs(resolvingInputs) {
        var unresolvedInputs = [];
        for (var k in resolvingInputs.inputs) {
            if (!resolvingInputs.inputs[k].isValid) {
                unresolvedInputs.push(resolvingInputs.inputs[k].input);
            }
        }
        return unresolvedInputs;
    },
    _endSectionValidation: function _endSectionValidation(node, resolvingInputs, resolve) {
        delete node.__bunny_validation_state;

        if (resolvingInputs.invalidLength === 0) {
            // form or section is valid
            return resolve(true);
        } else {
            var invalidInputs = [];
            for (var k in resolvingInputs.invalidInputs) {
                invalidInputs.push(resolvingInputs.invalidInputs[k]);
            }
            // form or section has invalid inputs
            return resolve(invalidInputs);
        }
    },
    _checkInput: function _checkInput(input, index, valid, invalid) {
        var _this6 = this;

        var validators = Object.keys(this.validators);
        var currentValidatorName = validators[index];
        var currentValidator = this.validators[currentValidatorName];

        currentValidator(input).then(function () {
            index++;
            if (validators[index] !== undefined) {
                _this6._checkInput(input, index, valid, invalid);
            } else {
                var inputGroup = _this6.ui.getInputGroup(input);
                // if has error message, remove it
                _this6.ui.removeErrorNode(inputGroup);

                if (input.form !== undefined && input.form.hasAttribute('showvalid')) {
                    // mark input as valid
                    _this6.ui.setInputValid(inputGroup);
                }

                valid();
            }
        }).catch(function (data) {
            // get input group and label
            var inputGroup = _this6.ui.getInputGroup(input);
            var label = _this6.ui.getLabel(inputGroup);

            // get error message
            var errorMessage = _this6._getErrorMessage(currentValidatorName, input, label, data);

            // set error message
            _this6.ui.setErrorMessage(inputGroup, errorMessage);
            invalid(errorMessage);
        });
    },
    _getErrorMessage: function _getErrorMessage(validatorName, input, label, data) {
        var message = '';
        if (typeof data === 'string') {
            // if validator returned string (from ajax for example), use it
            message = data;
        } else {
            if (this.lang[validatorName] === undefined) {
                throw new Error('Bunny Validation: Lang message not found for validator: ' + validatorName);
            }
            message = this.lang[validatorName];
        }

        // replace params in error message
        // MF
        if (input.hasAttribute('data-error') && input.getAttribute('data-error').length) {
            message = input.getAttribute('data-error');
        } else if (label !== false) {
            message = message.replace('{label}', label.textContent);
        } else if (input.placeholder && input.placeholder !== '') {
            message = message.replace('{label}', input.placeholder);
        } else {
            message = message.replace('{label}', '');
        }

        for (var paramName in data) {
            message = message.replace('{' + paramName + '}', data[paramName]);
        }
        // MF
        return message.replace('*', '').replace(':', '').trim();
    }
};

document.addEventListener('DOMContentLoaded', function () {
    [].forEach.call(document.forms, function (form) {
        if (form.getAttribute('validator') === 'bunny') {
            var inline = form.hasAttribute('validator-inline');
            Validation.init(form, inline);
        }
    });
});

'use strict';

// Polyfill matches as per https://github.com/jonathantneal/closest

Element.prototype.matches = Element.prototype.matches || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;

/**
 * @param {object} options Object containing configuration overrides
 */
var Frtooltip = function Frtooltip() {
	var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	    _ref$selector = _ref.selector,
	    selector = _ref$selector === undefined ? '.js-tooltip' : _ref$selector,
	    _ref$tooltipSelector = _ref.tooltipSelector,
	    tooltipSelector = _ref$tooltipSelector === undefined ? '.js-tooltip-tooltip' : _ref$tooltipSelector,
	    _ref$toggleSelector = _ref.toggleSelector,
	    toggleSelector = _ref$toggleSelector === undefined ? '.js-tooltip-toggle' : _ref$toggleSelector,
	    _ref$tooltipIdPrefix = _ref.tooltipIdPrefix,
	    tooltipIdPrefix = _ref$tooltipIdPrefix === undefined ? 'tooltip' : _ref$tooltipIdPrefix,
	    _ref$readyClass = _ref.readyClass,
	    readyClass = _ref$readyClass === undefined ? 'tooltip--is-ready' : _ref$readyClass;

	// CONSTANTS
	var doc = document;
	var docEl = doc.documentElement;
	var _q = function _q(el) {
		var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : doc;
		return [].slice.call(ctx.querySelectorAll(el));
	};

	// SUPPORTS
	if (!('querySelector' in doc) || !('addEventListener' in window) || !docEl.classList) return;

	// SETUP
	var tooltipContainers = _q(selector);

	//	TEMP
	var currTooltip = null;

	//	UTILS
	function _defer(fn) {
		//	wrapped in setTimeout to delay binding until previous rendering has completed
		if (typeof fn === 'function') setTimeout(fn, 0);
	}
	function _closest(el, selector) {
		while (el) {
			if (el.matches(selector)) break;
			el = el.parentElement;
		}
		return el;
	}

	//	A11Y
	function _addA11y(container, i) {
		//	get relative elements
		var toggle = _q(toggleSelector, container)[0];
		var tooltip = _q(tooltipSelector, container)[0];
		//	create new button and replace toggle
		if (tooltip.querySelector(toggle.getAttribute('class'))) {
			var button = doc.createElement('button');
			button.setAttribute('class', toggle.getAttribute('class'));
			button.setAttribute('aria-expanded', 'false');
			button.setAttribute('aria-describedby', '');
			button.textContent = toggle.textContent;
			container.replaceChild(button, toggle);
		}
		//	add tooltip attributes
		tooltip.setAttribute('role', 'tooltip');
		tooltip.setAttribute('id', tooltipIdPrefix + '-' + i);
		tooltip.setAttribute('aria-hidden', 'true');
		tooltip.setAttribute('aria-live', 'polite');
	}
	function _removeA11y(container) {
		//	get relative elements
		var toggle = _q(toggleSelector, container)[0];
		var tooltip = _q(tooltipSelector, container)[0];
		//	create new span and replace toggle
		var span = doc.createElement('span');
		span.setAttribute('class', toggle.getAttribute('class'));
		span.textContent = toggle.textContent;
		container.replaceChild(span, toggle);
		//	remove tooltip attributes
		tooltip.removeAttribute('role');
		tooltip.removeAttribute('id');
		tooltip.removeAttribute('aria-hidden');
		tooltip.removeAttribute('aria-live');
	}

	// ACTIONS
	function _showTooltip(toggle, tooltip) {
		// posune tooltip do správné pozice
		var sirka_tooltipu = 190;
		var stred = toggle.getBoundingClientRect().left + toggle.getBoundingClientRect().width / 2;
		tooltip.classList.remove('leva');
		tooltip.classList.remove('prava');
		if (stred < sirka_tooltipu / 2) {
			tooltip.classList.add('leva');
		} else if (stred > window.innerWidth - sirka_tooltipu / 2) {
			tooltip.classList.add('prava');
		}

		//	assign describedby matching tooltip reference
		var tooltipId = tooltip.getAttribute('id');
		toggle.setAttribute('aria-describedby', tooltipId);
		//	set visible state
		toggle.setAttribute('aria-expanded', 'true');
		tooltip.setAttribute('aria-hidden', 'false');
		//	store temp reference to tooltip
		currTooltip = tooltip;
		//	bind doc close events
		_defer(_bindDocClick);
		_defer(_bindDocKey);
	}
	function _hideTooltip(toggle, tooltip) {
		//	remove tooltip reference
		toggle.setAttribute('aria-describedby', '');
		//	set visible state
		toggle.setAttribute('aria-expanded', 'false');
		tooltip.setAttribute('aria-hidden', 'true');
		//	remove tooltip temp reference
		currTooltip = null;
		//	unbind doc close events
		_unbindDocClick();
		_unbindDocKey();
	}
	function destroy() {
		tooltipContainers.forEach(function (container, i) {
			_removeA11y(container, i);
			_unbindToggleEvents(container);
			container.classList.remove(readyClass);
		});
		//	reset temp references
		currTooltip = null;
		//	unbind global events
		_unbindDocClick();
		_unbindDocKey();
	}

	// EVENTS
	function _eventTogglePointer(e) {
		//	close any open tooltips
		if (currTooltip) _hideTooltip(currTooltip.previousElementSibling, currTooltip);
		//	get relevant tooltip elements
		var toggle = e.target;
		// MF : přidáno
		if (!hasClass(toggle, 'tooltip-toggle')) {
			toggle = toggle.parentNode;
		}

		var tooltip = toggle.nextElementSibling;
		//	show or hide if toggle is 'expanded'
		if (toggle.getAttribute('aria-expanded') === 'false') {
			_showTooltip(toggle, tooltip);
		} else {
			_hideTooltip(toggle, tooltip);
		}
	}
	function _eventTogglePointerLeave() {
		if (currTooltip) _hideTooltip(currTooltip.previousElementSibling, currTooltip);
	}
	function _eventDocClick(e) {
		//	check if target is panel or child of
		var isTooltip = e.target === currTooltip;
		var isTooltipchild = _closest(e.target, tooltipSelector);
		if (!isTooltip && !isTooltipchild) _hideTooltip(currTooltip.previousElementSibling, currTooltip);
	}
	function _eventDocKey(e) {
		//	esc key
		if (e.keyCode === 27) _hideTooltip(currTooltip.previousElementSibling, currTooltip);
	}

	// BIND EVENTS
	function _bindToggleEvents(container) {
		var toggle = _q(toggleSelector, container)[0];
		toggle.addEventListener('click', _eventTogglePointer);
		toggle.addEventListener('mouseenter', _eventTogglePointer);
		toggle.addEventListener('mouseleave', _eventTogglePointerLeave);
	}
	function _bindDocClick() {
		doc.addEventListener('click', _eventDocClick);
		doc.addEventListener('touchstart', _eventDocClick);
	}
	function _bindDocKey() {
		doc.addEventListener('keydown', _eventDocKey);
	}

	//	UNBIND EVENTS
	function _unbindToggleEvents(container) {
		var toggle = _q(toggleSelector, container)[0];
		toggle.removeEventListener('click', _eventTogglePointer);
		toggle.removeEventListener('mouseenter', _eventTogglePointer);
		toggle.removeEventListener('mouseleave', _eventTogglePointerLeave);
	}
	function _unbindDocClick() {
		doc.removeEventListener('click', _eventDocClick);
		doc.removeEventListener('touchstart', _eventDocClick);
	}
	function _unbindDocKey() {
		doc.removeEventListener('keydown', _eventDocKey);
	}

	// INIT
	function init() {
		if (!tooltipContainers) return;
		//	loop through each tooltip element
		tooltipContainers.forEach(function (container, i) {
			_addA11y(container, i);
			_bindToggleEvents(container);
			container.classList.add(readyClass);
		});
	}
	init();

	// REVEAL API
	return {
		init: init,
		destroy: destroy
	};
};

// module exports

/* jshint esversion: 6 */

///import { lory } from './lory/lory.js';
///var lory = require('./lorylory.js').lory;
///=require ./lory/custom-event.js

////=require ./lory/lory.js
////=require ideal-image-slider.js
/* Focusin/out event polyfill (for Firefox) by nuxodin
 * Source: https://gist.github.com/nuxodin/9250e56a3ce6c0446efa
 */

!function(){
  var w = window,
  d = w.document;

  if( w.onfocusin === undefined ){
    d.addEventListener('focus' ,addPolyfill ,true);
    d.addEventListener('blur' ,addPolyfill ,true);
    d.addEventListener('focusin' ,removePolyfill ,true);
    d.addEventListener('focusout' ,removePolyfill ,true);
  }
  function addPolyfill(e){
    var type = e.type === 'focus' ? 'focusin' : 'focusout';
    var event = new CustomEvent(type, { bubbles:true, cancelable:false });
    event.c1Generated = true;
    e.target.dispatchEvent( event );
  }
  function removePolyfill(e){
if(!e.c1Generated){ // focus after focusin, so chrome will the first time trigger tow times focusin
  d.removeEventListener('focus' ,addPolyfill ,true);
  d.removeEventListener('blur' ,addPolyfill ,true);
  d.removeEventListener('focusin' ,removePolyfill ,true);
  d.removeEventListener('focusout' ,removePolyfill ,true);
}
setTimeout(function(){
  d.removeEventListener('focusin' ,removePolyfill ,true);
  d.removeEventListener('focusout' ,removePolyfill ,true);
});
}
}();

/*
   Carousel Prototype
   Eric Eggert for W3C
*/

var myCarousel = (function() {

  "use strict";

  // Initial variables
  var carousel, slides, index, slidenav, settings, timer, setFocus, announceItem, animationSuspended, _this;


  // Helper function: Iterates over an array of elements
  function forEachElement(elements, fn) {
    for (var i = 0; i < elements.length; i++)
      fn(elements[i], i);
  }

  // Helper function: Remove Class
  function removeClass(el, className) {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }

  // Helper function: Test if element has a specific class
  function hasClass(el, className) {
    if (el.classList) {
      return el.classList.contains(className);
    } else {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }
  }

  // Initialization for the carousel
  // Argument: set = an object of settings
  // Possible settings:
  // id <string> ID of the carousel wrapper element (required).
  // slidenav <bool> If true, a list of slides is shown.
  // animate <bool> If true, the slides can be animated.
  // startAnimated <bool> If true, the animation begins
  //                        immediately.
  //                      If false, the animation needs
  //                        to be initiated by clicking
  //                        the play button.
  function init(set) {

    // Make settings available to all functions
    settings = set;

    // Select the element and the individual slides
    carousel = document.getElementById(settings.id);
    slides = carousel.querySelectorAll('.slide');

    carousel.className = 'carousel carousel-active';

    resize(carousel);

    window.addEventListener('resize', function() {
      var carousel = document.getElementById('carousel');
      resize(carousel);
    });

    // Create unordered list for controls, and attach click events fo previous and next slide
    var ctrls = document.querySelector('.carousel-sipky');

    ctrls.querySelector('.carousel-prev')
      .addEventListener('click', function () {
        prevSlide(true);
      });
    ctrls.querySelector('.carousel-next')
      .addEventListener('click', function () {
        nextSlide(true);
      });

    //carousel.appendChild(ctrls);

    // If the carousel is animated or a slide navigation is requested in the settings, anoter unordered list that contains those elements is added. (Note that you cannot supress the navigation when it is animated.)
    /*
    if (settings.slidenav || settings.animate) {
      slidenav = document.createElement('ul');

      slidenav.className = 'slidenav';

      if (settings.animate) {
        var li = document.createElement('li');

        if (settings.startAnimated) {
          li.innerHTML = '<button data-action="stop"><span class="visuallyhidden">Stop Animation </span>￭</button>';
        } else {
          li.innerHTML = '<button data-action="start"><span class="visuallyhidden">Start Animation </span>▶</button>';
        }

        slidenav.appendChild(li);
      }

      if (settings.slidenav) {
        forEachElement(slides, function(el, i){
          var li = document.createElement('li');
          var klass = (i===0) ? 'class="current" ' : '';
          var kurrent = (i===0) ? ' <span class="visuallyhidden">(Current Item)</span>' : '';

          li.innerHTML = '<button '+ klass +'data-slide="' + i + '"><span class="visuallyhidden">News</span> ' + (i+1) + kurrent + '</button>';
          slidenav.appendChild(li);
        });
      }

      slidenav.addEventListener('click', function(event) {
        var button = event.target;
        if (button.localName == 'button') {
          if (button.getAttribute('data-slide')) {
            stopAnimation();
            setSlides(button.getAttribute('data-slide'), true);
          } else if (button.getAttribute('data-action') == "stop") {
            stopAnimation();
          } else if (button.getAttribute('data-action') == "start") {
            startAnimation();
          }
        }
      }, true);

      carousel.className = 'carousel carousel-active with-slidenav';
      carousel.appendChild(slidenav);
    }
    */
    // Add a live region to announce the slide number when using the previous/next buttons
    /*
    var liveregion = document.createElement('div');
    liveregion.setAttribute('aria-live', 'polite');
    liveregion.setAttribute('aria-atomic', 'true');
    liveregion.setAttribute('class', 'liveregion visuallyhidden');
    carousel.appendChild(liveregion);
    */
    // After the slide transitioned, remove the in-transition class, if focus should be set, set the tabindex attribute to -1 and focus the slide.
    slides[0].parentNode.addEventListener('transitionend', function (event) {
      var slide = event.target;
      removeClass(slide, 'in-transition');
      if (hasClass(slide, 'current'))  {
        if(setFocus) {
          slide.setAttribute('tabindex', '-1');
          slide.focus();
          setFocus = false;
        }
      }
    });
    /*
      // When the mouse enters the carousel, suspend the animation.
      carousel.addEventListener('mouseenter', suspendAnimation);

      // When the mouse leaves the carousel, and the animation is suspended, start the animation.
      carousel.addEventListener('mouseleave', function(event) {
        if (animationSuspended) {
          startAnimation();
        }
      });

      // When the focus enters the carousel, suspend the animation
      carousel.addEventListener('focusin', function(event) {
        if (!hasClass(event.target, 'slide')) {
          suspendAnimation();
        }
      });

      // When the focus leaves the carousel, and the animation is suspended, start the animation
      carousel.addEventListener('focusout', function(event) {
        if (!hasClass(event.target, 'slide') && animationSuspended) {
          startAnimation();
        }
      });
      */
    // Set the index (=current slide) to 0 – the first slide
    index = 0;
    setSlides(index);

    // If the carousel is animated, advance to the
    // next slide after 5s
    if (settings.startAnimated) {
      timer = setTimeout(nextSlide, 5000);
    }
  }

  // Function to set a slide the current slide
  function setSlides(new_current, setFocusHere, transition, announceItemHere) {
    // Focus, transition and announce Item are optional parameters.
    // focus denotes if the focus should be set after the
    // carousel advanced to slide number new_current.
    // transition denotes if the transition is going into the
    // next or previous direction.
    // If announceItem is set to true, the live region’s text is changed (and announced)
    // Here defaults are set:

    setFocus = typeof setFocusHere !== 'undefined' ? setFocusHere : false;
    transition = typeof transition !== 'undefined' ? transition : 'none';
    announceItem = typeof announceItemHere !== 'undefined' ? announceItemHere : false;

    new_current = parseFloat(new_current);

    var length = slides.length;
    var new_next = new_current+1;
    var new_prev = new_current-1;

    // If the next slide number is equal to the length,
    // the next slide should be the first one of the slides.
    // If the previous slide number is less than 0.
    // the previous slide is the last of the slides.
    if(new_next === length) {
      new_next = 0;
    } else if(new_prev < 0) {
      new_prev = length-1;
    }

    // Reset slide classes
    for (var i = slides.length - 1; i >= 0; i--) {
      slides[i].className = "slide";
    }

    // Add classes to the previous, next and current slide
    slides[new_next].className = 'next slide' + ((transition == 'next') ? ' in-transition' : '');
    slides[new_next].setAttribute('aria-hidden', 'true');

    slides[new_prev].className = 'prev slide' + ((transition == 'prev') ? ' in-transition' : '');
    slides[new_prev].setAttribute('aria-hidden', 'true');

    slides[new_current].className = 'current slide';
    slides[new_current].removeAttribute('aria-hidden');

    /*
    // Update the text in the live region which is then announced by screen readers.
    if (announceItem) {
      carousel.querySelector('.liveregion').textContent = 'Item ' + (new_current + 1) + ' of ' + slides.length;
    }
    // Update the buttons in the slider navigation to match the currently displayed  item
    if(settings.slidenav) {
      var buttons = carousel.querySelectorAll('.slidenav button[data-slide]');
      for (var j = buttons.length - 1; j >= 0; j--) {
        buttons[j].className = '';
        buttons[j].innerHTML = '<span class="visuallyhidden">News</span> ' + (j+1);
      }
      buttons[new_current].className = "current";
      buttons[new_current].innerHTML = '<span class="visuallyhidden">News</span> ' + (new_current+1) + ' <span class="visuallyhidden">(Current Item)</span>';
    }
    */
    // Set the global index to the new current value
    index = new_current;

  }

  // Function to advance to the next slide
  function nextSlide(announceItem) {
    announceItem = typeof announceItem !== 'undefined' ? announceItem : false;

    var length = slides.length,
    new_current = index + 1;

    if(new_current === length) {
      new_current = 0;
    }

    // If we advance to the next slide, the previous needs to be
    // visible to the user, so the third parameter is 'prev', not
    // next.
    setSlides(new_current, false, 'prev', announceItem);

    // If the carousel is animated, advance to the next
    // slide after 5s
    if (settings.animate) {
      timer = setTimeout(nextSlide, 5000);
    }

  }

  // Function to advance to the previous slide
  function prevSlide(announceItem) {
    announceItem = typeof announceItem !== 'undefined' ? announceItem : false;

    var length = slides.length,
    new_current = index - 1;

    // If we are already on the first slide, show the last slide instead.
    if(new_current < 0) {
      new_current = length-1;
    }

    // If we advance to the previous slide, the next needs to be
    // visible to the user, so the third parameter is 'next', not
    // prev.
    setSlides(new_current, false, 'next', announceItem);

  }

  // Function to stop the animation
  function stopAnimation() {
    clearTimeout(timer);
    settings.animate = false;
    animationSuspended = false;
    _this = carousel.querySelector('[data-action]');
    _this.innerHTML = '<span class="visuallyhidden">Start Animation </span>▶';
    _this.setAttribute('data-action', 'start');
  }

  // Function to start the animation
  function startAnimation() {
    settings.animate = true;
    animationSuspended = false;
    timer = setTimeout(nextSlide, 5000);
    _this = carousel.querySelector('[data-action]');
    _this.innerHTML = '<span class="visuallyhidden">Stop Animation </span>￭';
    _this.setAttribute('data-action', 'stop');
  }

  // Function to suspend the animation
  function suspendAnimation() {
    if(settings.animate) {
      clearTimeout(timer);
      settings.animate = false;
      animationSuspended = true;
    }
  }

  // Function to suspend the animation
  function resize(carousel) {
    carousel.style.height = ( 460 / 780 ) * carousel.offsetWidth + 'px';
  }

  // Making some functions public
  return {
    init:init,
    next:nextSlide,
    prev:prevSlide,
    goto:setSlides,
    stop:stopAnimation,
    start:startAnimation
  };
});

Validation.lang.required = "Kolonka '{label}' je povinná";
Validation.lang.email = "Kolonka '{label}' musí být platná emailová adresa!";
Validation.lang.tel = "Telefon je neplatný!";
Validation.lang.maxLength = "'{label}' musí být < '{maxLength}'";
Validation.lang.minLength = "'{label}' lmusí být > '{minLength}'";
Validation.lang.maxFileSize = "Max file size must be < {maxFileSize}MB, uploaded {fileSize}MB";
Validation.lang.image = "'{label}' should be an image (JPG or PNG)";
Validation.lang.minImageDimensions = "'{label}' must be > {minWidth}x{minHeight}, uploaded {width}x{height}";
Validation.lang.maxImageDimensions = "'{label}' must be < {maxWidth}x{maxHeight}, uploaded {width}x{height}";
Validation.lang.requiredFromList = "Vyberte '{label}' ze seznamu";
Validation.lang.confirmation = "'{label}' is not equal to '{originalLabel}'";
Validation.lang.minOptions = "Vyberte alespoň {minOptionsCount} možnost";

function hasClass(el, className) {
  if (el.classList) {
    return el.classList.contains(className);
  } else {
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }
}
function addClass(el, className) {
  if (el.classList) {
    el.classList.add(className);
  } else {
    el.className += ' ' + className;
  }
}
function removeClass(el, className) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
}

function serialize(form) {
    var field, s = [];
    if (typeof form == 'object' && form.nodeName == "FORM") {
        var len = form.elements.length;
        for (var i=0; i<len; i++) {
            field = form.elements[i];
            if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                if (field.type == 'select-multiple') {
                    for (j=form.elements[i].options.length-1; j>=0; j--) {
                        if(field.options[j].selected)
                            s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
                    }
                } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
                    s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value);
                }
            }
        }
    }
    return s.join('&').replace(/%20/g, '+');
}


// https://toddmotto.com/ditch-the-array-foreach-call-nodelist-hack/
function forEach (array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]); // passes back stuff we need
  }
}

// https://stackoverflow.com/questions/10309650/add-elements-to-the-dom-given-plain-text-html-using-only-pure-javascript-no-jqu
function appendHtml(el, str) {
  var div = document.createElement('div');
  div.innerHTML = str;
  while (div.children.length > 0) {
    el.appendChild(div.children[0]);
  }
}
// https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
function is_touch_device() {
  return 'ontouchstart' in window        // works on most browsers
      || navigator.maxTouchPoints;       // works on IE10/11 and Surface
}

/*!
 * tingle.js
 * @author  robin_parisi
 * @version 0.10.0
 * @url
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.tingle = factory();
    }
}(this, function() {

    /* ----------------------------------------------------------- */
    /* == modal */
    /* ----------------------------------------------------------- */

    var transitionEvent = whichTransitionEvent();

    function Modal(options) {

        var defaults = {
            onClose: null,
            onOpen: null,
            beforeClose: null,
            stickyFooter: false,
            footer: false,
            cssClass: [],
            closeLabel: 'zavřít',
            closeMethods: ['overlay', 'button', 'escape']
        };

        // extends config
        this.opts = extend({}, defaults, options);

        // init modal
        this.init();
    }

    Modal.prototype.init = function() {
        if (this.modal) {
            return;
        }

        _build.call(this);
        _bindEvents.call(this);

        // insert modal in dom
        document.body.insertBefore(this.modal, document.body.firstChild);

        if (this.opts.footer) {
            this.addFooter();
        }
    };

    Modal.prototype.destroy = function() {
        if (this.modal === null) {
            return;
        }

        // unbind all events
        _unbindEvents.call(this);

        // remove modal from dom
        this.modal.parentNode.removeChild(this.modal);

        this.modal = null;
    };


    Modal.prototype.open = function() {

        if (this.modal.style.removeProperty) {
            this.modal.style.removeProperty('display');
        } else {
            this.modal.style.removeAttribute('display');
        }

        // prevent double scroll
        document.body.classList.add('tingle-enabled');

        // sticky footer
        this.setStickyFooter(this.opts.stickyFooter);

        // show modal
        this.modal.classList.add('tingle-modal--visible');

        // onOpen event
        var self = this;

        if (transitionEvent) {
            this.modal.addEventListener(transitionEvent, function handler() {
                if (typeof self.opts.onOpen === 'function') {
                    self.opts.onOpen.call(self);
                }

                // detach event after transition end (so it doesn't fire multiple onOpen)
                self.modal.removeEventListener(transitionEvent, handler, false);

            }, false);
        } else {
            if (typeof self.opts.onOpen === 'function') {
                self.opts.onOpen.call(self);
            }
        }

        // check if modal is bigger than screen height
        this.checkOverflow();
    };

    Modal.prototype.isOpen = function() {
        return !!this.modal.classList.contains("tingle-modal--visible");
    };

    Modal.prototype.close = function() {

        //  before close
        if (typeof this.opts.beforeClose === "function") {
            var close = this.opts.beforeClose.call(this);
            if (!close) return;
        }

        document.body.classList.remove('tingle-enabled');

        this.modal.classList.remove('tingle-modal--visible');

        //Using similar setup as onOpen
        //Reference to the Modal that's created
        var self = this;

        if (transitionEvent) {
            //Track when transition is happening then run onClose on complete
            this.modal.addEventListener(transitionEvent, function handler() {
                // detach event after transition end (so it doesn't fire multiple onClose)
                self.modal.removeEventListener(transitionEvent, handler, false);

                self.modal.style.display = 'none';

                // on close callback
                if (typeof self.opts.onClose === "function") {
                    self.opts.onClose.call(this);
                }

            }, false);
        } else {
            self.modal.style.display = 'none';
            // on close callback
            if (typeof self.opts.onClose === "function") {
                self.opts.onClose.call(this);
            }
        }
    };

    Modal.prototype.setContent = function(content) {
        // check type of content : String or Node
        if (typeof content === 'string') {
            this.modalBoxContent.innerHTML = content;
        } else {
            this.modalBoxContent.innerHTML = "";
            this.modalBoxContent.appendChild(content);
        }
    };

    Modal.prototype.getContent = function() {
        return this.modalBoxContent;
    };

    Modal.prototype.addFooter = function() {
        // add footer to modal
        _buildFooter.call(this);
    };

    Modal.prototype.setFooterContent = function(content) {
        // set footer content
        this.modalBoxFooter.innerHTML = content;
    };

    Modal.prototype.getFooterContent = function() {
        return this.modalBoxFooter;
    };

    Modal.prototype.setStickyFooter = function(isSticky) {
        // if the modal is smaller than the viewport height, we don't need sticky
        if (!this.isOverflow()) {
            isSticky = false;
        }

        if (isSticky) {
            if (this.modalBox.contains(this.modalBoxFooter)) {
                this.modalBox.removeChild(this.modalBoxFooter);
                this.modal.appendChild(this.modalBoxFooter);
                this.modalBoxFooter.classList.add('tingle-modal-box__footer--sticky');
                _recalculateFooterPosition.call(this);
                this.modalBoxContent.style['padding-bottom'] = this.modalBoxFooter.clientHeight + 20 + 'px';
            }
        } else if (this.modalBoxFooter) {
            if (!this.modalBox.contains(this.modalBoxFooter)) {
                this.modal.removeChild(this.modalBoxFooter);
                this.modalBox.appendChild(this.modalBoxFooter);
                this.modalBoxFooter.style.width = 'auto';
                this.modalBoxFooter.style.left = '';
                this.modalBoxContent.style['padding-bottom'] = '';
                this.modalBoxFooter.classList.remove('tingle-modal-box__footer--sticky');
            }
        }
    };


    Modal.prototype.addFooterBtn = function(label, cssClass, callback) {
        var btn = document.createElement("button");

        // set label
        btn.innerHTML = label;

        // bind callback
        btn.addEventListener('click', callback);

        if (typeof cssClass === 'string' && cssClass.length) {
            // add classes to btn
            cssClass.split(" ").forEach(function(item) {
                btn.classList.add(item);
            });
        }

        this.modalBoxFooter.appendChild(btn);

        return btn;
    };

    Modal.prototype.resize = function() {
        console.warn('Resize is deprecated and will be removed in version 1.0');
    };


    Modal.prototype.isOverflow = function() {
        var viewportHeight = window.innerHeight;
        var modalHeight = this.modalBox.clientHeight;

        return modalHeight >= viewportHeight;
    };

    Modal.prototype.checkOverflow = function() {
        // only if the modal is currently shown
        if (this.modal.classList.contains('tingle-modal--visible')) {
            if (this.isOverflow()) {
                this.modal.classList.add('tingle-modal--overflow');
            } else {
                this.modal.classList.remove('tingle-modal--overflow');
            }

            // TODO: remove offset
            //_offset.call(this);
            if (!this.isOverflow() && this.opts.stickyFooter) {
                this.setStickyFooter(false);
            } else if (this.isOverflow() && this.opts.stickyFooter) {
                _recalculateFooterPosition.call(this);
                this.setStickyFooter(true);
            }
        }
    }


    /* ----------------------------------------------------------- */
    /* == private methods */
    /* ----------------------------------------------------------- */

    function _recalculateFooterPosition() {
        if (!this.modalBoxFooter) {
            return;
        }
        this.modalBoxFooter.style.width = this.modalBox.clientWidth + 'px';
        this.modalBoxFooter.style.left = this.modalBox.offsetLeft + 'px';
    }

    function _build() {

        // wrapper
        this.modal = document.createElement('div');
        this.modal.classList.add('tingle-modal');

        // remove cusor if no overlay close method
        if (this.opts.closeMethods.length === 0 || this.opts.closeMethods.indexOf('overlay') === -1) {
            this.modal.classList.add('tingle-modal--noOverlayClose');
        }

        this.modal.style.display = 'none';

        // custom class
        this.opts.cssClass.forEach(function(item) {
            if (typeof item === 'string') {
                this.modal.classList.add(item);
            }
        }, this);

        // close btn
        if (this.opts.closeMethods.indexOf('button') !== -1) {
            this.modalCloseBtn = document.createElement('button');
            this.modalCloseBtn.classList.add('tingle-modal__close');

            this.modalCloseBtnIcon = document.createElement('span');
            this.modalCloseBtnIcon.classList.add('tingle-modal__closeIcon');
            this.modalCloseBtnIcon.innerHTML = '×';

            this.modalCloseBtnLabel = document.createElement('span');
            this.modalCloseBtnLabel.classList.add('tingle-modal__closeLabel');
            this.modalCloseBtnLabel.innerHTML = this.opts.closeLabel;

            this.modalCloseBtn.appendChild(this.modalCloseBtnIcon);
            this.modalCloseBtn.appendChild(this.modalCloseBtnLabel);
        }

        // modal
        this.modalBox = document.createElement('div');
        this.modalBox.classList.add('tingle-modal-box');

        // modal box content
        this.modalBoxContent = document.createElement('div');
        this.modalBoxContent.classList.add('tingle-modal-box__content');

        this.modalBox.appendChild(this.modalBoxContent);

        if (this.opts.closeMethods.indexOf('button') !== -1) {
            this.modal.appendChild(this.modalCloseBtn);
        }

        this.modal.appendChild(this.modalBox);

    }

    function _buildFooter() {
        this.modalBoxFooter = document.createElement('div');
        this.modalBoxFooter.classList.add('tingle-modal-box__footer');
        this.modalBox.appendChild(this.modalBoxFooter);
    }

    function _bindEvents() {

        this._events = {
            clickCloseBtn: this.close.bind(this),
            clickOverlay: _handleClickOutside.bind(this),
            resize: this.checkOverflow.bind(this),
            keyboardNav: _handleKeyboardNav.bind(this)
        };

        if (this.opts.closeMethods.indexOf('button') !== -1) {
            this.modalCloseBtn.addEventListener('click', this._events.clickCloseBtn);
        }

        this.modal.addEventListener('mousedown', this._events.clickOverlay);
        window.addEventListener('resize', this._events.resize);
        document.addEventListener("keydown", this._events.keyboardNav);
    }

    function _handleKeyboardNav(event) {
        // escape key
        if (this.opts.closeMethods.indexOf('escape') !== -1 && event.which === 27 && this.isOpen()) {
            this.close();
        }
    }

    function _handleClickOutside(event) {
        // if click is outside the modal
        if (this.opts.closeMethods.indexOf('overlay') !== -1 && !_findAncestor(event.target, 'tingle-modal') &&
            event.clientX < this.modal.clientWidth) {
            this.close();
        }
    }

    function _findAncestor(el, cls) {
        while ((el = el.parentElement) && !el.classList.contains(cls));
        return el;
    }

    function _unbindEvents() {
        if (this.opts.closeMethods.indexOf('button') !== -1) {
            this.modalCloseBtn.removeEventListener('click', this._events.clickCloseBtn);
        }
        this.modal.removeEventListener('mousedown', this._events.clickOverlay);
        window.removeEventListener('resize', this._events.resize);
        document.removeEventListener("keydown", this._events.keyboardNav);
    }

    /* ----------------------------------------------------------- */
    /* == confirm */
    /* ----------------------------------------------------------- */

    // coming soon

    /* ----------------------------------------------------------- */
    /* == alert */
    /* ----------------------------------------------------------- */

    // coming soon

    /* ----------------------------------------------------------- */
    /* == helpers */
    /* ----------------------------------------------------------- */

    function extend() {
        for (var i = 1; i < arguments.length; i++) {
            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    arguments[0][key] = arguments[i][key];
                }
            }
        }
        return arguments[0];
    }

    function whichTransitionEvent() {
        var t;
        var el = document.createElement('tingle-test-transition');
        var transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        };

        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }

    /* ----------------------------------------------------------- */
    /* == return */
    /* ----------------------------------------------------------- */

    return {
        modal: Modal
    };

}));

/* jshint esversion: 6 */
var menu_break = 720;
var carousel = false;
var modal =  false;
var main = function() {
  resize();
  window.addEventListener('resize', resize, false);
  document.getElementById('hamburger').addEventListener('click', function(e) {
    zobraz_menu();
  }, false);

  // zruš scrollovací efekt u inputů
  let number_input = document.getElementsByTagName('number');
  if( number_input.length ) {
    number_input.addEventListener("mousewheel", function(e){
      e.preventDefault();
    });
  }

  /*
  var banner_link = document.querySelector('.banner-link');
  if(banner_link) {
    banner_link.addEventListener('click', function(e) {
      e.preventDefault();
    }, false);
  }
  */

  let hlidacipes_button = document.querySelectorAll('.hlidacipes-js');
  if( hlidacipes_button ) {
    forEach(hlidacipes_button, function (index, element) {
      element.addEventListener('click', function(e) {
        e.preventDefault();
        modal.setContent(document.querySelector('#kontaktujte-nas').innerHTML);
        modal.open();
      }, false);
    });
  }
  forEach(document.forms, function (index, form) {
    Validation.init(form, true);
  });

  let nabidkaform_button = document.querySelectorAll('.majitel-form-js, .main-vlozit-nabidku .nabidka-wrap');
  if( nabidkaform_button ) {
    forEach(nabidkaform_button, function (index, element) {
      element.addEventListener('click', function(e) {
        e.preventDefault();
        modal.setContent(document.querySelector('#majitel-form').innerHTML);
        modal.open();
      }, false);
    });
  }
  forEach(document.forms, function (index, form) {
    Validation.init(form, true);
  });

  modal = new tingle.modal({
      footer: false,
      stickyFooter: false,
      closeMethods: ['overlay', 'button', 'escape'],
      closeLabel: "Zavřít",
      cssClass: ['custom-class-1', 'custom-class-2'],
      onOpen: function() {
          Validation.init(document.querySelector('#form-modal'), true);
          document.querySelector('.tingle-modal-box .form-modal').focus();
      },
      onClose: function() {

      },
      beforeClose: function() {
        // here's goes some logic
        // e.g. save content before closing the modal
        return true; // close the modal
      	return false; // nothing happens
      }
  });


  form_vlozit_aukci();

  if( document.getElementById('carousel') ) {
    carousel = new myCarousel();
    carousel.init({
      id: 'carousel',
      slidenav: false,
      animate: false,
      startAnimated: false
    });
  }

  if ( is_touch_device() ) {
    addClass(document.body, 'touch');
  }

  var carousel_thumb = document.querySelectorAll('.detail-obrazky-link');
  if(carousel_thumb.length) {
    forEach(carousel_thumb, function (index, thumb) {
      thumb.addEventListener('click', function(e) {
        e.preventDefault();
        var carousel_el = document.querySelector('#carousel');
        if( hasClass(carousel_el, 'skryt') ) {
          removeClass(document.querySelector('#carousel'), 'skryt');
          carousel_el.setAttribute('aria-hidden', 'false');
          document.querySelector('#mapa').setAttribute('aria-hidden', 'true');
        }
        carousel.goto(parseInt(this.getAttribute('data-index')));
      }, false);
    });
  }

  let ikona_mapa = document.getElementById('ikona-mapa');
  if( ikona_mapa ) {
    ikona_mapa.addEventListener('click', function(e) {
      e.preventDefault();
      addClass(document.querySelector('#carousel'), 'skryt');
      removeClass(document.querySelector('#mapa'), 'skryt');
      document.querySelector('#carousel').setAttribute('aria-hidden', 'true');
      document.querySelector('#mapa').setAttribute('aria-hidden', 'false');
    }, false);
  }

  let ikona_fotky = document.getElementById('ikona-fotky');
  if( ikona_fotky ) {
    ikona_fotky.addEventListener('click', function(e) {
      e.preventDefault();
      removeClass(document.querySelector('#carousel'), 'skryt');
      addClass(document.querySelector('#mapa'), 'skryt');
      document.querySelector('#carousel').setAttribute('aria-hidden', 'false');
      document.querySelector('#mapa').setAttribute('aria-hidden', 'true');
    }, false);
  }

  let hodnoceni_button = document.querySelector('.detail-hodnoceni-button');
  if( hodnoceni_button ) {
    hodnoceni_button.addEventListener('click', function(e) {
      e.preventDefault();
      modal.setContent(document.querySelector('#kontaktujte-nas').innerHTML);
      modal.open();
    }, false);
  }

  let myTooltip = Frtooltip({
  	selector: '.js-tooltip',
  	tooltipSelector: '.js-tooltip-tooltip',
  	toggleSelector: '.js-tooltip-toggle',
  	tooltipIdPrefix: 'tooltip',
  	readyClass: 'tooltip--is-ready'
  });

  var nacti_dalsi = document.querySelectorAll('.nacti-dalsi');
  if(nacti_dalsi.length) {
    forEach(nacti_dalsi, function (index, thumb) {
      thumb.addEventListener('click', function(e) {
        e.preventDefault();
        let params = '';
        params += 'akce=nacti_produkty';
        params += '&stav='+this.dataset.stav;
        params += '&typ='+this.dataset.typ;
        params += '&strana='+this.dataset.strana;
        params += '&lokalita='+this.dataset.lokalita;
        params += '&pocet=6';
        // roztočit spiner
        addClass(this.parentNode, 'roztocto');
        nacti_produkty(params, this);
      }, false);
    });
  }
};

if (document.readyState != 'loading'){
  main();
} else {
  document.addEventListener('DOMContentLoaded', main);
}


function resize() {
  zobraz_hamburger();
  // todo: najít lepší řešení an skrytí
  let detail_info_leva = document.getElementById('detail-info-leva');
  if( detail_info_leva ) {
    if( window.innerWidth < menu_break ) {
      detail_info_leva.setAttribute('aria-hidden', 'true');
      document.getElementById('detail-info-prava').setAttribute('aria-hidden', 'false');
    } else {
      detail_info_leva.setAttribute('aria-hidden', 'false');
      document.getElementById('detail-info-prava').setAttribute('aria-hidden', 'true');

    }
  }
}

function zobraz_menu() {
  if( hasClass(document.getElementById('header'), 'menu-zobrazeno') ) {
    removeClass(document.getElementById('header'), 'menu-zobrazeno');
    document.getElementById('menu').setAttribute('aria-hidden', 'true');
  } else {
    addClass(document.getElementById('header'), 'menu-zobrazeno');
    document.getElementById('menu').setAttribute('aria-hidden', 'false');
  }
}

function zobraz_hamburger() {
  removeClass(document.getElementById('header'), 'menu-zobrazeno'); // pro jistotu smažu class
  if( window.innerWidth < 780 ) {
    document.getElementById('hamburger').setAttribute('aria-hidden', 'false');
    document.getElementById('menu').setAttribute('aria-hidden', 'true');
  } else {
    document.getElementById('hamburger').setAttribute('aria-hidden', 'true');
    document.getElementById('menu').setAttribute('aria-hidden', 'false');
  }
}

function form_vlozit_aukci() {

  let kroky_button = document.querySelectorAll('.kroky .kroky-button');
  if(kroky_button.length) {
    forEach(kroky_button, function (index, krok_button) {
      krok_button.addEventListener('click', function(e) {
        e.preventDefault();
        if( hasClass(e.target, 'hotovo') ) {
          window.location.href = e.target.dataset.href;
        }

      }, false);
    });
  }

  let modely = document.querySelectorAll('.model .radio');
  if(modely.length) {
    oznac_model();
    forEach(modely, function (index, model) {
      model.addEventListener('change', function(e) {
        oznac_model();
      }, false);
    });
    let modely_spodek = document.querySelectorAll('.model-bot');
    if(modely_spodek.length) {
      forEach(modely_spodek, function (index, model) {
        model.addEventListener('click', function(e) {
          let radio = this.parentNode.parentNode.querySelector('.radio');
          if (radio && !radio.checked) {
            radio.checked = true;
            oznac_model();
          }
        }, false);
      });
    }
  }
  /*
  document.getElementById('krokJedna').addEventListener('submit', function(e) {
    e.preventDefault();
  }, false);
  */
}

function oznac_model() {
  forEach(document.querySelectorAll('.model'), function (index, model) {
    if( model.querySelector('.radio').checked ) {
      addClass(model, 'oznaceny');
    } else {
      removeClass(model, 'oznaceny');
    }
    let input = model.querySelector('.form-text-input');
    if( typeof input !== 'undefined' && input ) {
      if( model.querySelector('.radio').checked ) {
        input.setAttribute('required', 'required');
      } else {
        input.removeAttribute('required');
      }
    }
  });
}

function nacti_produkty(params, button) {
  let request = new XMLHttpRequest();
  request.open('GET', '/ajax?'+params, true);
  request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

  request.onload = function() {
    var resp = request.responseText;
    var error = false;
    var data = false;
    try {
      data = JSON.parse(request.responseText);
    }
    catch(err) {
      error = true;
    }

    if (request.status >= 200 && request.status < 400 && data) {
      if( typeof data.html !== 'undefined' && typeof data.strana !== 'undefined' ) {
        // vypsat produkty do formuláře
        button.setAttribute('data-strana', data.strana);
        let tab = button.parentNode.parentNode;
        appendHtml(tab.querySelector('.row'), data.html);

        if( data.posledni ) {
          // todo: přidat hezčí efekt
          button.parentNode.style.display = 'none';
        } else {
          removeClass(button.parentNode, 'roztocto');
        }
      } else {
        error = true;
      }
    }

    if( error ) {
      // todo: bude vhodné nějak lépe vypsat error
      if( typeof data.error !== 'undefined' ) {
        alert( data.error );
      } else {
        alert('Nastal problém při načítání požadavku.');
      }
    }
  };

  request.onerror = function() {
    alert('Nastal problém při načítání požadavku.');
  };

  request.send();
}


function kontakt_ajax(form) {
  let request = new XMLHttpRequest();
  request.open('POST', '/kontakty?ajax=1', true);
  request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

  request.onload = function() {
    var resp = request.responseText;
    var error = false;
    var data = false;
    try {
      data = JSON.parse(request.responseText);
    }
    catch(err) {
      error = true;
    }

    if (request.status >= 200 && request.status < 400 && !error) {
      if( typeof data.message !== 'undefined' ) {
        let zprava = document.querySelector('.zprava-uspech');
        zprava.innerHTML = data.message;
        zprava.style.display = 'block';
        document.getElementById('form-modal').style.display = 'none';
      } else {
        error = true;
      }
    }

    if(error) {
      // todo: bude vhodné nějak lépe vypsat error
      if( typeof data.error !== 'undefined' ) {
        alert( data.error );
      } else {
        alert('Nastal problém při ukládání formuláře.');
      }
    }
  };

  request.onerror = function() {
    alert('Nastal problém při ukládání formuláře.');
  };

  request.send(serialize(form));
}

/*
var form_ajax = function (form) {
  //var data = new FormData(form);
  var request = new XMLHttpRequest();
  request.open('POST', '/vlozit-aukci/formular?ajax=1', true);
  request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

  request.onload = function() {
    var resp = request.responseText;
    if (request.status >= 200 && request.status < 400) {
      // Úspěch!

    } else {
      // todo: bude vhodné nějak lépe vypsat error
      var data = JSON.parse(request.responseText);
      if( typeof data.error !== 'undefined' ) {
        alert( data.error );
      } else {
        alert('Nastal problém při ukládání formuláře.');
      }
    }
  };

  request.onerror = function() {
    alert('Nastal problém při ukládání formuláře.');
  };

  request.send(serialize(form));
}
*/

/* https://codepen.io/BeyondHyper/pen/xZXXzj */
document.addEventListener("DOMContentLoaded",
  function() {
    var tabWidget = [].slice.call(document.querySelectorAll('.tabs')) || [];

    var tabClickEvent = function(tabLink, tabLinks, tabPanels, linkIndex, e) {

      // Reset all the tablinks
      tabLinks.forEach(function(link) {
        link.setAttribute('tabindex', '-1');
        link.setAttribute('aria-selected', 'false');
        //link.removeAttribute('data-tab-active');
        //link.parentNode.removeAttribute('data-tab-active');
        removeClass(link.parentNode, 'active');
      });

      // set the active link attributes
      tabLink.setAttribute('tabindex', '0');
      tabLink.setAttribute('aria-selected', 'true');
      //tabLink.setAttribute('data-tab-active', '');
      //tabLink.parentNode.setAttribute('data-tab-active', '');
      addClass(tabLink.parentNode, 'active');

      // Change tab panel visibility
      tabPanels.forEach(function(panel, index) {
        if (index != linkIndex) {
          panel.setAttribute('aria-hidden', 'true');
          //panel.removeAttribute('data-tab-active');
        } else {
          panel.setAttribute('aria-hidden', 'false');
          //panel.setAttribute('data-tab-active', '');
        }
      });
    };

    var keyboardEvent = function(tabLink, tabLinks, tabPanels, tabItems, index, e) {
      var keyCode = e.key || e.which, // which property is deprecated, e.key is not fully supported
          currentTab = tabLinks[index],
          previousTab = tabLinks[index - 1],
          nextTab = tabLinks[index + 1],
          firstTab = tabLinks[0],
          lastTab = tabLinks[tabLinks.length - 1];

      // ArrowRight and ArrowLeft are the values when event.key is supported
      switch (keyCode) {
        case 'ArrowLeft':
        case 37:
          e.preventDefault();

          if (!previousTab) {
            lastTab.focus();
          } else {
            previousTab.focus();
          }
        break;

        case 'ArrowRight':
        case 39:
          e.preventDefault();

          if (!nextTab) {
              firstTab.focus();
            } else {
              nextTab.focus();
            }
          break;
      }
    };

    // set up tab widgets
    tabWidget.forEach(function(tabWidgetInstance, i) {
      var tabList = tabWidgetInstance.getElementsByTagName('ul')[0],
          tabItems = [].slice.call(tabList.getElementsByTagName('li')),
          tabLinks = [],
          tabPanels = [].slice.call(tabWidgetInstance.querySelectorAll('.tab-panel'));

      // Add accessibility roles and labels
      tabList.setAttribute('role','tablist');
      tabItems.forEach(function(item, index) {
        var link = item.getElementsByTagName('a')[0];

        tabLinks.push(link);
        //item.setAttribute('role', 'presentation');

        if (index == 0) {
          //item.setAttribute('data-tab-active', '');
        }
      });

      tabLinks.forEach(function(link, i) {
        var anchor = link.getAttribute('href').split('#')[1];
        var attributes = {
          'id': 'tab-link-' + i,
          'role': 'tab',
          'tabIndex': '-1',
          'aria-selected': 'false',
          'aria-controls': anchor
        };

        // if it's the first element update the attributes
        if (i == 0) {
          attributes['aria-selected'] = 'true';
          attributes.tabIndex = '0';
          //link.setAttribute('data-tab-active', '');
        };

        // Add the various accessibility roles and labels to the links
        for (var key in attributes) {
          link.setAttribute(key, attributes[key]);
         }

        // Add next section link

        // Click Event Listener
        link.addEventListener('click', function(e) {
          e.preventDefault();
        });

        // Click Event Listener
        link.addEventListener('focus', function(e) {
          tabClickEvent(this, tabLinks, tabPanels, i, e);
        });

         // Keyboard event listener
        link.addEventListener('keydown', function(e) {
          keyboardEvent(link, tabLinks, tabPanels, tabItems, i, e);
        });

        // otevři tab který má Hash v URL
        if( window.location.hash.length && link.getAttribute('href') == window.location.hash && link.getAttribute('aria-selected') == 'false' ) {
          tabClickEvent(link, tabLinks, tabPanels, i);
        }

      });

      // set up tab panels
      tabPanels.forEach(function(panel, i) {
        var nextTabLink = document.createElement('a'),
            nextTabLinkIndex = (i < tabPanels.length - 1) ? i+1 : 0;

        var attributes = {
          'role': 'tabpanel',
          'aria-hidden': 'true',
          'aria-labelledby': 'tab-link-' + i
        };

        // set up next tab link
        /*
        nextTabLink.setAttribute('href', '#tab-link-' + nextTabLinkIndex);
        nextTabLink.textContent = 'Next Tab';
        panel.appendChild(nextTabLink);
        */
        if (i == 0) {
          attributes['aria-hidden'] = 'false';
          //panel.setAttribute('data-tab-active', '');
        }

        for (var key in attributes) {
          panel.setAttribute(key, attributes[key]);
        }
      });
    });
  }
);

(function() {

     'use strict';

    // Feature Test
    if ( 'querySelector' in document && 'addEventListener' in window && Array.prototype.forEach ) {

        // Function to animate the scroll
        var smoothScroll = function (anchor, duration, hash) {

            // Calculate how far and how fast to scroll
            var startLocation = window.pageYOffset;
            var endLocation = anchor.offsetTop;
            var distance = endLocation - startLocation;
            var increments = distance/(duration/16);
            var stopAnimation;
            var set_hash = hash;

            // Scroll the page by an increment, and check if it's time to stop
            var animateScroll = function (hash) {
                window.scrollBy(0, increments);
                stopAnimation();
            };

            // If scrolling down
            if ( increments >= 0 ) {
                // Stop animation when you reach the anchor OR the bottom of the page
                stopAnimation = function () {
                    var travelled = window.pageYOffset;
                    if ( (travelled >= (endLocation - increments)) || ((window.innerHeight + travelled) >= document.body.offsetHeight) ) {
                        clearInterval(runAnimation);
                        window.location.hash = set_hash;
                    }
                };
            }
            // If scrolling up
            else {
                // Stop animation when you reach the anchor OR the top of the page
                stopAnimation = function () {
                    var travelled = window.pageYOffset;
                    if ( travelled <= (endLocation || 0) ) {
                        clearInterval(runAnimation);
                        window.location.hash = set_hash;
                    }
                };
            }

            // Loop the animation function
            var runAnimation = setInterval(animateScroll, 16);

        };

        // Define smooth scroll links
        var scrollToggle = document.querySelectorAll('.scroll');

        // For each smooth scroll link
        [].forEach.call(scrollToggle, function (toggle) {

            // When the smooth scroll link is clicked
            toggle.addEventListener('click', function(e) {

                // Prevent the default link behavior
                e.preventDefault();

                // Get anchor link and calculate distance from the top
                var dataID = toggle.getAttribute('href');
                var dataTarget = document.querySelector(dataID);
                var dataSpeed = toggle.getAttribute('data-speed');

                // If the anchor exists
                if (dataTarget) {
                    // Scroll to the anchor
                    smoothScroll(dataTarget, dataSpeed || 500, dataID);
                }

            }, false);

        });

    }

 })();

