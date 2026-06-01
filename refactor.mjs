import fs from 'fs';

const file = fs.readFileSync('server.ts', 'utf-8');

// Replace standard Express setup inside startServer
let out = file.replace(/async function startServer\(\) \{/, 'export const app = express();\nasync function startServer() {\n');
// We change startServer to NOT create `app` inside, but just setup routes
out = out.replace(/  const app = express\(\);\n/, '');

// Change the listen block to only run if not Vercel
out = out.replace(/  app\.listen\(PORT, "0\.0\.0\.0", \(\) => \{\n    console\.log\(`OmniNexa Quantum AI Server executing locally on port \$\{PORT\}`\);\n  \}\);/, `  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(\`OmniNexa Quantum AI Server executing locally on port \${PORT}\`);
    });
  }`);

// Add default export at the bottom
out += "\nexport default app;\n";

fs.writeFileSync('server.ts', out);
console.log('Refactored server.ts');
