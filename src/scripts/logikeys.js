module.exports = function(options) {
  return function(deck) {

    let isHorizontal = options !== 'vertical',
      digits = [],
      keyDelay,
      KEY_DELAY_MS = 300;

    function getDigit(which) {
      let result = which;
      while (result > 0x9) {
        result -= 0x30;
      }
      return result;
    }

    function isDigitKey(which) {
      let result = (which >= 0x30 && which <= 0x39) || (which >= 0x60 && which <= 0x69);
      return result;
    }

    function first() {
      return deck.slide(0);
    }

    function last() {
      let lastIndex = Math.max(0, deck.slides.length - 1);
      return deck.slide(lastIndex);
    }
    
    function waitForNextDigit(digit) {
      digits.push(digit);
      keyDelay = setTimeout(jumpToSlide, KEY_DELAY_MS);
    }
    
    function jumpToSlide() {
      let index = parseInt(digits.join(''));
      digits = [];
      if (Number.isNaN(index))
        return;
      index = Math.min(Math.max(1, index), deck.slides.length);
      return deck.slide(index - 1);
    }

    // Use the keyup event to support remot.io
    document.addEventListener('keyup', function(e) {
      clearTimeout(keyDelay);

      if (isDigitKey(e.which)) {
        waitForNextDigit(getDigit(e.which));
      } else if (digits.length > 0) {
        jumpToSlide();
      }

      if (e.which == 34 ||                  // PAGE DOWN
        (e.which == 32 && !e.shiftKey) ||   // SPACE WITHOUT SHIFT
        (isHorizontal && e.which == 39) ||  // RIGHT
        (!isHorizontal && e.which == 40))   // DOWN
        { deck.next(); }
      
      if (e.which == 33 ||                  // PAGE UP
        (e.which == 32 && e.shiftKey) ||    // SPACE + SHIFT
        (isHorizontal && e.which == 37) ||  // LEFT
        (!isHorizontal && e.which == 38))   // UP
        { deck.prev(); }

      // F5 & PERIOD are the present / hide buttons on a Logitech Presenter
      if (e.which == 116 ||                 // F5
        (isHorizontal && e.which == 38))    // UP
        { first(); }

      if (e.which == 190 ||                 // PERIOD
        (isHorizontal && e.which == 40))    // DOWN
        { last(); }
    });

  };
};

