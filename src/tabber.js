define('tabber', ['lodash/debounce'], debounce => {
  const DEFAULTS = {
    arrowWidth: 14,
    tabSlideSpeed: 250,
    leftArrowSelector: '.tabber__arrow--left',
    rightArrowSelector: '.tabber__arrow--right',
    navigationSelector: 'nav',
    listSelector: 'ul',
    tabsSelector: '.tabber__link',
    selectedTabClassName: 'tabber__link--selected',
    contentPanelsSelector: '[data-tabber-content]'
  };

  // Animation effects
  function show(element, display) {
    element.style.display = display || 'block';
  }

  function hide(element) {
    element.style.display = 'none';
  }

  // Module definition
  function Tabber(element, options = {}) {
    // Settings
    this.settings = Object.assign({}, DEFAULTS, options);

    // Local state
    this.animationInProgress = false;

    // Selectors
    this.instance = element;
    this.navigation = this.instance.querySelector(this.settings.navigationSelector);
    this.list = this.navigation.querySelector(this.settings.listSelector);
    this.tabs = this.list.querySelectorAll(this.settings.tabsSelector);
    this.leftArrow = this.navigation.querySelector(this.settings.leftArrowSelector);
    this.rightArrow = this.navigation.querySelector(this.settings.rightArrowSelector);
    this.contentPanels = this.instance.querySelectorAll(this.settings.contentPanelsSelector);

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
      const firstTab = this.tabs[0];
      const firstPanel = this.contentPanels[0];

      // Start off hiding all panels but the first one
      this.contentPanels.forEach(panel => this.hidePanel(panel));
      this.showPanel(firstPanel);

      // Start off with the first tab selected
      firstTab.classList.add(this.settings.selectedTabClassName);

      // Set up arrows and attach window.resize event handler
      this.updateControls();
      this.responsify();
    },

    /*
     * REDRAW NAVBAR ON WINDOW RESIZE OR DEVICE ROTATION
     */

    responsify() {
      window.addEventListener('resize', debounce(this.updateControls.bind(this), 300));
    },

    /*
     * TAB MANAGEMENT
     */

    getSelectedTab() {
      return Array
        .from(this.tabs)
        .filter(tab => tab.classList.contains(this.settings.selectedTabClassName))
        .reduce((acc, current) => current);
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
      const containerRightEdge = this.instance.offsetLeft + this.instance.offsetWidth;

      return tabRightEdge > containerRightEdge;
    },

    isFirstTab(tab) {
      return tab === this.tabs[0];
    },

    isLastTab(tab) {
      return tab === this.tabs[this.tabs.length - 1];
    },

    getDistanceToRightEdge(tab) {
      const tabRightEdge = tab.offsetLeft + tab.offsetWidth;
      const containerRightEdge = this.instance.offsetWidth;

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

    scrollToTab(tab, direction) {
      if (this.animationInProgress) {
        return;
      }

      let howMuchToScroll = 0;

      if (direction === 'left') {
        howMuchToScroll = this.getDistanceToLeftEdge(tab);

        if (this.isFirstTab(tab)) {
          this.disableLeftControl();
        }
      } else if (direction === 'right') {
        howMuchToScroll = this.getDistanceToRightEdge(tab);

        if (this.isLastTab(tab)) {
          this.disableRightControl();
        }
      }

      this.animateScrolling(direction, howMuchToScroll);
    },

    /*
     * CONTENT PANEL MANAGEMENT
     */

    hidePanel(panel) {
      hide(panel);
    },

    showPanel(panel) {
      show(panel);
    },

    updateContent(tabId) {
      const targetPanel = Array
        .from(this.contentPanels)
        .filter(panel => panel.dataset.tabberContent === tabId)
        .reduce((acc, current) => current);

      // @TODO: probably don't hide all panels, only the hidden ones
      this.contentPanels.forEach(panel => this.hidePanel(panel));
      this.showPanel(targetPanel);
    },

    /*
     * ARROWS
     */

    insertArrows() {

    },

    enableLeftControl() {
      show(this.leftArrow, 'inline-block');
      this.navigation.classList.remove('tabber--no-fade-left');
    },

    disableLeftControl() {
      hide(this.leftArrow);
      this.navigation.classList.add('tabber--no-fade-left');
    },

    enableRightControl() {
      show(this.rightArrow, 'inline-block');
      this.navigation.classList.remove('tabber--no-fade-right');
    },

    disableRightControl() {
      hide(this.rightArrow);
      this.navigation.classList.add('tabber--no-fade-right');
    },

    handleClickLeftArrow(event) {
      event.preventDefault();
      event.stopPropagation();

      const tabsOffLeftEdge = Array
        .from(this.tabs)
        .reverse()
        .filter(item => this.isOffLeftEdge(item));
      const firstTabOffLeftEdge = tabsOffLeftEdge[0];

      this.scrollToTab(firstTabOffLeftEdge, 'left');
    },

    handleClickRightArrow(event) {
      event.preventDefault();
      event.stopPropagation();

      const tabsOffRightEdge = Array
        .from(this.tabs)
        .filter(item => this.isOffRightEdge(item));
      const firstTabOffRightEdge = tabsOffRightEdge[0];

      this.scrollToTab(firstTabOffRightEdge, 'right');
    },

    /*
     * TAB CLICKING AND CONTENT MANAGEMENT
     */

    selectTab(event) {
      event.preventDefault();
      event.stopPropagation();

      const tab = event.target;
      const tabId = tab.dataset.tabberTab;
      const alreadySelected = tab === this.getSelectedTab();

      if (alreadySelected) {
        return;
      }

      this.getSelectedTab().classList.remove(this.settings.selectedTabClassName);
      tab.classList.add(this.settings.selectedTabClassName);
      this.updateContent(tabId);

      // Bring partially visible tabs into screen when clicked
      if (this.isOffLeftEdge(tab)) {
        this.scrollToTab(tab, 'left');
      } else if (this.isOffRightEdge(tab)) {
        this.scrollToTab(tab, 'right');
      }
    },

    /*
     * SCROLLING
     */

    animateScrolling(direction, length) {
      this.animationInProgress = true;

      const currentMargin = Number.parseInt(getComputedStyle(this.list)['margin-left']);
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
      const animation = this.list.animate(keyframes, options);

      animation.onfinish = () => {
        this.animationInProgress = false;

        // @TODO: don't wanna need to do this
        // but marginLeft is going back to its original state once
        // the animation is over. Not sure why though.
        this.list.style.marginLeft = `${nextMargin}px`;

        this.updateControls();
      };
    }
  };

  return Tabber;
});
