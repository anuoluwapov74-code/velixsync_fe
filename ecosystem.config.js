module.exports = {
  apps: [
    {
      name: "velixsync-frontend",
      script: ".next/standalone/server.js",
      cwd: "/var/www/velixsync/frontend",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
    },
  ],
};
