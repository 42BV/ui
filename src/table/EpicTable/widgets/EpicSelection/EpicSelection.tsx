import React from 'react';
import { Input, Label } from 'reactstrap';

export type Props = {
  /**
   * Optionally the label for the button, when the label is clicked
   * the checkbox is checked.
   */
  children?: React.ReactNode;

  /**
   * Whether the checkbox is checked.
   */
  checked: boolean;

  /**
   * The callback which occurs when the checkbox is clicked.
   */
  onChange: (checked: boolean) => void;
};

/**
 * The EpicSelection is basically a checkbox for the EpicTable.
 * It can be used to select rows inside the table or even cells.
 */
export function EpicSelection({ children, checked, onChange }: Props) {
  return (
    <Label className="d-flex align-items-center ps-2 py-1 my-n1 ms-n2 clickable h-auto">
      <Input
        type="checkbox"
        className="m-0 me-2 flex-shrink-0 flex-grow-0 d-inline-block position-static clickable"
        checked={checked}
        onChange={() => onChange(!checked)}
      />

      {children}
    </Label>
  );
}
