module.exports = {
  apps: [
    {
      name: "vipra-webapp",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 3001
      },
      exp_backoff_restart_delay: 100,
      watch: false,
      max_memory_restart: "1G"
    }
  ]
};

