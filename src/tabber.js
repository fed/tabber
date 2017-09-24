define('tabber', ['jquery'], function ($) {
  var DEFAULTS = {
    arrowWidth: 14,
    tabSlideSpeed: 600, // speed for tab sliding
    arrowFadeSpeed: 300 // speed for arrow fade in and out
  };

  var Tabber = function ($element, options) {
    // Settings
    this.options = $.extend({}, DEFAULTS, options);

    // $electors
    this.$control = $element.find('.tabber-control');
    this.$tabs = this.$control.find('ul');
    this.$items = this.$tabs.find('a');
    this.$leftArrow = this.$control.find('.left-arrow');
    this.$rightArrow = this.$control.find('.right-arrow');
    this.$panels = $element.find('.tabber-content');

    // Event Binding
    this.$leftArrow.on('click', $.proxy(this.scrollLeft, this));
    this.$rightArrow.on('click', $.proxy(this.scrollRight, this));
    this.$items.on('click', $.proxy(this.selectTab, this));

    // Agent Initialization
    this.$panels.children().hide().first().fadeIn();
    this.$tabs.children().first().addClass('selected');
    this.updateControls();
    this.responsify();
  };

  Tabber.prototype = {
    responsify: function () {
      $(window).on('resize', $.proxy(this.updateControls, this));
    },

    animateScrolling: function (direction, length) {
      this.animationInProgress = true;

      var margin = parseInt(this.$tabs.css('margin-left')),
          self = this;

      switch (direction) {
        case 'right':
          margin += length;
          break;
        case 'left':
          margin -= length;
          break;
      }

      this.$tabs
        .animate({ 'margin-left': margin }, this.options.tabSlideSpeed)
        .promise()
        .done(function () {
          self.animationInProgress = false;
          self.updateControls();
        });
    },

    scrollLeft: function (event) {
      event.preventDefault();

      var self = this,
          howMuchToScroll;

      if (!this.animationInProgress) {
        $.each($(this.$items.get().reverse()), function() {
          var $this = $(this);
          if (self.isOffLeftEdge($this)) {
            howMuchToScroll = self.getDistanceToLeftEdge($this);
            if (self.isFirstTab($this)) {
              self.disableLeftControl();
            }
            return false;
          }
        });

        this.animateScrolling('left', howMuchToScroll);
      }
    },

    scrollRight: function (event) {
      event.preventDefault();

      var self = this,
          howMuchToScroll;

      if (!this.animationInProgress) {
        $.each(this.$items, function () {
          var $this = $(this);
          if (self.isOffRightEdge($this)) {
            howMuchToScroll = self.getDistanceToRightEdge($this);
            if (self.isLastTab($this)) {
              self.disableRightControl();
            }
            return false;
          }
        });
        this.animateScrolling('right', howMuchToScroll);
      }
    },

    isOffLeftEdge: function ($tab) {
      return $tab.position().left < 0;
    },

    isOffRightEdge: function ($tab) {
      var tabRightEdge = $tab.position().left + $tab.outerWidth(),
          containerRightEdge = this.$control.position().left + this.$control.outerWidth();
      return tabRightEdge > containerRightEdge;
    },

    isFirstTab: function ($tab) {
      return $tab.is(this.$items.first());
    },

    isLastTab: function ($tab) {
      return $tab.is(this.$items.last());
    },

    getDistanceToRightEdge: function ($tab) {
      var tabRightEdge = $tab.position().left + $tab.outerWidth(),
        containerRightEdge = this.$control.outerWidth();

      if (this.isOffRightEdge($tab) && !this.isLastTab($tab)) {
        return parseInt(containerRightEdge - tabRightEdge - this.options.arrowWidth);
      } else {
        return parseInt(containerRightEdge - tabRightEdge);
      }
    },

    getDistanceToLeftEdge: function ($tab) {
      if (this.isOffLeftEdge($tab) && !this.isFirstTab($tab)) {
        return parseInt($tab.position().left - this.options.arrowWidth);
      } else {
        return $tab.position().left;
      }
    },

    enableLeftControl: function () {
      this.$leftArrow.fadeIn(this.options.arrowFadeSpeed);
      this.$control.removeClass('no-fade-left');
    },

    disableLeftControl: function () {
      this.$leftArrow.fadeOut(this.options.arrowFadeSpeed);
      this.$control.addClass('no-fade-left');
    },

    enableRightControl: function () {
      this.$rightArrow.fadeIn(this.options.arrowFadeSpeed);
      this.$control.removeClass('no-fade-right');
    },

    disableRightControl: function () {
      this.$rightArrow.fadeOut(this.options.arrowFadeSpeed);
      this.$control.addClass('no-fade-right');
    },

    updateControls: function() {
      var shouldShowLeftArrow = false,
          shouldShowRightArrow = false,
          self = this;

      $.each(this.$items, function() {
        var $this = $(this);

        if (self.isOffLeftEdge($this)) {
          shouldShowLeftArrow = true;
        } else if (self.isOffRightEdge($this)) {
          shouldShowRightArrow = true;
        }
      });

      if (shouldShowLeftArrow) {
        self.enableLeftControl();
      } else {
        self.disableLeftControl();
      }

      if (shouldShowRightArrow) {
        self.enableRightControl();
      } else {
        self.disableRightControl();
      }
    },

    selectTab: function (event) {
      event.preventDefault();

      var $tab = $(event.currentTarget),
          tabId = $(event.currentTarget).attr('class'),
          alreadySelected = tabId === this.getSelectedTab().find('a').attr('class');

      if (!alreadySelected) {
        this.updateContent(tabId);

        // Bring partially visible tabs into screen when clicked
        if (this.isOffLeftEdge($tab)) {
          this.scrollLeft(event);
        } else if (this.isOffRightEdge($tab)) {
          this.scrollRight(event);
        }
      }
    },

    getSelectedTab: function () {
      return this.$tabs.find('li.selected');
    },

    hidePanel: function ($panel) {
      $panel.hide();
    },

    showPanel: function ($panel) {
      $panel.fadeIn();
    },

    updateContent: function (tabId) {
      var $clicked =  this.$tabs.find('a.' + tabId),
          $targetPanel = this.$panels.children('div.' + tabId);

      this.getSelectedTab().removeClass('selected');
      $clicked.parent().addClass('selected');
      this.hidePanel(this.$panels.children(':visible'));
      this.showPanel($targetPanel);
    }
  };

  return Tabber;
});
