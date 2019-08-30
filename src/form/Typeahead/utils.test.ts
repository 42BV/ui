import { valueToTypeaheadOption } from './utils';

interface User {
  id: number;
  name: string;
}

test('valueToTypeAheadOption', () => {
  const user: User = {
    id: 1,
    name: 'Maarten Hus'
  };

  const optionFor = (v: User) => v.name;

  expect(valueToTypeaheadOption(user, optionFor)).toEqual({
    label: 'Maarten Hus',
    value: user
  });
});
