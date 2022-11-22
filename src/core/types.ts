/* istanbul ignore file */

import React, { CSSProperties } from 'react';
import { icons } from './Icon';
import { AsyncState } from 'react-async';
import { UseQueryResult } from '@tanstack/react-query';
import { Page } from '@42.nl/spring-connect';

// Turns the Icon array into a union type of icons
export type IconType = typeof icons[number];
export type BootstrapColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'link'
  | 'muted'
  | 'dark'
  | 'light';

export type BootstrapSize = 'xs' | 'sm' | 'md' | 'lg';

type Side = 'top' | 'right' | 'bottom' | 'left';
type StartOrEnd = 'start' | 'end';
export type TippyPlacement = Side | `${Side}-${StartOrEnd}`;

export type WithChildren<T> = {
  children: T;
};
export type WithLabel<TLabel> = {
  label: TLabel;
};
export type WithActiveColor = {
  activeColor: BootstrapColor;
};

export type KeyValueMapping<TValue> = {
  [key: string | number | symbol]: TValue;
};

export type PartialHTMLDivElement<TChildren> = Partial<
  UIBasePropsWithCSSPropertiesAndChildren<TChildren>
>;

export type Clickable<TEvent, TReturn> = {
  onClick: (event: TEvent) => TReturn;
};
export type Closeable<TParam, TReturn> = {
  onClose: FunctionWrapper<TParam, TReturn>;
};

export type Openable<TParam, TReturn> = {
  onOpen: FunctionWrapper<TParam, TReturn>;
};

type FunctionWrapper<TParam, TReturn> = (param: TParam) => TReturn;

/**
 * Adds a field called 'value', of the given type, to the type extending this type.
 */
export type WithValue<TValType> = { value: TValType };
export type WithCSSProperties = {
  style: CSSProperties;
};

export type WithColor<TColor> = {
  color: TColor;
};

type WithDisabled<Type> = {
  disabled: Type;
};

export type UIBaseProps = Omit<
  HTMLElement,
  | 'children'
  | 'role'
  | 'style'
  | 'contentEditable'
  | 'translate'
  | 'prefix'
  | 'inputMode'
> &
  Clickable<React.MouseEvent<HTMLElement>, any> &
  WithDisabled<boolean> &
  WithColor<BootstrapColor>;

export type UIBasePropsWithRole = UIBaseProps & Pick<HTMLElement, 'role'>;

export type UIBasePropsWithChildren<TChildren> = UIBaseProps &
  WithChildren<TChildren>;

export type UIBasePropsWithCSSProperties = UIBaseProps &
  Partial<WithCSSProperties>;

export type UIBasePropsWithCSSPropertiesAndChildren<TChildren> =
  UIBasePropsWithCSSProperties & WithChildren<TChildren>;

export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonIconPosition = 'left' | 'right';

type WithIconType = {
  icon: IconType;
};

export type WithSize<Type> = {
  size: Type;
};
export type WithHeader<THeader> = {
  header: THeader;
};
export type WithFooter<TFooter> = {
  footer: TFooter;
};

/**
 * Serves as the base for the properties of all Button-components.
 */
export type ButtonProps<TChildren> = {
  /**
   * Type of the button, where the default is button.
   * @default 'button'
   */
  type?: ButtonType;

  /**
   * Determines the position of the icon.
   *
   * <p>The available options are 'left' and 'right'. This option is only
   * applicable when the icon-property is
   * set.</p>
   */
  iconPosition?: ButtonIconPosition;

  /**
   * Determines whether the action you intend to perform, is currently in
   * progress. If so, a spinner is rendered
   * inside the button.
   *
   * <p>This functionality is entirely optional.</p>
   *
   * @default false
   */
  inProgress?: boolean;

  /**
   * Determines whether to show the button exclusively as an outline.
   *
   * @default false
   */
  outline?: boolean;

  /**
   * Determines whether the button should take the full width available.
   *
   * @default false
   */
  fullWidth?: boolean;
} & Partial<
  UIBasePropsWithChildren<TChildren> &
    WithDisabled<boolean> &
    WithIconType &
    WithSize<ButtonSize>
>;

/**
 * Serves as the base for the properties of all Icon-components.
 */
export type IconProps = {
  /**
   * The color of the Icon when it's hovered over.
   *
   * <p>When disabled is true, hoverColor will not apply. This property only
   * takes effect when onClick is set.</p>
   */
  hoverColor?: BootstrapColor;
} & Partial<
  UIBasePropsWithCSSProperties &
    Clickable<React.MouseEvent<HTMLElement>, void> &
    WithSize<number>
> &
  WithIconType;

export type ContentStateMode = 'empty' | 'no-results' | 'error' | 'loading';
export type ContentStateProps = {
  /**
   * The mode of the ContentState:
   *
   * Use `empty` for when you want to inform the user that there
   * is no content yet.
   *
   * Use `no-results` for when applying a filter resulted in no results
   * matching the filters.
   *
   * Use `error` for when something went wrong.
   *
   * Use `loading` for when something is still loading.
   *
   */
  mode: ContentStateMode;

  /**
   * The title of the ContentState component.
   */
  title: string;

  /**
   * The subTitle of the ContentState component.
   */
  subTitle?: string;

  contentStateDivProps?: PartialHTMLDivElement<React.ReactNode>;

  stateIconDivProps?: PartialHTMLDivElement<React.ReactNode>;

  stateContentDivProps?: PartialHTMLDivElement<React.ReactNode>;

  iconProps?: {
    onChange?: () => void;
  } & Partial<Omit<IconProps, 'icon'>>;
} & PartialHTMLDivElement<React.ReactNode>;

export type BaseText = {
  /**
   * Error text to show when an error occurred.
   */
  error?: string;

  /**
   * Loading text to show when a request is being fetched.
   */
  loading?: string;

  /**
   * Empty text to show when a request has loaded but the response
   * is considered empty.
   */
  empty?: string;

  /**
   * Text to show within the `retry` button.
   */
  retry?: string;
};
type ReactState<T> = AsyncState<T> | UseQueryResult<T>;
export type AsyncContentProps<TData> = {
  state: ReactState<TData>;

  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: BaseText;

  /**
   * Optionally whether to show a retry button when the error state
   * occurs.
   * Defaults to `true`.
   *
   * @default true
   */
  showRetryButton?: boolean;

  /**
   * An optional callback which gets called when the data has
   * loaded. When `isEmpty` returns `true` the `emptyContent` is
   * rendered.
   */
  isEmpty?: (data?: TData) => boolean;

  /**
   * Optionally when `isEmpty` returns `true` what content to render.
   *
   * Defaults to rendering a `ContentState` in the `empty` mode.
   */
  emptyContent?: (data?: TData) => React.ReactNode;

  contentStateProps?: ContentStateProps;

  retryButtonProps?: ButtonProps<React.ReactNode>;
} & Partial<UIBaseProps> &
  WithChildren<(data: TData) => React.ReactNode>;

export type ToolTipProps = {
  /**
   * Content shown inside the tooltip. Not to be confused with the children-property.
   */
  content: React.ReactNode;

  /**
   * Optional alignment relative to the target where the tooltip will be shown.
   */
  placement?: TippyPlacement;

  /**
   * Optional offset that the popover will show up relative from the target.
   */
  offset?: number;

  /**
   * Optional distance that the tooltip will show up relative from the target.
   */
  distance?: number;

  /**
   * Optional value that allows you to interact with the Tooltip. This is useful for when
   * you have a clickable component inside your Tooltip.
   * When set to true, the Tooltip will no longer disappear when clicked
   */
  interactive?: boolean;

  /**
   * Optional that allows you to override the default max width of the tooltip
   * Possible values: number (px), string (with units "rem") or string 'none'.
   */
  maxWidth?: number | string;

  /**
   * Optionally the tag wrapping the children.
   * Default value is a span.
   */
  tag?: 'span' | 'div' | 'button';
} & Partial<UIBasePropsWithCSSPropertiesAndChildren<React.ReactNode>>;

export type ImageProps = UIBasePropsWithCSSProperties &
  Omit<
    HTMLImageElement,
    | 'referrerPolicy'
    | 'crossOrigin'
    | 'contentEditable'
    | 'style'
    | 'translate'
    | 'prefix'
    | 'inputMode'
    | 'children'
    | 'role'
  >;

export type Changeable<TParam, TReturn> = {
  onChange: (parameter: TParam) => TReturn;
};

export type PaginationProps<TPage> = {
  /**
   * Represents Spring's page abstraction.
   */
  page: Page<TPage>;

  /**
   * Optional callback to change the page's size using a dropdown.
   * Only if this property is provided, the dropdown will be displayed.
   */
  onPageSizeChange?: (size: number) => void;

  /**
   * Optional list of page sizes used for the page size dropdown.
   * Defaults to `[5, 10, 20, 50, 100]`.
   */
  allowedPageSizes?: number[];

  /**
   * Whether to show the previous and next buttons.
   *
   * Defaults to `true`
   */
  showPreviousAndNextButtons?: boolean;

  pageSizeDropdownLabel?: string;
} & Changeable<number, void> &
  Partial<UIBasePropsWithCSSProperties>;
