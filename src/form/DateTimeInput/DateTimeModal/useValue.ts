import { useState } from 'react';
import { Moment } from 'moment';

export function useValue(defaultValue: Moment | string) {
  return useState<Moment | string>(defaultValue);
}
