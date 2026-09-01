const { spawn } = require('child_process');

console.log('🚀 Starting anti-portfolio (Backend with auto-watch & Frontend)...\n');

const server = spawn('node', ['--watch', 'index.js'], {
  cwd: './server',
  stdio: 'inherit',
  shell: true,
});

const client = spawn('npm', ['run', 'dev'], {
  cwd: './client',
  stdio: 'inherit',
  shell: true,
});

const cleanup = () => {
  console.log('\n🛑 Shutting down server and client...');
  server.kill();
  client.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
