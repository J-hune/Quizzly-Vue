import showdownHighlight from "showdown-highlight";
import showdown from "showdown";
import showdownKatex from "showdown-katex";
import mermaid from "mermaid";

/*
* pré-requis : "text" est une chaîne de caractères
* action : converti une chaîne de caractères typée en markdown vers un format html,
*          avec la couleur dans le code et les formules mathématiques en LaTeX
* résultat : une chaîne de caractères
*
* /!\ <link rel="stylesheet" href="https://unpkg.com/katex@0.12.0/dist/katex.min.css" /> à mettre dans le html pour le LaTeX
*
*/


function MarkdownToHtml(text) {
  let converter = new showdown.Converter({
    extensions: [showdownHighlight({ //extension pour mettre les couleurs dans le code
      auto_detection: true //true pour détecter automatiquement le langage, sinon false
    }),
      showdownKatex({ //extension pour détecter le LaTeX
        delimiters: [ //ajoute le délimiteur "$" en plus de celui de base "$$", comme demandé dans le sujet
          { left: "$$", right: "$$", display: false },
          { left: "$", right: "$", display: false }
        ]
      })]
  });
  return converter.makeHtml(text);
}


/*
* pré-requis : "text" une chaîne de caractères
* action : sépare dans le texte en paramètre, les parties markdown des parties mermaid,
           pour ensuite transformer ces parties en leur équivalents en html
* résultat : une chaîne de caractères
*
* /!\ <script src="https://unpkg.com/mermaid@8.5.2/dist/mermaid.min.js"></script> à mettre dans le head du html pour le mermaid
*
*/
export function QuestionToHtml(text) {

  //Séparation des blocs mermaid, des blocs markdown => [markdown, mermaid, markdown, etc.]
  let tab = text.split(/```mermaid\s*([\s\S]*?)```/);

  //On change le format pour simplifier l'affichage
  return tab.map((e, i) => {
    if (i % 2 !== 0) {
      try {
        return mermaid.render("diagramId", e);
      } catch (e) {
        return "<div class='mermaid-error'>" + e + "</div>";
      }
    } else return MarkdownToHtml(e);
  });
}
