import {
  blurrable,
  fillable,
  focusable,
  interactor,
  property,
  text,
  value,
} from '@bigtest/interactor';

@interactor
export class InputInteractor {
  val = value();
  label = text('label');
  fillInput = fillable();
  focusInput = focusable();
  blurInput = blurrable();
  isDisabled = property('input', 'disabled');

  fillAndBlur(val) {
    return this
      .focusInput()
      .fillInput(val)
      .blurInput();
  }

  fillValue(val) {
    return this
      .focusInput()
      .fillInput(val);
  }
}
