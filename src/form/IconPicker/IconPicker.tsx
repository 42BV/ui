import React, { useState } from 'react';
import {
  FormGroup,
  Label,
  Button,
  PopoverHeader,
  PopoverBody,
  UncontrolledTooltip,
  UncontrolledPopover
} from 'reactstrap';
import classNames from 'classnames';

import withJarb from '../withJarb/withJarb';
import { Color } from '../types';
import { IconType, Icon, icons } from '../../core/Icon';
import Pager from '../../core/Pager/Pager';
import { doBlur } from '../utils';
import SearchInput from '../../core/SearchInput/SearchInput';
import { pageOf } from '../../utilities/page/page';
import ContentState from '../../core/ContentState/ContentState';
import { t } from '../../utilities/translation/translation';

interface Text {
  /**
   * No results title to show when no icon could be found for that
   * query.
   */
  noResultsTitle?: string;

  /**
   * No results subtitle to show when no icon could be found for that
   * query.
   */
  noResultsSubtitle?: string;

  /**
   * The text of the clear button
   */
  clear?: string;
}

interface Props {
  /**
   * The id of the form element.
   */
  id: string;

  /**
   * The value that the form element currently has.
   */
  value?: IconType;

  /**
   * Callback for when the form element changes.
   */
  onChange: (value?: IconType) => void;

  /**
   * Optional callback for when the form element is blurred.
   */
  onBlur?: () => void;

  /**
   * Optionally the error message to render.
   */
  error?: React.ReactNode;

  /**
   * Optionally the color of the FormGroup.
   */
  color?: Color;

  /**
   * Whether or not the form element is currently valid.
   */
  valid?: boolean;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * The label of the form element.
   */
  label: string;

  /**
   * The placeholder of the form element.
   */
  placeholder: string;

  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;
}

/**
 * IconPicker is a form element which allows the user to select one
 * of the material design icons. It is a popover which shows all
 * the icons and lets the user select one.
 */
export default function IconPicker(props: Props) {
  const {
    id,
    label,
    value,
    color,
    placeholder,
    className,
    error,
    onChange,
    onBlur,
    text = {}
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [query, setQuery] = useState('');

  const filteredIcons = icons.filter(icon =>
    icon.toLowerCase().startsWith(query.toLowerCase())
  );

  const iconsPage = pageOf(filteredIcons, pageNumber, 36);

  function onIconSelected(icon?: IconType) {
    onChange(icon);
    doBlur(onBlur);
    setIsOpen(false);
  }

  function onSearch(query: string) {
    setQuery(query);
    setPageNumber(1);
  }

  const isEmpty = filteredIcons.length === 0;

  const classes = classNames('icon-picker', className);

  return (
    <SearchInput value={query} onChange={onSearch} debounce={0}>
      {(searchInput, searchInputApi) => (
        <FormGroup className={classes} color={color}>
          <Label for={id}>{label}</Label>

          <div className="d-flex">
            {value ? (
              <div className="d-flex justify-content-between">
                <Icon id="icon-picker-value" className="pt-2" icon={value} />
                <u
                  role="button"
                  className="align-self-center mx-3 clickable font-weight-lighter"
                  onClick={() => onIconSelected(undefined)}
                >
                  {t({
                    key: 'IconPicker.CLEAR',
                    fallback: 'Clear',
                    overrideText: text.clear
                  })}
                </u>
              </div>
            ) : null}
            <Button id="icon-picker-popover" type="button" color="primary">
              {placeholder}
            </Button>
          </div>

          {error}

          <UncontrolledPopover
            placement="bottom"
            isOpen={isOpen}
            target="icon-picker-popover"
            trigger="legacy"
            toggle={() => {
              if (isOpen) {
                searchInputApi.setValue('');
              }

              setIsOpen(!isOpen);
            }}
          >
            <PopoverHeader>{searchInput}</PopoverHeader>
            <PopoverBody>
              <div style={{ width: 250, height: 250 }}>
                {!isEmpty ? (
                  iconsPage.content.map((icon, index) => {
                    const tooltipId = `icon-${index}`;

                    return (
                      <span key={icon} className="d-inline-block">
                        <Icon
                          id={tooltipId}
                          className="m-2"
                          icon={icon}
                          onClick={() => onIconSelected(icon)}
                        />
                        <UncontrolledTooltip placement="top" target={tooltipId}>
                          {icon}
                        </UncontrolledTooltip>
                      </span>
                    );
                  })
                ) : (
                  <ContentState
                    mode="no-results"
                    title={t({
                      key: 'IconPicker.NO_RESULTS.TITLE',
                      fallback: 'No icons found',
                      overrideText: text.noResultsTitle
                    })}
                    subTitle={t({
                      key: 'IconPicker.NO_RESULTS.SUBTITLE',
                      fallback:
                        'No icons were found, please try again with a different query.',
                      overrideText: text.noResultsSubtitle
                    })}
                  />
                )}
              </div>

              <div className="my-2 text-center">
                <Pager page={iconsPage} onChange={setPageNumber} />
              </div>
            </PopoverBody>
          </UncontrolledPopover>
        </FormGroup>
      )}
    </SearchInput>
  );
}

/**
 * Variant of the IconPicker which can be used in a Jarb context.
 */
export const JarbIconPicker = withJarb<IconType, IconType, Props>(IconPicker);
