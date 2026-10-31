# EcoPulse — Qarabağın ekoloji nəbzi

NASA Space Apps Challenge 2026 (Gəncə) üçün şagird və tələbələrə yönəlmiş interaktiv ekoloji təlim prototipi.

React / Express / tRPC / Drizzleスター ✨ (frontend demo prototip).

- `pnpm dev`: development server; honors `PORT` (default 3000).
- `pnpm build` / `pnpm start`: build and serve `dist/index.js` and `dist/public/`.
- `pnpm db:migrate`: apply checked-in migrations. `pnpm db:push`: generate and apply new schema changes.
- `pnpm check` / `pnpm test`: types and application tests.

## Hesabat

Ətraf trafikdən arındırılmış, yalnız EcoPulse frontend core-qalıntısı saxlanmışdır. Manus platforma xidmətlərindən (OAuth, Forge storage, bildiriş, Google Maps proxy, heartbeat, LLM,image generation, voice transcription) bütün əlaqələrایان koda və konfiqurasiya silinib.

Backend auth-demo rejimində işləyir (real JWT sessiyası yoxdur). Veritabanı `DATABASE_URL` təyin olunmayıanda MySQL, əks hallədə bellek içi (in-memory) fallback işləyər.
