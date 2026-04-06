## Run locally

```bash
git clone https://github.com/aribah911/zealthy-emr.git
cd zealthy-emr
pnpm install
pnpm prisma db push
pnpm prisma db seed
pnpm dev
```

Open http://localhost:3000

## Notes

* Uses SQLite (no setup needed)
* Seed data is included
