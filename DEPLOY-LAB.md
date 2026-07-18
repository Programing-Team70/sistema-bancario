# Despliegue Lab — Banco King (stack oficial)

Stack requerido por el curso:

| Servicio | Carpeta | Plataforma | Base de datos |
|----------|---------|------------|---------------|
| Auth (.NET) | `BancoKing/authentication-service/auth-service` | **Railway** | Supabase PostgreSQL |
| Core Bank (Node) | `BancoKing/core_bank_service` | **Vercel** | Supabase PostgreSQL |
| Frontend (React) | `BancoKing/bank_client_web` | **Firebase Hosting** | — |
| MongoDB | — | **Atlas** | Solo si el catedrático lo exige aparte* |

\* Este repositorio usa **PostgreSQL** (no Mongo). Si el lab pide Atlas, crea un cluster vacío para cumplir el requisito documental; la app no lo usa hoy.

---

## Progreso estimado

| Fase | Responsable | Estado |
|------|-------------|--------|
| Configs en código (Dockerfile, vercel.json, firebase.json, env examples) | Agente / repo | ✅ Listo en rama `deploy/lab-stack` |
| Cuentas Supabase + Railway + Vercel + Firebase + Brevo | **Tú** | 🟡 Supabase listo |
| Despliegue y variables de entorno | **Tú** (+ Wilson en Railway si ayuda) | ⬜ Pendiente |
| Prueba end-to-end (login → cuenta → depósito) | **Tú / Otto (video)** | ⬜ Pendiente |

**Progreso global del lab stack: ~30%**  
(La stack anterior Render/Vercel/Neon estaba ~75% funcional; hay que migrar a las plataformas nuevas.)

---

## URLs que vas a obtener

Anota aquí cuando las tengas:

```
SUPABASE:     https://supabase.com/dashboard/project/dgkogmfjvrvbwucgitrh
RAILWAY AUTH: https://________________.up.railway.app
VERCEL CORE:  https://________________.vercel.app
FIREBASE WEB: https://________________.web.app
```

---

# PARTE 1 — SOLO TÚ (cuentas y credenciales)

## 1. Supabase (PostgreSQL) — ~10 min

1. Entra a [supabase.com](https://supabase.com) → **New project**.
2. Nombre: `banco-king` (o similar). Región cercana. Guarda la **database password**.
3. Ve a **Project Settings → Database → Connection string → URI** (modo **Session**, puerto 5432).
4. Copia la URI. Se ve así:
   ```
   postgresql://postgres.[ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres
   ```
5. En **Database → Settings**, activa **SSL** (viene por defecto en cloud).

**Guarda:** URI completa + password. La usarás en Railway y Vercel.

---

## 2. Railway (.NET Auth) — ~15 min

1. [railway.app](https://railway.app) → Login con GitHub.
2. **New Project → Deploy from GitHub repo** → `Programing-Team70/sistema-bancario`.
3. Rama: **`deploy/lab-stack`**.
4. **Settings → Root Directory:**
   ```
   BancoKing/authentication-service/auth-service
   ```
5. Railway detectará el `Dockerfile` y `railway.toml`.
6. **Variables** — copia desde `railway.env.example` y reemplaza valores:

   | Variable | Valor |
   |----------|-------|
   | `ConnectionStrings__DefaultConnection` | URI Supabase en formato Npgsql (ver abajo) |
   | `JwtSettings__SecretKey` | `$ecretKeyForKingProgramingTeam70` |
   | `JwtSettings__Issuer` | `BancoKing` |
   | `JwtSettings__Audience` | `BancoKing` |
   | `AppSettings__FrontendUrl` | URL Firebase (la pones después del paso 4) |
   | `Security__AllowedOrigins__0` | Misma URL Firebase |
   | `Email__Provider` | `Brevo` |
   | `Brevo__ApiKey` | Tu API key de Brevo |
   | `Brevo__FromEmail` | Email verificado en Brevo |
   | `Brevo__FromName` | `Banco King` |

   **Connection string para .NET (ejemplo):**
   ```
   Host=db.xxxxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=TU_PASSWORD;SSL Mode=Require;Trust Server Certificate=true
   ```

7. **Settings → Networking → Generate Domain** → copia la URL pública.
8. Prueba: abre `https://TU-URL.up.railway.app/health` → debe responder JSON `"Saludable"`.

> Railway aplica migraciones EF al arrancar (crea tablas + admin seed).

**Admin por defecto:** `ADMINB` / `ADMINB` (o `admin@banco.com`)

---

## 3. Vercel (Node Core Bank) — ~10 min

1. [vercel.com](https://vercel.com) → **Add New Project** → mismo repo GitHub.
2. Rama: **`deploy/lab-stack`**.
3. **Root Directory:** `BancoKing/core_bank_service`
4. Framework: **Other** (Node serverless vía `vercel.json`).
5. **Environment Variables:**

   | Variable | Valor |
   |----------|-------|
   | `DATABASE_URL` | URI Supabase completa (Session, 5432) |
   | `SECRET_KEY` | `$ecretKeyForKingProgramingTeam70` |
   | `JWT_ISSUER` | `BancoKing` |
   | `JWT_AUDIENCE` | `BancoKing` |
   | `AUTH_SERVICE_URL` | `https://TU-RAILWAY.up.railway.app/api/v1` |

   Alternativa sin `DATABASE_URL`: usa `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSL=true` (ver `.env.example`).

6. Deploy → copia la URL del proyecto.
7. Prueba: `https://TU-PROYECTO.vercel.app/test` → `"BancoKing Online"`.

---

## 4. Firebase (React Frontend) — ~15 min

1. [console.firebase.google.com](https://console.firebase.google.com) → **Add project** → `banco-king` (o similar).
2. **Build → Hosting → Get started**.
3. En tu PC (PowerShell):

   ```powershell
   npm install -g firebase-tools
   firebase login
   cd "c:\Users\jef3r\OneDrive\Documentos\proyectos\sistema-bancario\BancoKing\bank_client_web"
   ```

4. Edita `.firebaserc` — reemplaza `TU-FIREBASE-PROJECT-ID` con el ID real del proyecto Firebase.

5. Crea `.env.production` (NO lo subas a git):

   ```env
   VITE_AUTH_URL=https://TU-RAILWAY.up.railway.app/api/v1
   VITE_CORE_BANK_SERVICE_URL=https://TU-VERCEL.vercel.app/api
   ```

6. Build y deploy:

   ```powershell
   pnpm install
   pnpm deploy:firebase
   ```

7. Copia la URL: `https://tu-proyecto.web.app`

8. **Vuelve a Railway** y actualiza:
   - `AppSettings__FrontendUrl`
   - `Security__AllowedOrigins__0`
   - (Opcional) `Security__AllowedOrigins__1` = `https://tu-proyecto.firebaseapp.com`

   Redeploy Railway después de cambiar CORS.

---

## 5. Brevo (correos) — ~5 min (si no lo tienes)

1. [brevo.com](https://www.brevo.com) → cuenta free.
2. **Senders** → verifica tu email (`jef3rson123@gmail.com`).
3. **SMTP & API → API Keys** → crea key → ponla en Railway como `Brevo__ApiKey`.

---

## 6. MongoDB Atlas (solo si el lab lo pide en entrega)

1. [mongodb.com/atlas](https://www.mongodb.com/atlas) → cluster free M0.
2. Anota la connection string en el README del informe.
3. **No hace falta conectarlo** a Banco King (este proyecto usa PostgreSQL).

---

# PARTE 2 — Verificación final

Checklist cuando todo esté desplegado:

- [ ] `GET /health` en Railway → OK
- [ ] `GET /test` en Vercel → OK
- [ ] Firebase abre la página de login
- [ ] Login admin `ADMINB` / `ADMINB` funciona (espera ~30s si Railway estaba dormido)
- [ ] Registrar usuario → llega correo Brevo → verificar → login
- [ ] Cuentas → Nueva Cuenta (selector de usuario) → crear cuenta
- [ ] Depósito y transferencia básica

---

# PARTE 3 — Errores comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Credenciales incorrectas | Railway dormido o usuario no verificado | Esperar 60s, verificar email |
| Token no válido | JWT distinto entre servicios | Mismo `SECRET_KEY` / `JwtSettings__SecretKey` |
| CORS blocked | Frontend URL no en Railway | Agregar URL Firebase en `Security__AllowedOrigins__0` |
| Error validar usuario .NET | Usuario inactivo o ID incorrecto | Verificar correo; usar selector de usuario en modal |
| Core Bank 500 DB | Supabase mal configurado | Revisar `DATABASE_URL` y SSL |

---

# PARTE 4 — Wilson (Docker local, opcional)

Wilson puede seguir usando Docker con `BancoKing/postgre_db/docker-compose.yml` en local.  
Para producción del lab, la BD es **Supabase**, no el contenedor local.

---

# PARTE 5 — Otto (video)

Grabar en **modo incógnito** con las URLs de producción:

1. Login admin
2. Crear usuario
3. Verificar correo (mostrar inbox)
4. Crear cuenta bancaria
5. Depósito
6. Transferencia

---

## Orden recomendado (no saltarse pasos)

```
1. Supabase
2. Railway (auth) — probar /health
3. Vercel (core) — probar /test
4. Firebase (frontend) — build con URLs correctas
5. Actualizar CORS en Railway con URL Firebase
6. Probar flujo completo
```

---

## Rama de despliegue

Todo el código de config está en: **`deploy/lab-stack`**

```powershell
git fetch origin
git checkout deploy/lab-stack
```

Cuando el lab esté estable, se puede mergear a `main`.
