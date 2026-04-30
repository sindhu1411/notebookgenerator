# Notebook Data Studio

Next.js web app for switching between heart disease and fake-job notebook demos, with static export support and a VM/PM2 deployment path.

## Local run

```bash
npm install
npm run build
npm run dev
```

## Dataset

- Source schema: Kaggle heart disease dataset based on the Cleveland/UCI 14-column format
- Local file: [`lib/heart.csv`](/Users/sindhu/Documents/week9/JANA/lib/heart.csv)

## URLs

- GitHub repo: `https://github.com/sindhu1411/notebookgenerator`
- VM Site URL: `http://172.20.122.71:8680`
- Heart tutorial: `http://172.20.122.71:8680/tutorial`
- Fake job site: `http://172.20.122.71:8680/?dataset=fake-job`
- Fake job tutorial: `http://172.20.122.71:8680/tutorial?dataset=fake-job`

## Deployment

For GitHub Pages static export:

```bash
NEXT_PUBLIC_SITE_URL=https://sindhu1411.github.io/notebookgenerator \
NEXT_PUBLIC_BASE_PATH=/notebookgenerator \
npm run build
```

For a VM or cloud server with PM2:

```bash
NEXT_PUBLIC_SITE_URL=http://172.20.122.71:8680 npm run build
npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Manual PM2 alternative:

```bash
npm run build
PORT=8680 HOSTNAME=0.0.0.0 NEXT_PUBLIC_SITE_URL=http://172.20.122.71:8680 \
pm2 start npm --name notebook-data-studio -- start
```

For Vercel:

- Import the GitHub repo
- Leave `NEXT_PUBLIC_BASE_PATH` empty
- Set `NEXT_PUBLIC_SITE_URL` to the final deployed origin
