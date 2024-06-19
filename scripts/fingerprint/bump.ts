import * as Fingerprint from '@expo/fingerprint';
import JsonFile from '@expo/json-file';
import chalk from 'chalk';
import { ensureDir, ensureFile, writeJson } from 'fs-extra';
import path from 'node:path';

import { stdOutLog } from '../stdOutLog';

(async () => {
  const fingerprintCacheDir = path.join(process.cwd(), '.fingerprint');
  await ensureDir(fingerprintCacheDir);
  const { sources, hash } = await Fingerprint.createFingerprintAsync(process.cwd());

  const fingerprintJsonFile = path.join(fingerprintCacheDir, `${hash}.json`);
  await ensureFile(fingerprintJsonFile);
  await writeJson(fingerprintJsonFile, { sources, hash });

  const appConfigFile = new JsonFile(path.join(process.cwd(), 'app-version.json'));
  const config = await appConfigFile.readAsync();

  await appConfigFile.writeAsync({
    ...config,
    hash,
  });
  stdOutLog(
    `🏃Updated ${chalk.bold('runtimeVersion')} to ${chalk.bold(hash)} in app-version.json`
  );
  stdOutLog(`🗂️Saved full fingerprint to ${fingerprintJsonFile}`);
})();
