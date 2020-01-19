function ColorSelector(){
  let hsv = {
    h: 0,
    s: 0,
    v: 0,
    setHSV: setHSV,
    getHSL: getHSL,
    onchange: null
  };
  let paletteMouseDown = false;
  let hueMouseDown = false;

  let colorSelector = document.getElementById('color-selector');
  let colorSelectorPalette = document.getElementById('color-selector-palette');
  let colorSelectorPaletteCursor = document.getElementById('color-selector-palette-cursor');
  let colorSelectorHue = document.getElementById('color-selector-hue');

  function valueRange(min, max, value){
    return Math.min(max, Math.max(min, value));
  }

  function getHSL(){
    let h = hsv.h;
    let s = hsv.s;
    let v = hsv.v;
    let l = (2 - s / 100) * v / 2;

    if (isNaN(s)) s = 0;
    return {
      h: h,
      s: s * v / (l < 50 ? l * 2 : 200 - l * 2),
      l: l
    }
  }

  function setPaletteCursorColor(){
    let hsl = getHSL();
    colorSelectorPaletteCursor.style.setProperty('background', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
  }

  function setHueCursorColor(){
    colorSelector.style.setProperty('--hue', hsv.h);
  }

  function mousePositionPercentWithinElement(mouseEvent, element){
    /**
     * Returns the (x,y) mouse position as a percentage within element
     */
    let elementBounds = element.getBoundingClientRect();
    let eX = elementBounds.x;
    let eY = elementBounds.y;
    let eWidth = elementBounds.width;
    let eHeight = elementBounds.height;
    let mX = mouseEvent.x;
    let mY = mouseEvent.y;
    return {
      x: (mX-eX)/eWidth * 100,
      y: (mY-eY)/eHeight * 100
    }
  }

  function updateColorSelector(){
    colorSelector.style.setProperty('--saturation', hsv.s+'%');
    colorSelector.style.setProperty('--value', hsv.v+'%');
    setHueCursorColor();
    setPaletteCursorColor();
  }

  function setHSV(e){
    /**
     * mutates hsv variable and updates color selector elements
     */
    if (e instanceof MouseEvent){
      if (paletteMouseDown){
        let mP = mousePositionPercentWithinElement(e, colorSelectorPalette);

        hsv.s = valueRange(0, 100, mP.x);
        hsv.v = valueRange(0, 100, 100 - mP.y);
        updateColorSelector();
      } else if (hueMouseDown){
        let mP = mousePositionPercentWithinElement(e, colorSelectorHue);
        hsv.h = valueRange(0, 360, mP.x * 3.6);
        updateColorSelector();
      }

      if (paletteMouseDown || hueMouseDown){
        if (hsv.onchange){
          hsv.onchange();
        }
      }
    } else if ('h' in e && 's' in e && 'v' in e){
      hsv.h = valueRange(0, 360, e.h);
      hsv.s = valueRange(0, 100, e.s);
      hsv.v = valueRange(0, 100, e.v);
      updateColorSelector();

      if (hsv.onchange){
        hsv.onchange();
      }
    }
  }

  window.addEventListener('mousemove', setHSV);

  colorSelectorPalette.addEventListener('mousedown', e => {
    e.preventDefault();
    paletteMouseDown = true;
    setHSV(e);
  });
  colorSelectorHue.addEventListener('mousedown', e => {
    e.preventDefault();
    hueMouseDown = true;
    setHSV(e);
  });
  window.addEventListener('mouseup', e => {paletteMouseDown = false; hueMouseDown = false;});

  updateColorSelector();
  return hsv;
}