import {
  interactor,
  clickable,
  blurrable,
  value,
  property,
} from '@bigtest/interactor';

@interactor
export class CheckboxInteractor {
  static defaultScope = '[class*=checkbox---]';

  clickInput = clickable('input');
  blurInput = blurrable('input');
  inputValue = value('input');
  isChecked = property('input', 'checked');

  clickAndBlur() {
    return this
      .clickInput()
      .blurInput();
  }
}
