import {
  blurrable,
  fillable,
  focusable,
  interactor,
  value,
} from '@bigtest/interactor';

@interactor
export class TextAreaInteractor {
  val = value();
  fillTextArea = fillable();
  focusTextArea = focusable();
  blurTextArea = blurrable();

  fillAndBlur(val) {
    return this
      .focusTextArea()
      .fillTextArea(val)
      .blurTextArea();
  }
}
