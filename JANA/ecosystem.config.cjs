module.exports = {
  apps: [
    {
      name: "notebook-data-studio",
      script: "npm",
      args: "start",
      env: {
        PORT: "8680",
        HOSTNAME: "0.0.0.0",
        NEXT_PUBLIC_SITE_URL: "http://172.20.122.71:8680",
      },
    },
  ],
};
