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
    this.leftArrow.addEventListener('click', this.handleClickLeftArrow.bind(this));
    this.rightArrow.addEventListener('click', this.handleClickRightArrow.bind(this));
    this.tabs.forEach(tab => {
      // @TODO: event delegation
      tab.addEventListener('click', this.selectTab.bind(this));
    });

    // Initialise agent
    this.init();
  }

  Tabber.prototype = {
    /*
     * AGENT INITIALISATION
     */

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

    /*
     * TAB MANAGEMENT
     */

    getSelectedTab() {
      return this.tabsWrapper.querySelector('li.selected');
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

    scrollLeftTo(tab) {
      if (this.animationInProgress) {
        return;
      }

      const howMuchToScroll = this.getDistanceToLeftEdge(tab);

      if (this.isFirstTab(tab)) {
        this.disableLeftControl();
      }

      this.animateScrolling('left', howMuchToScroll);
    },

    // @TODO: practically the same as scrollRight, probably reuse some code
    scrollRightTo(tab) {
      if (this.animationInProgress) {
        return;
      }

      const howMuchToScroll = this.getDistanceToRightEdge(tab);

      if (this.isLastTab(tab)) {
        this.disableRightControl();
      }

      this.animateScrolling('right', howMuchToScroll);
    },

    /*
     * CONTENT PANEL MANAGEMENT
     */

    hidePanel(panel) {
      hide(panel); // fadeOut
    },

    showPanel(panel) {
      show(panel); // fadeIn
    },

    updateContent(tabId) {
      const targetPanel = this.content.querySelector(`[data-content-id="${tabId}"]`);

      // @TODO: probably don't hide all panels, only the hidden ones
      Array.from(this.content.children).forEach(panel => this.hidePanel(panel));
      this.showPanel(targetPanel);
    },

    /*
     * ARROWS
     */

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

    handleClickLeftArrow(event) {
      event.preventDefault();
      event.stopPropagation();

      const tabsOffLeftEdge = Array
        .from(this.tabs)
        .reverse()
        .filter(item => this.isOffLeftEdge(item));
      const firstTabOffLeftEdge = tabsOffLeftEdge[0];

      this.scrollLeftTo(firstTabOffLeftEdge);
    },

    handleClickRightArrow(event) {
      event.preventDefault();
      event.stopPropagation();

      const tabsOffRightEdge = Array
        .from(this.tabs)
        .filter(item => this.isOffRightEdge(item));
      const firstTabOffRightEdge = tabsOffRightEdge[0];

      this.scrollRightTo(firstTabOffRightEdge);
    },

    /*
     * TAB CLICKING AND CONTENT MANAGEMENT
     */

    selectTab(event) {
      event.preventDefault();
      event.stopPropagation();

      const tab = event.target;
      const tabId = tab.dataset.tabId;
      const alreadySelected = tabId === this.getSelectedTab().firstElementChild.dataset.tabId;

      if (alreadySelected) {
        return;
      }

      this.getSelectedTab().classList.remove('selected');
      tab.parentNode.classList.add('selected');
      this.updateContent(tabId);

      // Bring partially visible tabs into screen when clicked
      if (this.isOffLeftEdge(tab)) {
        this.scrollLeftTo(tab);
      } else if (this.isOffRightEdge(tab)) {
        this.scrollRightTo(tab);
      }
    },

    /*
     * SCROLLING
     */

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
    }
  };

  return Tabber;
});
