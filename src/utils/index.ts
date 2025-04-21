import { Response, Express } from "express"
import fs from "fs";
import path from "path";


export const resApiUnauthorized = (res: Response) => {
    return res.status(401).json({ error: 'Unauthorized' })
}


export async function loaders(app: Express) {
    const routerPath = path.resolve(__dirname, "../routes");
    // const routes: string[] = []
    const loadRoutes = async (dir: string) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                // Rekursif jika folder
                await loadRoutes(fullPath);
            } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".js"))) {
                const modulePath = fullPath.replace(/\\/g, "/"); // biar kompatibel di Windows

                try {
                    const imported = await import(modulePath);
                    if (typeof imported.default === "function") {
                        // Panggil default export jika ada();
                        const relativePath = path.relative(routerPath, fullPath).replace(/\\/g, "/").replace('.ts', '').replace('.js', '').replace('/index', '')

                        const router = imported.default;

                        // const router = imported.default();

                        if (router && typeof router === "function" && router.stack) {
                            app.use('/' + relativePath, router);
                            console.log('PATH ' + '/' + relativePath);
                        } else {
                            console.warn(`Skipped loading ${modulePath} because it did not return a valid Router`);
                        }

                    }
                } catch (error) {
                    console.error(`Failed to load ${modulePath}:`, error);
                }
            }
        }
    };
    await loadRoutes(routerPath);

    return app
    // console.log('Routes: ',routes);
}
