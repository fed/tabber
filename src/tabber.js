define('tabber', ['lodash/debounce', 'animate'], (debounce, animate) => {
  const DEFAULTS = {
    arrowWidth: 14,
    tabSlideSpeed: 600,
    arrowFadeSpeed: 300
  };

  // Animation effects
  const {show, hide} = animate;

  function Tabber(element, options = {}) {
    // Settings
    this.settings = Object.assign({}, DEFAULTS, options);

    // Selectors
    this.control = element.querySelector('.tabber-control'); // div.tabber-control (Wrapper) -> two arrows and a ul
    this.tabs = this.control.querySelector('ul'); // ul (Wrapper)
    this.items = this.tabs.querySelectorAll('a'); // array of <a /> tags
    this.leftArrow = this.control.querySelector('.left-arrow'); // a.left-arrow: HTMLElement
    this.rightArrow = this.control.querySelector('.right-arrow'); // a.right-arrow: HTMLElement
    this.panels = element.querySelector('.tabber-content'); // div.tabber-content (Wrapper)

    // Event Binding
    this.leftArrow.addEventListener('click', this.scrollLeft.bind(this));
    this.rightArrow.addEventListener('click', this.scrollRight.bind(this));
    this.items.forEach(() => addEventListener('click', this.selectTab.bind(this)));

    Array
      .from(this.panels.children)
      .forEach(panel => this.hidePanel(panel));
    this.showPanel(this.panels.firstElementChild); // fadeIn
    this.tabs.firstElementChild.classList.add('selected');
    this.updateControls();
    this.responsify();
  }

  Tabber.prototype = {
    responsify() {
      window.addEventListener('resize', debounce(this.updateControls.bind(this), 300));
    },

    animateScrolling(direction, length) {
      this.animationInProgress = true;

      let margin = Number.parseInt(getComputedStyle(this.tabs)['margin-left']);

      switch (direction) {
        case 'right':
          margin += length;
          break;
        case 'left':
          margin -= length;
          break;
      }

      // @TODO
      const animation = this.tabs.animate(
        { marginLeft: margin },
        { duration: this.settings.tabSlideSpeed }
      );

      animation.onfinish = () => {
        this.animationInProgress = false;
        this.updateControls();
      };
    },

    scrollLeft(event) {
      event.preventDefault();

      let howMuchToScroll = 0;

      if (!this.animationInProgress) {
        Array
          .from(this.items)
          .reverse()
          .filter(item => this.isOffLeftEdge(item))
          .forEach(item => {
            howMuchToScroll = this.getDistanceToLeftEdge(item);

            if (this.isFirstTab(item)) {
              this.disableLeftControl();
            }
          });

        this.animateScrolling('left', howMuchToScroll);
      }
    },

    // @TODO: practically the same as scrollRight, probably reuse some code
    scrollRight(event) {
      event.preventDefault();

      let howMuchToScroll = 0;

      if (!this.animationInProgress) {
        Array
          .from(this.items)
          .filter(item => this.isOffRightEdge(item))
          .forEach(item => {
            howMuchToScroll = this.getDistanceToRightEdge(item);

            if (this.isLastTab(item)) {
              this.disableRightControl();
            }
          });

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
      return tab === this.items.firstElementChild;
    },

    isLastTab(tab) {
      return tab === this.items.lastElementChild;
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

      this.items.forEach(item => {
        if (this.isOffLeftEdge(item)) {
          showLeftArrow = true;
        } else if (this.isOffRightEdge(item)) {
          showRightArrow = true;
        }
      });

      showLeftArrow ? this.enableLeftControl() : this.disableLeftControl();
      showRightArrow ? this.enableRightControl() : this.disableRightControl();
    },

    selectTab(event) {
      event.preventDefault();

      const tab = event.target;
      const tabId = tab.getAttribute('class'); // @TODO: i don't like this. what if there are other classes applied?
      const alreadySelected = false; //tabId === this.getSelectedTab().querySelector('a').getAttribute('class');

      if (!alreadySelected) {
        this.updateContent(tabId);

        // Bring partially visible tabs into screen when clicked
        if (this.isOffLeftEdge(tab)) {
          this.scrollLeft(event); // @TODO: refactor so that i don't need to pass in an event
        } else if (this.isOffRightEdge(tab)) {
          this.scrollRight(event);
        }
      }
    },

    getSelectedTab() {
      return this.tabs.querySelector('li.selected');
    },

    hidePanel(panel) {
      hide(panel); // fadeOut
    },

    showPanel(panel) {
      show(panel); // fadeIn
    },

    updateContent(tabId) {
      const clicked = this.tabs.querySelector(`a.${tabId}`);
      const targetPanel = this.panels.querySelector(`div.${tabId}`);

      console.log('target', targetPanel);

      this.getSelectedTab().classList.remove('selected');
      clicked.parentNode.classList.add('selected');

      // @TODO: this.hidePanel(this.panels.querySelectorAll('div:not(:visible'));
      Array.from(this.panels.children).forEach(panel => this.hidePanel(panel));

      this.showPanel(targetPanel);
    }
  };

  return Tabber;
});
