// 打包时构建本地版前端并内置进 www/：克隆 folia-major 的 local-only 分支（不注册任何
// 在线音源的版本），npm ci + build 后把 dist 拷进 www，Capacitor 随 App 一起打包。
// 任一步失败都让整个构建失败，避免打出只有兜底页的空壳。
import { execSync } from 'node:child_process';
import { cpSync, existsSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, '.frontend-src');
const repo = 'https://github.com/zhy976073500-cyber/folia-major.git';
const branch = 'local-only';

const run = (cmd, cwd) => {
    console.log(`[build-frontend] ${cmd}`);
    execSync(cmd, { cwd, stdio: 'inherit' });
};

rmSync(srcDir, { recursive: true, force: true });
run(`git clone --depth 1 --single-branch --branch ${branch} ${repo} "${srcDir}"`, root);
run('npm ci --no-audit --no-fund', srcDir);
run('npm run build', srcDir);

const dist = path.join(srcDir, 'dist');
if (!existsSync(path.join(dist, 'index.html'))) {
    throw new Error('[build-frontend] frontend build did not produce dist/index.html');
}
const www = path.join(root, 'www');
rmSync(www, { recursive: true, force: true });
cpSync(dist, www, { recursive: true });
console.log('[build-frontend] frontend bundled into www/');
