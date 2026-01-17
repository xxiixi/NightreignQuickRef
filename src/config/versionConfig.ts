/**
 * 黑夜君临版本配置
 * 集中管理版本信息，方便统一更新
 */

export interface VersionInfo {
  version: string;
  releaseDate: string;
}

export const NIGHTREIGN_VERSION: VersionInfo = {
  version: '1.03.4',
  releaseDate: 'Jan 16 2026'
};

export const getVersionDisplayText = (): string => {
  return `Nightreign Version ${NIGHTREIGN_VERSION.version} | ${NIGHTREIGN_VERSION.releaseDate}`;
};

export const getVersionNumber = (): string => {
  return `v${NIGHTREIGN_VERSION.version}`;
};

