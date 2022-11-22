import React, { ForwardedRef, forwardRef, useState } from 'react';
import { FormGroup, Label } from 'reactstrap';
import classNames from 'classnames';

import { withJarb } from '../withJarb/withJarb';
import { Icon, icons } from '../../core/Icon';
import { Pager } from '../../core/Pager/Pager';
import { doBlur } from '../utils';
import { SearchInput } from '../../core/SearchInput/SearchInput';
import { pageOf } from '../../utilities/page/page';
import { ContentState } from '../../core/ContentState/ContentState';
import { t } from '../../utilities/translation/translation';
import { Tooltip } from '../../core/Tooltip/Tooltip';
import { TextButton } from '../../core/TextButton/TextButton';
import { FieldCompatible } from '../types';
import Tippy from '@tippyjs/react';
import { Card } from '../../core/Card/Card';
import { withField } from '../withField/withField';
import { IconType } from '../../core/types';

type Text = {
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
   * The text of the clear button.
   */
  clear?: string;

  /**
   * The label of the search input.
   */
  searchLabel?: string;

  /**
   * The placeholder of the search input.
   */
  searchPlaceholder?: string;
};

type Props = FieldCompatible<IconType, IconType | undefined> & {
  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;

  /**
   * Optionally the icon to display on the button to open the icon picker.
   */
  icon?: IconType;

  /**
   * Whether to show a "clear" button.
   *
   * Defaults to `true`
   */
  canClear?: boolean;
};

/**
 * IconPicker is a form element which allows the user to select one
 * of the material design icons. It is a popover which shows all
 * the icons and lets the user select one.
 */
export function IconPicker(props: Props) {
  const {
    label,
    hiddenLabel,
    icon,
    value,
    color,
    placeholder,
    className,
    error,
    onChange,
    onBlur,
    text = {},
    canClear = true
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [query, setQuery] = useState('');

  const filteredIcons = icons.filter((icon) =>
    icon.toLowerCase().startsWith(query.toLowerCase())
  );

  const iconsPage = pageOf(filteredIcons, pageNumber, 36);

  function onIconSelected(icon?: IconType) {
    onChange(icon);
    doBlur(onBlur);
    setIsOpen(false);
  }

  function onSearch(term: string) {
    setQuery(term);
    setPageNumber(1);
  }

  const isEmpty = filteredIcons.length === 0;

  const classes = classNames('icon-picker', className);

  return (
    <SearchInput
      defaultValue={query}
      onChange={onSearch}
      debounce={0}
      label={t({
        key: 'IconPicker.SEARCH_INPUT_LABEL',
        fallback: 'Start typing to search an icon',
        overrideText: text.searchLabel
      })}
      placeholder={t({
        key: 'IconPicker.SEARCH',
        fallback: 'Search...',
        overrideText: text.searchPlaceholder
      })}
      hiddenLabel={true}
    >
      {(searchInput, searchInputApi) => (
        <FormGroup className={classes} color={color}>
          {!hiddenLabel ? <Label>{label}</Label> : null}

          <div className="d-flex">
            {value ? (
              <div className="d-flex justify-content-between">
                <Icon
                  id="icon-picker-value"
                  className="pt-2 me-3"
                  icon={value}
                />
                {canClear ? (
                  <TextButton onClick={() => onIconSelected()} className="me-3">
                    {t({
                      key: 'IconPicker.CLEAR',
                      fallback: 'Clear',
                      overrideText: text.clear
                    })}
                  </TextButton>
                ) : null}
              </div>
            ) : null}
            <Tippy
              visible={isOpen}
              className="border-0 tippy-popover"
              placement="bottom"
              offset={[0, 7]}
              interactive={true}
              zIndex={1049} // One level below bootstrap's modal
              content={
                <Card
                  header={searchInput}
                  footer={
                    iconsPage.totalPages > 1 ? (
                      <Pager page={iconsPage} onChange={setPageNumber} />
                    ) : undefined
                  }
                  cardFooterClassName="bg-white"
                >
                  <div style={{ width: 240, height: 240, margin: 'auto' }}>
                    {!isEmpty ? (
                      iconsPage.content.map((icon) => (
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
                </Card>
              }
            >
              <IconPickerButtonRef
                onClick={() => {
                  if (isOpen) {
                    searchInputApi.setValue('');
                  }

                  setIsOpen(!isOpen);
                }}
                icon={icon}
                placeholder={placeholder}
              />
            </Tippy>
          </div>

          {error}
        </FormGroup>
      )}
    </SearchInput>
  );
}

type ButtonProps = {
  onClick: () => void;
  icon?: IconType;
  placeholder?: string;
};

function IconPickerButton(
  { onClick, icon, placeholder }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={onClick}
      ref={ref}
    >
      {icon ? <Icon icon={icon} className="me-2 align-bottom" /> : null}
      {placeholder}
    </button>
  );
}

const IconPickerButtonRef = forwardRef(IconPickerButton);

/**
 * Variant of the IconPicker which can be used in a Jarb context.
 */
export const JarbIconPicker = withJarb<IconType, IconType, Props>(IconPicker);

/**
 * Variant of the IconPicker which can be used in a final form.
 */
export const FieldIconPicker = withField<IconType, IconType, Props>(IconPicker);
