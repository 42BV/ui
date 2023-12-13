import { EpicCellLayout } from '../../../EpicTable/cells/EpicCellLayout/EpicCellLayout';
import { EpicSort } from '../../../EpicTable/widgets/EpicSort/EpicSort';
import { Input } from '../../../../form/Input/Input';
import { EpicTableSortDirection } from '../../../EpicTable/types';
import { LabelForOption } from '../../../../form/option';
import { EpicHeader } from '../../../EpicTable/cells/EpicHeader/EpicHeader';
import { Select } from '../../../../form/Select/Select';
import { ReactNode } from 'react';

type Props<T> = {
  /**
   * The width of the cell in pixels.
   */
  width: number;

  /**
   * The height of the cell in pixels.
   * Defaults to 88 when onSearch is defined, or 44 otherwise.
   */
  height?: number;

  /**
   * Optionally a callback for when the width has changed. By setting
   * this callback you enable the resizing of the EpicHeader.
   *
   * You can never resize the width to less than the original width to
   * prevent columns from becoming too small.
   *
   * When this callback is called you should store the `width` and
   * pass it back into the CrudHeader as the `width` property.
   */
  onResize?: (width: number) => void;

  /**
   * The content of the cell.
   */
  children: ReactNode;

  /**
   * Optionally the current sorting direction.
   * Defaults to NONE.
   */
  direction?: EpicTableSortDirection;

  /**
   * Optional callback which is triggered when the direction changes.
   */
  onSort?: (direction: EpicTableSortDirection) => void;

  /**
   * Optional callback that is triggered when the search value changes.
   * When `options` is defined, a dropdown is displayed, otherwise an open
   * text input is displayed.
   */
  onSearch?: (value: T) => void;

  /**
   * Optionally the current search value.
   */
  searchValue?: T;

  /**
   * Optional search options used when you want to display a dropdown.
   */
  options?: T[];

  /**
   * Optional callback to convert a value of type T to an option to show
   * to the user.
   * Required when `options` is defined.
   */
  labelForOption?: LabelForOption<T>;

  /**
   * Optionally the (invisible) label for the search field.
   */
  searchLabel?: ReactNode;
};

/**
 * CrudHeader is used to display a header in the EpicTable or CrudTable.
 * If onSort is defined, a sorting button is displayed next to the label.
 * If onSearch is defined, a search field is displayed below the label.
 */
export function CrudHeader<T = string>({
  direction = 'NONE',
  onSort,
  onSearch,
  searchValue,
  options,
  labelForOption,
  width,
  height,
  onResize,
  searchLabel,
  children
}: Props<T>) {
  const header = onSort ? (
    <EpicCellLayout mode="horizontal">
      {children}
      <EpicSort direction={direction} onChange={onSort} />
    </EpicCellLayout>
  ) : (
    <>{children}</>
  );

  if (onSearch) {
    return (
      <EpicHeader
        width={width}
        height={height ? height : 88}
        onResize={onResize}
      >
        <EpicCellLayout mode="vertical">
          {header}
          {options && labelForOption ? (
            <Select<T>
              value={searchValue}
              options={options}
              labelForOption={labelForOption}
              onChange={onSearch}
              label={searchLabel}
              hiddenLabel={true}
            />
          ) : (
            <Input
              // @ts-expect-error Default value type is a string
              value={searchValue}
              // @ts-expect-error Default value type is a string
              onChange={onSearch}
              type="search"
              label={searchLabel}
              hiddenLabel={true}
            />
          )}
        </EpicCellLayout>
      </EpicHeader>
    );
  }

  return (
    <EpicHeader width={width} height={height} onResize={onResize}>
      {header}
    </EpicHeader>
  );
}
