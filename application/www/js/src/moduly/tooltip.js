'use strict';

// Polyfill matches as per https://github.com/jonathantneal/closest
Element.prototype.matches = Element.prototype.matches ||
							Element.prototype.mozMatchesSelector ||
							Element.prototype.msMatchesSelector ||
							Element.prototype.oMatchesSelector ||
							Element.prototype.webkitMatchesSelector;

/**
 * @param {object} options Object containing configuration overrides
 */
const Frtooltip = function ({
		selector: selector = '.js-tooltip',
		tooltipSelector: tooltipSelector = '.js-tooltip-tooltip',
		toggleSelector: toggleSelector = '.js-tooltip-toggle',
		tooltipIdPrefix: tooltipIdPrefix = 'tooltip',
		readyClass: readyClass = 'tooltip--is-ready'
	} = {}) {


	// CONSTANTS
	const doc = document;
	const docEl = doc.documentElement;
	const _q = (el, ctx = doc) => [].slice.call(ctx.querySelectorAll(el));


	// SUPPORTS
	if (!('querySelector' in doc) || !('addEventListener' in window) || !docEl.classList) return;


	// SETUP
	let tooltipContainers = _q(selector);

	//	TEMP
	let currTooltip = null;


	//	UTILS
	function _defer (fn) {
		//	wrapped in setTimeout to delay binding until previous rendering has completed
		if (typeof fn === 'function') setTimeout(fn, 0);
	}
	function _closest (el, selector) {
		while (el) {
			if (el.matches(selector)) break;
			el = el.parentElement;
		}
		return el;
	}


	//	A11Y
	function _addA11y (container, i) {
		//	get relative elements
		let toggle = _q(toggleSelector, container)[0];
		let tooltip = _q(tooltipSelector, container)[0];
		//	create new button and replace toggle
    if( tooltip.querySelector(toggle.getAttribute('class')) ) {
      var button = doc.createElement('button');
      button.setAttribute('class', toggle.getAttribute('class'));
  		button.setAttribute('aria-expanded', 'false');
  		button.setAttribute('aria-describedby', '');
  		button.textContent = toggle.textContent;
  		container.replaceChild(button, toggle);
    }
		//	add tooltip attributes
		tooltip.setAttribute('role', 'tooltip');
		tooltip.setAttribute('id', tooltipIdPrefix + '-' + i);
		tooltip.setAttribute('aria-hidden', 'true');
		tooltip.setAttribute('aria-live', 'polite');
	}
	function _removeA11y (container) {
		//	get relative elements
		let toggle = _q(toggleSelector, container)[0];
		let tooltip = _q(tooltipSelector, container)[0];
		//	create new span and replace toggle
		var span = doc.createElement('span');
		span.setAttribute('class', toggle.getAttribute('class'));
		span.textContent = toggle.textContent;
		container.replaceChild(span, toggle);
		//	remove tooltip attributes
		tooltip.removeAttribute('role');
		tooltip.removeAttribute('id');
		tooltip.removeAttribute('aria-hidden');
		tooltip.removeAttribute('aria-live');
	}


	// ACTIONS
	function _showTooltip (toggle, tooltip) {
    // posune tooltip do správné pozice
    let sirka_tooltipu = 190;
    let stred = toggle.getBoundingClientRect().left + toggle.getBoundingClientRect().width / 2;
    tooltip.classList.remove('leva');
    tooltip.classList.remove('prava');
    if( stred < sirka_tooltipu/2 ) {
      tooltip.classList.add('leva');
    } else if ( stred > (window.innerWidth - sirka_tooltipu/2) ) {
      tooltip.classList.add('prava');
    }

		//	assign describedby matching tooltip reference
		let tooltipId = tooltip.getAttribute('id');
		toggle.setAttribute('aria-describedby', tooltipId);
		//	set visible state
		toggle.setAttribute('aria-expanded', 'true');
		tooltip.setAttribute('aria-hidden', 'false');
		//	store temp reference to tooltip
		currTooltip = tooltip;
		//	bind doc close events
		_defer(_bindDocClick);
		_defer(_bindDocKey);
	}
	function _hideTooltip (toggle, tooltip) {
		//	remove tooltip reference
		toggle.setAttribute('aria-describedby', '');
		//	set visible state
		toggle.setAttribute('aria-expanded', 'false');
		tooltip.setAttribute('aria-hidden', 'true');
		//	remove tooltip temp reference
		currTooltip = null;
		//	unbind doc close events
		_unbindDocClick();
		_unbindDocKey();
	}
	function destroy () {
		tooltipContainers.forEach((container, i) => {
			_removeA11y(container, i);
			_unbindToggleEvents(container);
			container.classList.remove(readyClass);
		});
		//	reset temp references
		currTooltip = null;
		//	unbind global events
		_unbindDocClick();
		_unbindDocKey();
	}


	// EVENTS
	function _eventTogglePointer (e) {
		//	close any open tooltips
		if (currTooltip) _hideTooltip(currTooltip.previousElementSibling, currTooltip);
		//	get relevant tooltip elements
		let toggle = e.target;
    // MF : přidáno
    if( !hasClass(toggle, 'tooltip-toggle') ) {
      toggle = toggle.parentNode;
    }

		let tooltip = toggle.nextElementSibling;
		//	show or hide if toggle is 'expanded'
		if (toggle.getAttribute('aria-expanded') === 'false') {
			_showTooltip(toggle, tooltip);
		} else {
			_hideTooltip(toggle, tooltip);
		}
	}
	function _eventTogglePointerLeave () {
		if (currTooltip) _hideTooltip(currTooltip.previousElementSibling, currTooltip);
	}
	function _eventDocClick (e) {
		//	check if target is panel or child of
		let isTooltip = e.target === currTooltip;
		let isTooltipchild = _closest(e.target, tooltipSelector);
		if (!isTooltip && !isTooltipchild) _hideTooltip(currTooltip.previousElementSibling, currTooltip);
	}
	function _eventDocKey (e) {
		//	esc key
		if (e.keyCode === 27) _hideTooltip(currTooltip.previousElementSibling, currTooltip);
	}


	// BIND EVENTS
	function _bindToggleEvents (container) {
		const toggle = _q(toggleSelector, container)[0];
		toggle.addEventListener('click', _eventTogglePointer);
		toggle.addEventListener('mouseenter', _eventTogglePointer);
		toggle.addEventListener('mouseleave', _eventTogglePointerLeave);
	}
	function _bindDocClick () {
		doc.addEventListener('click', _eventDocClick);
		doc.addEventListener('touchstart', _eventDocClick);
	}
	function _bindDocKey () {
		doc.addEventListener('keydown', _eventDocKey);
	}


	//	UNBIND EVENTS
	function _unbindToggleEvents (container) {
		const toggle = _q(toggleSelector, container)[0];
		toggle.removeEventListener('click', _eventTogglePointer);
		toggle.removeEventListener('mouseenter', _eventTogglePointer);
		toggle.removeEventListener('mouseleave', _eventTogglePointerLeave);
	}
	function _unbindDocClick () {
		doc.removeEventListener('click', _eventDocClick);
		doc.removeEventListener('touchstart', _eventDocClick);
	}
	function _unbindDocKey () {
		doc.removeEventListener('keydown', _eventDocKey);
	}


	// INIT
	function init () {
		if (!tooltipContainers) return;
		//	loop through each tooltip element
		tooltipContainers.forEach((container, i) => {
			_addA11y(container, i);
			_bindToggleEvents(container);
			container.classList.add(readyClass);
		});
	}
	init();


	// REVEAL API
	return {
		init,
		destroy
	}
}


// module exports
export default Frtooltip;
