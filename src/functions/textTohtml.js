import showdownHighlight from "showdown-highlight";
import showdown from "showdown";
import showdownKatex from "showdown-katex";
import mermaid from "mermaid";

/**
 * Conversion d'un string en markdown vers un format html,
 * (avec la couleur dans le code et le LaTeX)
 * @param {String} text
 * @return {*}
 */
function MarkdownToHtml(text) {
  let converter = new showdown.Converter({

    // Extension qui ajoute les classes des couleurs
    extensions: [showdownHighlight({
      auto_detection: true
    }),
      // Extension qui ajoute le LaTeX
      showdownKatex({

        // On ajoute deux délimiteurs conformément au sujet : "$" et "$$"
        delimiters: [
          { left: "$$", right: "$$", display: false },
          { left: "$", right: "$", display: false }
        ]
      })]
  });
  return converter.makeHtml(text);
}


/**
 * Prend en paramètre un string et retourne un tableau de string
 * La fonction split "text" avec un regex pour dissocier les cas
 * @param {String} text
 * @return {Object}
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
