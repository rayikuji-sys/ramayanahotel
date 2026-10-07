import { writeFileSync } from 'node:fs';
writeFileSync('package.json', JSON.stringify({
name:'ramayana-hotel',version:'1.0.0',private:true,type:'module',engines:{node:'>=22.13.0'},
scripts:{dev:'next dev --webpack -p 3000',build:'next build --webpack',start:'next start -p 3000',lint:'eslint app components/hotel lib tests',typecheck:'tsc --noEmit',test:'node --experimental-strip-types --test tests/backend.test.ts','test:e2e':'playwright test','db:seed':'node --experimental-strip-types scripts/seed.ts','admin:create':'node --experimental-strip-types scripts/create-admin.ts'},
dependencies:{next:'16.3.5',react:'19.2.6','react-dom':'19.2.6','lucide-react':'^1.31.0',zod:'^3.25.76',sharp:'^0.35.4'},
devDependencies:{'@types/node':'^22.19.19','@types/react':'^19.2.14','@types/react-dom':'^19.2.3',typescript:'5.9.3',eslint:'9.39.4','eslint-config-next':'16.3.5','@playwright/test':'^1.58.2','@axe-core/playwright':'^4.11.1'}
}, null, 2));
writeFileSync('tsconfig.json', JSON.stringify({compilerOptions:{target:'ES2022',lib:['dom','dom.iterable','esnext'],skipLibCheck:true,strict:true,noEmit:true,esModuleInterop:true,module:'esnext',moduleResolution:'bundler',resolveJsonModule:true,isolatedModules:true,jsx:'react-jsx',incremental:true,allowImportingTsExtensions:true,plugins:[{name:'next'}],paths:{'@/*':['./*']},types:['node']},include:['next-env.d.ts','app/**/*.ts','app/**/*.tsx','components/hotel/**/*.tsx','components/hotel/**/*.ts','lib/**/*.ts','tests/**/*.ts','.next/types/**/*.ts','.next/dev/types/**/*.ts'],exclude:['node_modules']},null,2));
writeFileSync('postcss.config.mjs','export default {plugins:{}};\n');
