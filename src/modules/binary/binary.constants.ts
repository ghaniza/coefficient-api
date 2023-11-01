export enum BinaryTarget {
  WINDOWS = 'windows',
  LINUX = 'linux',
  DARWIN = 'darwin',
}

export enum BinaryArch {
  X86_64 = 'x86_64',
  I686 = 'i686',
  AARCH64 = 'aarch64',
  ARMV7 = 'armv7',
}

export const SEMVER_REGEX =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
