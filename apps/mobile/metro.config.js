// Expo + pnpm 모노레포용 Metro 설정.
// 워크스페이스 패키지를 watchFolders에 추가하고, 심볼릭 링크 + node_modules 해상도를 모노레포 친화적으로 잡는다.

const { getDefaultConfig } = require('expo/metro-config');
const path = require('node:path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 워크스페이스 패키지 변경도 감시
config.watchFolders = [workspaceRoot];

// 패키지 해상도: 앱 자체 → 워크스페이스 루트 순으로
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// pnpm 심볼릭 링크 해상도
config.resolver.disableHierarchicalLookup = true;
config.resolver.unstable_enableSymlinks = true;

module.exports = config;
