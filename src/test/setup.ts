import '@testing-library/jest-dom';

/*
 * jsdom has no modal dialogs and no ResizeObserver. The Bidoom sheets and confirmation dialogs
 * are native <dialog>s, and the rails and the slide to confirm measure themselves, so the tests
 * get the minimum: showModal/close toggle `open` (and fire `close`), and ResizeObserver observes
 * nothing.
 */
if (typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.show = function show(this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.hasAttribute('open')) return;
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
