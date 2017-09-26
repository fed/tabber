define('tabber', ['animate'], (animate) => {
  console.log(animate);

  const DEFAULTS = {
    arrowWidth: 14,
    tabSlideSpeed: 600,
    arrowFadeSpeed: 300
  };

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

    Array.from(this.panels.children).forEach(panel => this.hidePanel(panel));
    this.panels.firstElementChild.style.display = 'block';
    this.tabs.firstElementChild.classList.add('selected');
    this.updateControls();
    this.responsify();
  }

  Tabber.prototype = {
    responsify() {
      // @TODO: debounce this event
      window.addEventListener('resize', this.updateControls.bind(this));
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
        { duration: this.settings.tabSlideSpeed, easing: 'linear' }
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
      return tab === this.items.firstChild;
    },

    isLastTab(tab) {
      return tab === this.items.lastChild;
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
      this.leftArrow.style.display = 'inline-block'; // @TODO: fadeIn(this.leftArrow);
      this.control.classList.remove('no-fade-left');
    },

    disableLeftControl() {
      this.leftArrow.style.display = 'none'; // @TODO: fadeOut(this.leftArrow);
      this.control.classList.add('no-fade-left');
    },

    enableRightControl() {
      this.rightArrow.style.display = 'inline-block'; // @TODO: fadeIn(this.rightArrow);
      this.control.classList.remove('no-fade-right');
    },

    disableRightControl() {
      this.rightArrow.style.display = 'none'; // @TODO: fadeOut(this.rightArrow);
      this.control.classList.add('no-fade-right');
    },

    updateControls() {
      let shouldShowLeftArrow = false;
      let shouldShowRightArrow = false;

      this.items.forEach(item => {
        if (this.isOffLeftEdge(item)) {
          shouldShowLeftArrow = true;
        } else if (this.isOffRightEdge(item)) {
          shouldShowRightArrow = true;
        }
      });

      if (shouldShowLeftArrow) {
        this.enableLeftControl();
      } else {
        this.disableLeftControl();
      }

      if (shouldShowRightArrow) {
        this.enableRightControl();
      } else {
        this.disableRightControl();
      }
    },

    selectTab(event) {
      event.preventDefault();

      const tab = event.target;
      const tabId = tab.getAttribute('class'); // @TODO: i don't like this. what if there are other classes applied?
      const alreadySelected = tabId === this.getSelectedTab().querySelector('a').getAttribute('class');

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
      panel.style.display = 'none'; // fadeOut(panel);
    },

    showPanel(panel) {
      panel.style.display = 'block'; // fadeIn(panel);
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
