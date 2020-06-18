import React, { useState } from 'react';
import {
  Button,
  FormGroup,
  Label,
  Card,
  CardHeader,
  CardBody
} from 'reactstrap';
import classNames from 'classnames';

import withJarb from '../withJarb/withJarb';
import { Color } from '../types';
import { Icon, icons, IconType } from '../../core/Icon';
import Pager from '../../core/Pager/Pager';
import { doBlur } from '../utils';
import SearchInput from '../../core/SearchInput/SearchInput';
import { pageOf } from '../../utilities/page/page';
import ContentState from '../../core/ContentState/ContentState';
import { t } from '../../utilities/translation/translation';
import Tooltip from '../../core/Tooltip/Tooltip';
import Popover from '../../core/Popover/Popover';

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

interface BaseProps {
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
   * The placeholder of the form element.
   */
  placeholder: string;

  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;
}

interface WithoutLabel extends BaseProps {
  id?: string;
  label?: never;
}

interface WithLabel extends BaseProps {
  /**
   * The id of the form element.
   */
  id: string;

  /**
   * The label of the form element.
   */
  label: React.ReactNode;
}

export type Props = WithoutLabel | WithLabel;

/**
 * IconPicker is a form element which allows the user to select one
 * of the material design icons. It is a popover which shows all
 * the icons and lets the user select one.
 */
export default function IconPicker(props: Props) {
  const {
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
          {'label' in props && props.label ? (
            <Label>{props.label}</Label>
          ) : null}

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
            <Popover
              placement="bottom"
              isOpen={isOpen}
              target={
                <Button
                  type="button"
                  color="primary"
                  onClick={() => {
                    if (isOpen) {
                      searchInputApi.setValue('');
                    }

                    setIsOpen(!isOpen);
                  }}
                >
                  {placeholder}
                </Button>
              }
            >
              <Card>
                <CardHeader>{searchInput}</CardHeader>
                <CardBody>
                  <div style={{ width: 250, height: 250 }}>
                    {!isEmpty ? (
                      iconsPage.content.map(icon => (
                        <span key={icon} className="d-inline-block">
                          <Tooltip placement="top" distance={18} content={icon}>
                            <Icon
                              className="m-2"
                              icon={icon}
                              onClick={() => onIconSelected(icon)}
                            />
                          </Tooltip>
                        </span>
                      ))
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
                </CardBody>
              </Card>
            </Popover>
          </div>

          {error}
        </FormGroup>
      )}
    </SearchInput>
  );
}

/**
 * Variant of the IconPicker which can be used in a Jarb context.
 */
export const JarbIconPicker = withJarb<IconType, IconType, Props>(IconPicker);
