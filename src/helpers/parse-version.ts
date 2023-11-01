import { SEMVER_REGEX } from '../modules/binary/binary.constants';
import type { SemverDTO } from '../../types/semver';

const parseVersion = (version: string): SemverDTO => {
  const semver: any = {};
  const regex = new RegExp(SEMVER_REGEX);

  const tags = ['major', 'minor', 'patch', 'release', 'build'];
  const match = regex.exec(version);

  for (let i = 0; i < tags.length; i++) {
    if (match[i + 1]) {
      if (tags[i] === 'release' || tags[i] === 'build')
        semver[tags[i]] = match[i + 1];
      else semver[tags[i]] = +match[i + 1];
    }
  }

  return semver;
};

export default parseVersion;
