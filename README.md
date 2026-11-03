# RS Printer Store

## Run with Docker Compose

Requirements: Docker Engine and the Docker Compose plugin on your VM.

1. Copy `.env.example` to `.env` and set your Telegram bot token and group chat ID if you want Telegram order notifications.
2. From this directory, build and start the production app:

   ```sh
   docker compose up -d --build
   ```

3. Open `http://YOUR_VM_PUBLIC_IP:3000`. Make sure the VM firewall allows inbound TCP traffic on port `3000`.

Useful commands:

```sh
docker compose logs -f app
docker compose ps
docker compose down
```

The app listens on port `3000` inside the container. For a public production website, put a reverse proxy such as Caddy or Nginx in front of it to provide HTTPS, and allow inbound web traffic through the VM firewall.
