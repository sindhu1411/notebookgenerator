# NB Heart Disease

Next.js web app for cleaning and visualizing the Kaggle heart disease dataset with an in-app notebook tutorial and static deployment support.

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
- Site URL: `https://sindhu1411.github.io/notebookgenerator`
- NB Heart Disease: `https://sindhu1411.github.io/notebookgenerator/tutorial`

## Deployment

For GitHub Pages static export:

```bash
NEXT_PUBLIC_SITE_URL=https://sindhu1411.github.io/notebookgenerator \
NEXT_PUBLIC_BASE_PATH=/notebookgenerator \
npm run build
```

For a VM or cloud server with PM2:

```bash
npm run build
pm2 start npm --name nb-heart-disease -- start
```

For Vercel:

- Import the GitHub repo
- Leave `NEXT_PUBLIC_BASE_PATH` empty
- Set `NEXT_PUBLIC_SITE_URL` to the final deployed origin
