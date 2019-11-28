import {
  blurrable,
  fillable,
  focusable,
  interactor,
  value,
} from '@bigtest/interactor';

@interactor
export class InputInteractor {
  val = value();
  fillInput = fillable();
  focusInput = focusable();
  blurInput = blurrable();

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
