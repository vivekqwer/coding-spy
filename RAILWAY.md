# Railway par auto-deploy (push karo → khud build ho jaye)

Railway GitHub repo se connect hone ke baad **har `git push` par khud build + deploy** kar deta hai.
Yeh project uske liye already configured hai (`railway.json`).

## Ek baar ka setup (5 minute)

1. **Railway account** banao: https://railway.app → "Login with GitHub".
2. Dashboard → **New Project** → **Deploy from GitHub repo** → `vivekqwer/coding-spy` chuno.
   - Isse repo connect ho jaata hai. **Ab jab bhi aap `master` par push karoge, Railway khud build karega.**
3. Project me **New → Database → PostgreSQL** add karo.
   - Railway khud `DATABASE_URL` variable bana dega aur app service se link kar dega.
   - Agar auto-link na ho: app service → Variables → `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`.
4. App service → **Variables** me yeh add karo:

   | Variable | Value |
   |---|---|
   | `NEXTAUTH_SECRET` | koi lamba random string (terminal: `openssl rand -base64 32`) |
   | `NEXTAUTH_URL` | aapka Railway public URL, jaise `https://coding-spy-production.up.railway.app` |
   | `ANTHROPIC_API_KEY` | (optional — AI hints/tutor ke liye) |
   | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | (optional — Google login) |
   | `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | (optional — paid courses) |
   | `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | (optional — paid courses) |

   > `DATABASE_URL` Railway khud deta hai — manually mat daalo (jab tak link na toote).

5. Settings → **Generate Domain** — public URL milega. Wahi `NEXTAUTH_URL` me daalo.

## Build/deploy kaise chalta hai (`railway.json`)

- **Build:** `npm run build`  (Nixpacks Node ko auto-detect karta hai)
- **Start:** `npx prisma migrate deploy && npm run start -- -H 0.0.0.0 -p $PORT`
  - `migrate deploy` har deploy pe DB schema ko latest migrations tak le aata hai (tables khud ban jaati hain).
- **Postinstall:** `prisma generate` (Prisma client auto-generate).

## Data seed karna (sirf pehli baar)

Migrations sirf **khaali tables** banate hain. Topics + admin user + 379 prompts daalne ke liye
ek baar seed chalao (Railway ka apne project me terminal se):

```bash
railway run npm run db:seed:all
```

Ya Railway dashboard me app service → **⋮ → Run a command** → `npm run db:seed:all`.

Iske baad admin login:
- **Email:** `admin@codingspy.dev`
- **Password:** `ChangeMe123!`  (deploy ke baad turant badal lena)

## Roz ka flow

```bash
git add -A
git commit -m "mera change"
git push origin master
```

Push karte hi Railway khud naya build banake live kar dega. Bas. ✅
