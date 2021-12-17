module.exports = {
  apps: [
    {
      name: "quiet-server",
      script: "dist/app.js",
      instances: 1,
      exec_mode: "fork",
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
    },
  ],
};
