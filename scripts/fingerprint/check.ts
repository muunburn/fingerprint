import * as Fingerprint from '@expo/fingerprint';
import chalk from 'chalk';
import { readFileSync } from 'fs-extra';
import path from 'node:path';

import { stdOutLog } from '../stdOutLog';

import appVersion from '~/app-version.json';

(async () => {
  const currentFingerprint = await Fingerprint.createFingerprintAsync(process.cwd());

  if (appVersion.hash === currentFingerprint.hash) {
    stdOutLog(`✅ ${chalk.bold('runtimeVersion')} in app-version.json matches the current project fingerprint`);
    process.exit(0);
  }

  const fingerprintPath = path.join(process.cwd(), '.fingerprint', `${appVersion.hash}.json`);

  try {
    // @ts-ignore
    const previousFingerprint = JSON.parse(readFileSync(fingerprintPath));
    stdOutLog(JSON.stringify(Fingerprint.diffFingerprints(previousFingerprint, currentFingerprint), null, 2));
  } catch {
    stdOutLog(`Unable to read previous fingerprint data at ${fingerprintPath}, skipped diff.`);
  }

  stdOutLog('');
  stdOutLog(' ---------------------------------------- ');
  stdOutLog('');
  stdOutLog(`Fingerprint changed. See diff above, run ${chalk.bold('npm run fingerprint:set')} to update it.`);
  stdOutLog('');
  stdOutLog(`${chalk.bold(chalk.yellow(appVersion.hash))} → ${chalk.bold(chalk.green(currentFingerprint.hash))}`);
  stdOutLog('');
  process.exit(-1);
})();
