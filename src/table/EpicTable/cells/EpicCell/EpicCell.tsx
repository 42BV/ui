import React, { useRef } from 'react';
import classNames from 'classnames';

type Props = {
  /**
   * The content of the cell.
   */
  children: React.ReactNode;

  /**
   * The width of the cell in pixels.
   */
  width: number;

  /**
   * Optionally the height of the cell in pixels.
   * Defaults to 44.
   */
  height?: number;
};

// Props that will be injected by the EpicTable.
type InjectedProps = {
  /**
   *  Whether or not the cell is an odd cell. For the zebra stripes
   */
  odd: boolean;

  /**
   * An optional callback for when there is an action on the `EpicRow`
   * a click on one of the cells should trigger a click on the
   * `EpicRow`.
   */
  onRowClick?: (event: React.MouseEvent<HTMLDivElement>) => any;

  /**
   * Whether or not this cell should render with a hover background.
   * For the row click behavior, when hovering over one cell the
   * other cells in the row should be hovered as well. They need
   * to act as one.
   */
  hover: boolean;

  /**
   * Callback which is called whenever the hover state changes for
   * this particular cell.
   *
   * Is only called when onRowClick is defined.
   */
  onHoverChanged: (hover: boolean) => void;
};

/**
 * The EpicCell is used inside of a EpicRow to render content in.
 * It can be seen as the EpicTable's variant of the `<td>` element.
 */
export function EpicCell({ children, width, height = 44, ...rest }: Props) {
  const ref = useRef(null);

  const { odd, onRowClick, hover, onHoverChanged } = rest as InjectedProps;

  const classes = classNames('epic-table-cell border-bottom p-1', {
    'epic-table-cell--odd': odd,
    'epic-table-cell--hover': hover
  });

  function handleOnRowClick(event: React.MouseEvent<HTMLDivElement>) {
    /*
      Due to our mangeling of the DOM for the EpicTable to work. The
      normal way to prevent events from bubbling will not work via
      event.preventDefault. This is because of Reacts SyntheticEvent
      events not working like normal DOM events: 
      https://github.com/facebook/react/issues/1691

      So in order to prevent `onRowClick` from responding to events
      which came from its children, we only call `onRowClick` when
      the `div` of the `EpicCell` itself is clicked.
    */
    if (onRowClick && ref.current === event.target) {
      onRowClick(event);
    }
  }

  return (
    <div
      ref={ref}
      onMouseEnter={onRowClick ? () => onHoverChanged(true) : undefined}
      onMouseLeave={onRowClick ? () => onHoverChanged(false) : undefined}
      onClick={onRowClick ? handleOnRowClick : undefined}
      className={classes}
      style={{
        minWidth: width,
        width,
        height
      }}
    >
      {children}
    </div>
  );
}
