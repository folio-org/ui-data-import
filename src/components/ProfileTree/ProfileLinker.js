import React, {
  memo,
  useState,
  forwardRef,
  useRef,
  Fragment,
} from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Tooltip,
  Button,
  Icon,
} from '@folio/stripes/components';

import css from './ProfileTree.css';

export const ProfileLinker = memo(({
  title,
  linkingRules,
  className,
  onLinkCallback,
}) => {
  const buttonRef = React.createRef();
  const localTitle = title || <FormattedMessage id="ui-data-import.settings.getStarted" />;
  const [typeSelectorOpen, setTypeSelectorOpen] = useState(false);

  // eslint-disable-next-line
  const LinkerButton = forwardRef((props, ref) => (
    <Button
      ref={ref}
      aria-labelledby="linker-tooltip-text"
      onClick={() => setTypeSelectorOpen(true)}
    >
      {props.children}
    </Button>
  ));

  return (
    <div className={className}>
      <LinkerButton ref={buttonRef}>
        <Icon
          icon="plus-sign"
          size="medium"
        />
      </LinkerButton>
      <Tooltip
        id="linker-tooltip"
        text={localTitle}
        triggerRef={buttonRef}
      />
    </div>
  );
});

ProfileLinker.propTypes = {
  onLinkCallback: PropTypes.func.isRequired,
  linkingRules: PropTypes.object.isRequired,
  title: PropTypes.node || PropTypes.string,
  className: PropTypes.string,
};
