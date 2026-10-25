import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import i18n from '@shared/i18n';
import { SlideToConfirm } from './SlideToConfirm';

function renderSlide(onConfirm = vi.fn()) {
  render(
    <I18nextProvider i18n={i18n}>
      <SlideToConfirm
        label="Slide to bid"
        doneLabel="Bid placed"
        confirmTitle="Place a bid of 1,350,000 IQD?"
        confirmBody="Bids are binding."
        confirmLabel="Place bid"
        onConfirm={onConfirm}
      />
    </I18nextProvider>,
  );
  return onConfirm;
}

describe('SlideToConfirm', () => {
  it('never moves money on a single tap: a tap opens the confirmation instead', async () => {
    await i18n.changeLanguage('en');
    const onConfirm = renderSlide();
    await userEvent.click(screen.getByRole('button', { name: 'Slide to bid' }));

    expect(onConfirm).not.toHaveBeenCalled();
    expect(
      screen.getByRole('alertdialog', { name: 'Place a bid of 1,350,000 IQD?' }),
    ).toBeVisible();
  });

  it('has a keyboard path: Enter opens the confirmation, and confirming runs the action', async () => {
    await i18n.changeLanguage('en');
    const onConfirm = renderSlide();
    screen.getByRole('button', { name: 'Slide to bid' }).focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.click(screen.getByRole('button', { name: 'Place bid' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('cancelling the confirmation does nothing', async () => {
    await i18n.changeLanguage('en');
    const onConfirm = renderSlide();
    await userEvent.click(screen.getByRole('button', { name: 'Slide to bid' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('describes the gesture and its alternative to assistive technology', async () => {
    await i18n.changeLanguage('en');
    renderSlide();
    expect(screen.getByRole('button', { name: 'Slide to bid' })).toHaveAccessibleDescription(
      /Drag the handle all the way to confirm/,
    );
  });

  it('confirms when the knob is dragged to the end', async () => {
    await i18n.changeLanguage('en');
    const onConfirm = renderSlide();
    const track = screen.getByRole('button', { name: 'Slide to bid' });
    const knob = track.querySelector('.cursor-grab') as HTMLElement;
    // jsdom lays nothing out: travel is 0, so any movement past the threshold reads as complete.
    knob.setPointerCapture = () => {};
    fireEvent.pointerDown(knob, { clientX: 0, pointerId: 1 });
    fireEvent.pointerMove(knob, { clientX: 300, pointerId: 1 });
    fireEvent.pointerUp(knob, { clientX: 300, pointerId: 1 });

    await vi.waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1));
  });
});
