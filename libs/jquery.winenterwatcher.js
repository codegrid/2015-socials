/*! jQuery.WinEnterWatcher (https://github.com/Takazudo/jQuery.WinEnterWatcher)
 * lastupdate: 2014-12-12
 * version: 0.1.0
 * author: 'Takazudo' Takeshi Takatsudo <takazudo@gmail.com>
 * License: MIT */
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($) {
    var $win, EveEve, ns;
    EveEve = window.EveEve;
    $win = $(window);
    ns = {};
    ns.limit = function(func, wait, debounce) {
      var timeout;
      timeout = null;
      return function() {
        var args, context, throttler;
        context = this;
        args = arguments;
        throttler = function() {
          timeout = null;
          return func.apply(context, args);
        };
        if (debounce) {
          clearTimeout(timeout);
        }
        if (debounce || !timeout) {
          return timeout = setTimeout(throttler, wait);
        }
      };
    };
    ns.throttle = function(func, wait) {
      return ns.limit(func, wait, false);
    };
    ns.debounce = function(func, wait) {
      return ns.limit(func, wait, true);
    };
    ns.isAboveTheWindow = function($el, options) {
      var defaults, o;
      defaults = {
        threshold: 0
      };
      if ($el.length > 1) {
        $.error("2 or more elements were thrown.");
        return false;
      }
      o = $.extend({}, defaults, options);
      return $win.scrollTop() >= $el.offset().top + o.threshold + $el.innerHeight();
    };
    ns.isBelowTheWindow = function($el, options) {
      var defaults, o;
      defaults = {
        threshold: 0
      };
      if ($el.size() > 1) {
        $.error("2 or more elements were thrown.");
        return false;
      }
      o = $.extend({}, defaults, options);
      return $win.height() + $win.scrollTop() <= $el.offset().top - o.threshold;
    };
    ns.isInWindow = function($el) {
      return !(ns.isAboveTheWindow($el)) && !(ns.isBelowTheWindow($el));
    };
    ns.WinWatcher = (function(_super) {
      var eventNames;

      __extends(WinWatcher, _super);

      eventNames = 'resize scroll orientationchange';

      function WinWatcher() {
        var _this = this;
        $win.bind(eventNames, function() {
          return _this.trigger('resize');
        });
      }

      return WinWatcher;

    })(EveEve);
    ns.winWatcher = new ns.WinWatcher;
    ns.Watcher = (function(_super) {

      __extends(Watcher, _super);

      Watcher.defaults = {
        threshold: 0,
        throttle_millisec: 200,
        process_above_window: false
      };

      function Watcher(el, options) {
        this.el = el;
        this.$el = $(this.el);
        this.done = false;
        this.options = $.extend({}, ns.Watcher.defaults, options);
      }

      Watcher.prototype.start = function() {
        this._watchResize();
        return this.check();
      };

      Watcher.prototype.check = function() {
        if (this.done) {
          return;
        }
        if (this.options.process_above_window && ns.isAboveTheWindow(this.$el)) {
          this._handleElEnter();
          return;
        }
        if (ns.isInWindow(this.$el)) {
          return this._handleElEnter();
        }
      };

      Watcher.prototype.destroy = function() {
        return this._unwatchResize();
      };

      Watcher.prototype._handleElEnter = function() {
        var data;
        this.done = true;
        data = {
          watcher: this,
          el: this.$el
        };
        this.trigger('enter', data);
        return this._unwatchResize();
      };

      Watcher.prototype._watchResize = function() {
        var _this = this;
        this._resizeHandler = ns.throttle((function() {
          return _this.check();
        }), this.options.throttle_millisec);
        return ns.winWatcher.on('resize', this._resizeHandler);
      };

      Watcher.prototype._unwatchResize = function() {
        return ns.winWatcher.off('resize', this._resizeHandler);
      };

      return Watcher;

    })(EveEve);
    $.WinEnterWatcherNs = ns;
    return $.WinEnterWatcher = ns.Watcher;
  })(jQuery);

}).call(this);
