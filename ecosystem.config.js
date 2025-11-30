module.exports = {
  apps: [{
    name: "khandak",
    cwd: "/var/www/khandak-admin-panel",
    script: "npm",
    args: "start",
    env: {
      NODE_ENV: "production",
      PORT: "1337"
    }
  }]
}
