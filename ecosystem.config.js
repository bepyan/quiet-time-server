module.exports = {
  apps: [
    {
      name: 'quiet-server',
      script: './dist/app.js',
      instance_var: 'INSTANCE_ID',
      instance: 0,
      exec_mode: 'cluster',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
    },
  ],
};
