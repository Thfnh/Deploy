// T123-195: local HTTP simulation of configured rewrites + filesystem precedence.
// This validates the built files/config; it is NOT a live Vercel deployment test.
// Run after: npm --prefix frontend run build
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const config = JSON.parse(await fs.readFile(path.join(root, 'frontend/vercel.json'), 'utf8'));
assert.notEqual(config.cleanUrls, true, 'index.html fallback requires cleanUrls to remain disabled');
const dist = path.join(root, 'frontend/dist');
const index = await fs.readFile(path.join(dist, 'index.html'));
const rules = config.rewrites.map(({source,destination}) => ({ pattern:new RegExp(`^${source}$`), destination }));
const mime = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.png':'image/png', '.svg':'image/svg+xml' };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let filename = path.resolve(dist, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!filename.startsWith(dist + path.sep)) { response.writeHead(404).end(); return; }
    let exists = await fs.stat(filename).then(s=>s.isFile()).catch(()=>false);
    if (!exists) {
      const rule = rules.find(rule=>rule.pattern.test(pathname));
      if (rule) {
        filename = path.join(dist, rule.destination);
        exists = await fs.stat(filename).then(s=>s.isFile()).catch(()=>false);
      }
    }
    if (!exists) { response.writeHead(404, {'Content-Type':'text/plain'}).end('Not found'); return; }
    response.writeHead(200, {'Content-Type':mime[path.extname(filename)]||'application/octet-stream'});
    response.end(await fs.readFile(filename));
  } catch { response.writeHead(500).end('Local routing check failed'); }
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
try {
  const base = `http://127.0.0.1:${server.address().port}`;
  const checks = [];
  for (const route of ['/', '/login', '/login?redirect=%2Fbooking%3FfieldId%3D1', '/register',
    '/register/verify-otp', '/forgot-password', '/forgot-password/verify-otp',
    '/fields', '/fields/1/reviews', '/booking?fieldId=1&date=2099-01-01', '/admin/customers/2']) {
    const response = await fetch(base+route, {redirect:'manual'});
    assert.equal(response.status,200,route);
    assert.equal(response.headers.get('location'),null, 'Must rewrite without redirecting '+route);
    assert.ok(response.headers.get('content-type').includes('text/html'));
    assert.deepEqual(Buffer.from(await response.arrayBuffer()),index,route);
    checks.push({route,status:200,result:'PASS',type:'SPA entry without redirect'});
  }
  const assets = (await fs.readdir(path.join(dist,'assets'))).filter(name=>/\.(js|css|png)$/.test(name));
  assert.ok(assets.some(name=>name.endsWith('.js')) && assets.some(name=>name.endsWith('.css')));
  for (const name of assets) {
    const route = '/assets/'+name;
    const response = await fetch(base+route);
    assert.equal(response.status,200,route);
    assert.equal(response.headers.get('content-type'),mime[path.extname(name)]);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()),await fs.readFile(path.join(dist,'assets',name)),route);
    checks.push({route,status:200,result:'PASS',type:'Existing static asset preserved'});
  }
  for (const route of ['/api', '/api/auth/login', '/api/admin/customers']) {
    const response = await fetch(base+route);
    assert.equal(response.status,404,route);
    assert.ok(!response.headers.get('content-type')?.includes('text/html'));
    checks.push({route,status:404,result:'PASS',type:'API excluded from HTML fallback'});
  }
  const workflow = await fs.readFile(path.join(root,'.github/workflows/sync-frontend.yml'),'utf8');
  assert.ok(workflow.includes('source/frontend/ fork/frontend/'), 'Vercel config must travel with the synced frontend');
  const output = path.join(root,'docs/T123-195-evidence');
  await fs.mkdir(output,{recursive:true});
  await fs.writeFile(path.join(output,'checks.json'),JSON.stringify({
    scope:'Local HTTP simulation of vercel.json using built frontend; not Vercel cloud runtime',
    passed:checks.length,checks,
  },null,2)+'\n');
  console.log(`PASS: ${checks.length} built frontend routing/asset/API checks; config included in frontend sync`);
} finally {
  server.closeAllConnections();
  await new Promise(resolve=>server.close(resolve));
}
