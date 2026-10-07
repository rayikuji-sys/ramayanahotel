import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
const files=fs.readdirSync('components/hotel').filter(f=>f.endsWith('.tsx')&&!['admin.tsx','events-admin.tsx','planner-admin.tsx','language-provider.tsx','motion-effects.tsx','cursor-flower.tsx','detail-icon.tsx','dialog.tsx'].includes(f)).map(f=>'components/hotel/'+f);
files.push('app/[section]/page.tsx','app/not-found.tsx');
const report=[];
for(const file of files){
 let source=fs.readFileSync(file,'utf8');if(source.includes('LocalizedText as T'))continue;
 if(file.endsWith('site-shell.tsx')){source=source.replace("import {MotionEffects}","import {LanguagePicker} from './language-provider';\nimport {MotionEffects}");source=source.replace('<div className="header-actions">','<div className="header-actions"><LanguagePicker/>');}
 const tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX),edits=[];
 function visit(node){
  if(ts.isJsxElement(node)&&node.openingElement.tagName.getText(tree)==='option'&&!node.openingElement.attributes.properties.some(p=>ts.isJsxAttribute(p)&&p.name.text==='value')){
   const raw=node.children.map(c=>c.getText(tree)).join('');
   const value=node.children.length===1&&ts.isJsxExpression(node.children[0])?node.children[0].getText(tree):JSON.stringify(raw.trim());
   edits.push([node.openingElement.tagName.end,node.openingElement.tagName.end,' value='+value]);
  }
  if(ts.isJsxText(node)&&node.getText(tree).trim()){
   const start=node.pos,end=node.end;edits.push([start,end,'<T>'+source.slice(start,end)+'</T>']);
  }else if(ts.isJsxExpression(node)&&node.expression&&(ts.isJsxElement(node.parent)||ts.isJsxFragment(node.parent))){
   const expression=node.expression;
   const simple=ts.isIdentifier(expression)||ts.isPropertyAccessExpression(expression)||ts.isElementAccessExpression(expression)||ts.isStringLiteral(expression)||ts.isTemplateExpression(expression)||ts.isNoSubstitutionTemplateLiteral(expression);
   if(simple)edits.push([node.getStart(tree),node.end,'<T>'+node.getText(tree)+'</T>']);
  }
  ts.forEachChild(node,visit);
 }
 visit(tree);
 if(!edits.length)continue;
 fs.mkdirSync('.local/i18n-backup',{recursive:true});fs.writeFileSync(path.join('.local/i18n-backup',file.replaceAll('/','__')),fs.readFileSync(file));
 for(const [start,end,value] of edits.sort((a,b)=>b[0]-a[0]))source=source.slice(0,start)+value+source.slice(end);
 const directive=source.match(/^['"]use client['"];?\r?\n/);
 const at=directive?directive[0].length:0;
 source=source.slice(0,at)+"import {LocalizedText as T} from '@/components/hotel/language-provider';\n"+source.slice(at);
 fs.writeFileSync(file,source);report.push({file,textNodes:edits.length});
}
console.log(JSON.stringify(report));
