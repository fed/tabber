define('tabber', ['lodash/debounce', 'animate'], (debounce, animate) => {
  const DEFAULTS = {
    arrowWidth: 14,
    tabSlideSpeed: 250
  };

  // Animation effects
  const {show, hide} = animate;

  function Tabber(element, options = {}) {
    // Settings
    this.settings = Object.assign({}, DEFAULTS, options);

    // Local state
    this.animationInProgress = false;

    // Selectors
    this.control = element.querySelector('.tabber-control');
    this.tabsWrapper = this.control.querySelector('ul');
    this.tabs = this.tabsWrapper.querySelectorAll('a');
    this.leftArrow = this.control.querySelector('.left-arrow');
    this.rightArrow = this.control.querySelector('.right-arrow');
    this.content = element.querySelector('.tabber-content');

    // Event Binding
    this.leftArrow.addEventListener('click', this.scrollLeft.bind(this));
    this.rightArrow.addEventListener('click', this.scrollRight.bind(this));
    this.tabs.forEach(() => {
      addEventListener('click', this.selectTab.bind(this));
    });

    // Initialise agent
    this.init();
  }

  Tabber.prototype = {
    init() {
      Array
        .from(this.content.children)
        .forEach(panel => this.hidePanel(panel));
      this.showPanel(this.content.firstElementChild); // fadeIn
      this.tabsWrapper.firstElementChild.classList.add('selected');
      this.updateControls();
      this.responsify();
    },

    responsify() {
      window.addEventListener('resize', debounce(this.updateControls.bind(this), 300));
    },

    animateScrolling(direction, length) {
      this.animationInProgress = true;

      const currentMargin = Number.parseInt(getComputedStyle(this.tabsWrapper)['margin-left']);
      let nextMargin;

      switch (direction) {
        case 'right':
          nextMargin = currentMargin + length;
          break;
        case 'left':
          nextMargin = currentMargin - length;
          break;
      }

      const keyframes = [
        { marginLeft: `${currentMargin}px` }, // 0%
        { marginLeft: `${nextMargin}px` } // 100%
      ];
      const options = {
        duration: this.settings.tabSlideSpeed
      };
      const animation = this.tabsWrapper.animate(keyframes, options);

      animation.onfinish = () => {
        this.animationInProgress = false;

        // @TODO: don't wanna need to do this
        // but marginLeft is going back to its original state once
        // the animation is over. Not sure why though.
        this.tabsWrapper.style.marginLeft = `${nextMargin}px`;

        this.updateControls();
      };
    },

    scrollLeft(event) {
      event.preventDefault();
      event.stopPropagation();

      if (this.animationInProgress) {
        return;
      }

      const tabsOffLeftEdge = Array
        .from(this.tabs)
        .reverse()
        .filter(item => this.isOffLeftEdge(item));
      const item = tabsOffLeftEdge[0];
      const howMuchToScroll = this.getDistanceToLeftEdge(item);

      if (this.isFirstTab(item)) {
        this.disableLeftControl();
      }

      this.animateScrolling('left', howMuchToScroll);
    },

    // @TODO: practically the same as scrollRight, probably reuse some code
    scrollRight(event) {
      event.preventDefault();
      event.stopPropagation();

      if (!this.animationInProgress) {
        const tabsOffRightEdge = Array
          .from(this.tabs)
          .filter(item => this.isOffRightEdge(item));
        const item = tabsOffRightEdge[0];
        const howMuchToScroll = this.getDistanceToRightEdge(item);

        if (this.isLastTab(item)) {
          this.disableRightControl();
        }

        this.animateScrolling('right', howMuchToScroll);
      }
    },

    isOffLeftEdge(tab) {
      return tab.offsetLeft < 0;
    },

    isOffRightEdge(tab) {
      const tabRightEdge = tab.offsetLeft + tab.offsetWidth;
      const containerRightEdge = this.control.offsetLeft + this.control.offsetWidth;

      return tabRightEdge > containerRightEdge;
    },

    isFirstTab(tab) {
      return tab === this.tabsWrapper.firstElementChild;
    },

    isLastTab(tab) {
      return tab === this.tabsWrapper.lastElementChild;
    },

    getDistanceToRightEdge(tab) {
      const tabRightEdge = tab.offsetLeft + tab.offsetWidth;
      const containerRightEdge = this.control.offsetWidth;

      if (this.isOffRightEdge(tab) && !this.isLastTab(tab)) {
        return Number.parseInt(containerRightEdge - tabRightEdge - this.settings.arrowWidth);
      } else {
        return Number.parseInt(containerRightEdge - tabRightEdge);
      }
    },

    getDistanceToLeftEdge(tab) {
      if (this.isOffLeftEdge(tab) && !this.isFirstTab(tab)) {
        return Number.parseInt(tab.offsetLeft - this.settings.arrowWidth);
      } else {
        return tab.offsetLeft;
      }
    },

    enableLeftControl() {
      show(this.leftArrow, 'inline-block'); // @TODO: fadeIn
      this.control.classList.remove('no-fade-left');
    },

    disableLeftControl() {
      hide(this.leftArrow); // @TODO: fadeOut
      this.control.classList.add('no-fade-left');
    },

    enableRightControl() {
      show(this.rightArrow, 'inline-block'); // @TODO: fadeIn
      this.control.classList.remove('no-fade-right');
    },

    disableRightControl() {
      hide(this.rightArrow); // @TODO: fadeOut
      this.control.classList.add('no-fade-right');
    },

    updateControls() {
      let showLeftArrow = false;
      let showRightArrow = false;

      this.tabs.forEach(item => {
        if (this.isOffLeftEdge(item)) {
          showLeftArrow = true;
        } else if (this.isOffRightEdge(item)) {
          showRightArrow = true;
        }
      });

      showLeftArrow ? this.enableLeftControl() : this.disableLeftControl();
      showRightArrow ? this.enableRightControl() : this.disableRightControl();
    },

    getSelectedTab() {
      return this.tabsWrapper.querySelector('li.selected');
    },

    hidePanel(panel) {
      hide(panel); // fadeOut
    },

    showPanel(panel) {
      show(panel); // fadeIn
    },

    selectTab(event) {
      event.preventDefault();

      const tab = event.target;
      const tabId = tab.dataset.tabId;
      const alreadySelected = tabId === this.getSelectedTab().firstElementChild.dataset.tabId;

      if (!alreadySelected) {
        this.getSelectedTab().classList.remove('selected');
        tab.parentNode.classList.add('selected');
        this.updateContent(tabId);

        // Bring partially visible tabs into screen when clicked
        if (this.isOffLeftEdge(tab)) {
          this.scrollLeft(event); // @TODO: refactor so that i don't need to pass in an event
        } else if (this.isOffRightEdge(tab)) {
          this.scrollRight(event);
        }
      }
    },

    updateContent(tabId) {
      const targetPanel = this.content.querySelector(`[data-content-id="${tabId}"]`);

      // @TODO: probably don't hide all panels, only the hidden ones
      Array.from(this.content.children).forEach(panel => this.hidePanel(panel));
      this.showPanel(targetPanel);
    }
  };

  return Tabber;
});
