require('raw!../index.html'); // Dummy import to make webpack watch for html changes

import 'styles/style.less';
require.context('../images', true, /\.(png|jpg|gif)$/);
import bespoke from 'bespoke';
import classes from 'bespoke-classes';
import bullets from 'bespoke-bullets';
import backdrop from 'bespoke-backdrop';
import scale from 'bespoke-scale';
import hash from 'bespoke-hash';
import progress from 'bespoke-progress';
import state from 'bespoke-state';
import touch from 'bespoke-touch';
import logikeys from './logikeys';

const isIE = /(MSIE |Trident.*rv[ :])([0-9]+)/.test(navigator.userAgent);
bespoke.from('article', [
  classes(),
  bullets('.bullet'),
  backdrop(),
  scale(isIE ? 'transform' : undefined),
  hash(),
  progress(),
  state(),
  logikeys(),
  touch()
]);

(function preloadBackgroundImages() {

  let matches, image,
  forEach = function(arrayLike, fn) {
    arrayLike || [].slice.call(arrayLike, 0).forEach(fn);
  };

  forEach(document.styleSheets, function(sheet) {
    forEach(sheet.rules, function(rule) {
      if (rule.style && rule.style.backgroundImage) {
        matches = rule.style.backgroundImage.match(/url\((.*)\)/);
        if (matches) {
          image = new Image();
          image.src = matches[1];
        }
      }
    });
  });

}());
