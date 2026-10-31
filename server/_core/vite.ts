import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

// Qorunmatı static fayl servisi (production)
// __dirname CJS bundle-də directory-nin özünü qaytarır
const DIST_PUBLIC = path.resolve(__dirname, "../../dist/public");

export function serveStatic(app: Express) {
  if (!fs.existsSync(DIST_PUBLIC)) {
    console.error(
      `[serveStatic] Build directory not found: ${DIST_PUBLIC}. Run \`pnpm build\` first.`
    );
  }

  app.use(express.static(DIST_PUBLIC));

  app.get("/404", (_req, res) => {
    res.status(404).sendFile(path.join(DIST_PUBLIC, "index.html"));
  });

  app.use("*", (_req, res) => {
    res.sendFile(path.join(DIST_PUBLIC, "index.html"));
  });
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "../../client/index.html"
      );

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}
