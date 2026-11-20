import { launch } from 'puppeteer';

const port = 4173;
const url = `http://127.0.0.1:${port}`;
const server = Bun.spawn(
  ['bun', 'run', '--cwd', 'apps/web', 'vite', '--host', '127.0.0.1', '--port', String(port)],
  {
    stderr: 'pipe',
    stdout: 'pipe',
  },
);

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The development server is still starting.
    }

    await Bun.sleep(250);
  }

  throw new Error(`Vite server did not start at ${url}`);
}

try {
  await waitForServer();

  const browser = await launch({
    args: [
      '--disable-breakpad',
      '--disable-crash-reporter',
      '--disable-crashpad',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--noerrdialogs',
    ],
    headless: 'shell',
    userDataDir: `/tmp/puppeteer-smoke-${process.pid}`,
  });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    const heading = await page.$eval('h1', (element) => element.textContent);
    if (heading !== 'Nx + Vite + Vercel') {
      throw new Error(`Unexpected heading: ${heading}`);
    }

    console.log(`Puppeteer smoke test passed at ${url}`);
  } finally {
    await browser.close();
  }
} finally {
  server.kill();
}
