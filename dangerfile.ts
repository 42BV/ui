import jest from 'danger-plugin-jest';
import yarn from 'danger-plugin-yarn';

export default async () => {
  await yarn();
  await jest({ showSuccessMessage: true });
};
