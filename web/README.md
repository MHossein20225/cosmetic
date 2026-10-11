This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker deployment

The Compose deployment publishes port 3000 through its Nginx `proxy` service. The `web` service is not published directly. Nginx replaces `X-Forwarded-For` with the address of its TCP peer, and the app trusts that header only on the private Compose edge network. Connect clients directly to the published Nginx port for per-client IP rate limits.

If another load balancer, CDN, or reverse proxy is placed in front of Compose, Nginx will see that proxy's address. Configure Nginx real-IP handling only for explicitly trusted upstream proxy address ranges before expecting it to recover end-user addresses; do not forward an untrusted `X-Forwarded-For` chain as authoritative. Direct `next dev` and standalone Dockerfile runs do not enable proxy trust and will use the shared `unknown` IP bucket until placed behind a similarly configured trusted proxy.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
