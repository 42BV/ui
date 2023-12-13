import { t } from '../../utilities/translation/translation';
import classNames from 'classnames';

export type Props = {
  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
};

/**
 * Renders:
 *
 * --- Or ---
 */
export function OrSeparator({ className }: Props) {
  return (
    <div
      className={classNames('my-2 px-5 d-flex align-items-center', className)}
    >
      <div className="border-top flex-grow-1 position-relative" />
      <em className="mx-2">
        {t({
          key: 'OrSeparator.OR',
          fallback: 'OR'
        })}
      </em>
      <div className="border-top flex-grow-1 position-relative" />
    </div>
  );
}
