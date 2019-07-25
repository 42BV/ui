import jest from 'danger-plugin-jest';
import noConsole from 'danger-plugin-no-console';
import yarn from 'danger-plugin-yarn';

export default async () => {
  await noConsole({ whitelist: ['error'] });
  await yarn({ showSuccessMessage: true });
  await jest();
};
