import { marked } from "marked";
import hljs from "highlight.js";
import mermaid from "mermaid";
import katex from "katex";

// Configuration pour Mermaid
mermaid.initialize({
   startOnLoad: false,
   theme: "default",
   securityLevel: "loose"
});

// Configuration pour Marked
marked.setOptions({

   // Fonction pour mettre en évidence la syntaxe du code
   highlight: function(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
         return hljs.highlight(code, { language: lang }).value;
      } else {
         return hljs.highlightAuto(code).value;
      }
   },

   // Ajout de la class hljs pour le style
   langPrefix: "hljs language-"
});


/**
 * Conversion d'un string en laTeX
 *
 * @param tex
 * @return {any|string}
 */
function katexRender(tex) {
   try {
      // Rendu de la formule LaTeX en HTML
      return katex.renderToString(tex, {
         displayMode: false,
         throwOnError: false,
         errorColor: "#ff0000"
      });
   } catch (error) {
      console.error(error);
      return "";
   }
}

/**
 * Conversion du Markdown en HTML avec Mermaid, KaTeX, Marked et Highlight.js
 *
 * @param markdown
 * @return {*|Promise<*>}
 */
export function renderMarkdown(markdown) {

   // Transformer les diagrammes Mermaid
   let html = markdown.replace(/```mermaid([\s\S]*?)```/gi, function(match, mermaidCode) {
      try {
         // Rendu du diagramme Mermaid en SVG
         return mermaid.render("mermaid-svg", mermaidCode);
      } catch (error) {
         // En cas d'erreur, afficher un message d'erreur
         return "<div class='mermaid-error'>" + error + "</div>";
      }
   });

   // Transformer les blocs de formules mathématiques en utilisant KaTeX
   // Rendu de KaTeX pour les doubles $
   html = html.replace(/\$\$(.*?)\$\$/gs, function(match, tex) {
      return katexRender(tex);
   });

   // Rendu de KaTeX pour les simples $
   html = html.replace(/\$(.*?)\$/gs, function(match, tex) {
      return katexRender(tex);
   });

   // On transforme le Markdown en HTML
   html = marked(html);

   return html;
}


/**
 * Conversion du Markdown en HTML avec KaTeX et Marked uniquement
 *
 * @param markdown
 * @return {*|Promise<*>}
 */
export function renderLightMarkdown(markdown) {

   // Transformer les blocs de formules mathématiques en utilisant KaTeX
   // Rendu de KaTeX pour les doubles $
   let html = markdown.replace(/\$\$(.*?)\$\$/gs, function(match, tex) {
      return katexRender(tex);
   });

   // Rendu de KaTeX pour les simples $
   html = html.replace(/\$(.*?)\$/gs, function(match, tex) {
      return katexRender(tex);
   });

   // On transforme le Markdown en HTML
   html = marked(html);

   return html;
}