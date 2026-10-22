// postinstall 补丁：让 `npx cap add ios` 默认生成 SPM 工程而不是 CocoaPods 工程。
//
// 背景：仓库的 CI 流程文件（.github/workflows/build-ios.yml）按项目固定，
// 编译命令是 `xcodebuild -project ios/App/App.xcodeproj`。CocoaPods 工程里
// Pods 只挂在 .xcworkspace 上，单工程编译原理上过不了；而 Capacitor 7 的
// SPM 工程把 CapApp-SPM 本地包直接放进 .xcodeproj，正好适配这条命令。
// CLI 本身支持 `--packagemanager SPM`，但流程里调用的是无参数的
// `npx cap add ios`，且 config 没有对应的配置键，所以在这里把 CLI 的
// 默认选择改成 SPM —— 等价于每次都带上那个参数。
//
// 补丁只作用于 node_modules 内的 @capacitor/cli（版本已被 package-lock 锁死
// 为 7.6.9），匹配不到原文时只警告、绝不让 npm install 失败。

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const target = join(root, 'node_modules', '@capacitor', 'cli', 'dist', 'index.js');

function main() {
    if (!existsSync(target)) {
        console.warn('[patch-cap-cli-spm] 未找到 @capacitor/cli，跳过');
        return;
    }
    let src = readFileSync(target, 'utf8');
    if (src.includes('/* folia-spm-patch */')) {
        console.log('[patch-cap-cli-spm] 已打过补丁，跳过');
        return;
    }

    // 改动 1：add 命令里切换模板包的条件。原逻辑仅在显式传 --packagemanager SPM
    // 时才把模板换成 ios-spm-template.tar.gz，改为恒定切换。
    const tplFrom = "if (packagemanager === 'SPM') {";
    const tplTo = 'if (true) { /* folia-spm-patch */';
    if (!src.includes(tplFrom)) {
        console.warn('[patch-cap-cli-spm] 模板切换点未匹配，跳过');
        return;
    }
    src = src.replace(tplFrom, tplTo);

    // 改动 2：getPackageManager 的兜底返回。原逻辑无参数时返回 'Cocoapods'，
    // 改为返回 'SPM'，使 add 后续流程按 SPM 处理（写 Package.swift 等）。
    const gpmFrom = [
        'async function getPackageManager(config, packageManager) {',
        "    if (packageManager === 'SPM') {",
        "        return 'SPM';",
        '    }',
    ].join('\n');
    if (!src.includes(gpmFrom)) {
        console.warn('[patch-cap-cli-spm] getPackageManager 未匹配，跳过');
        return;
    }
    // 只替换该函数体内的兜底返回：定位函数起点后找其后第一个 return 'Cocoapods'
    const fnStart = src.indexOf(gpmFrom);
    const retIdx = src.indexOf("return 'Cocoapods';", fnStart);
    if (retIdx === -1) {
        console.warn('[patch-cap-cli-spm] 兜底返回未匹配，跳过');
        return;
    }
    src = src.slice(0, retIdx) + "return 'SPM';" + src.slice(retIdx + "return 'Cocoapods';".length);

    writeFileSync(target, src);
    console.log('[patch-cap-cli-spm] 已把 cap add ios 默认改为 SPM 工程');
}

try {
    main();
} catch (err) {
    console.warn('[patch-cap-cli-spm] 补丁异常（忽略）:', err?.message ?? err);
}
