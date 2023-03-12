<template>
   <div class="game-container">

      <!-- Nombre de tours joués -->
      <h3 class="text-2xl text-white text-right mb-4">Nombre de tours joués: {{ turnCount }}</h3>

      <!-- Grille de cartes -->
      <div class="cards-container">
         <div v-for="(card, index) in deckOfCards" @click="clickHandler(card, index)" :class="['card', cardClass(card)]"
              :key="card.id">
            <div class="card-front" :style="{backgroundImage: `url(${image})`}"></div>
            <div class="card-back">{{ card.content }}</div>
         </div>
      </div>

      <!-- Bouton pour relancer une partie -->
      <button v-if="allPairsFound" @click="restart()"
              class="content-end mt-6 w-full sm:w-fit bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-12 rounded-lg">
         Nouvelle partie
      </button>
   </div>
</template>

<script>

import { useToast } from "vue-toastification";
import Octave from "@/assets/img/memory/Octave.svg";
import Marinette from "@/assets/img/memory/Marinette.svg";
import Bubule from "@/assets/img/memory/Bubule.svg";

const arrayImage = [Octave, Marinette, Bubule];
const randomIndexImage = Math.floor(Math.random() * arrayImage.length);
const randomImage = arrayImage[randomIndexImage];

const fruits = ["🍎", "🍌", "🍇", "🍊", "🍓", "🍍"];
const legumes = ["🥕", "🥦", "🍆", "🌽", "🥬", "🍅"];
const plats = ["🍔", "🍕", "🍣", "🍜", "🍝", "🍱"];
const animaux = ["🐶", "🐱", "🐻", "🦊", "🐰", "🐨"];
const instruments = ["🎸", "🎹", "🥁", "🎻", "🎺", "🎷"];
const sports = ["⚽️", "🏀", "🏈", "🎾", "🏐", "🏉"];
const desserts = ["🍩", "🧁", "🍰", "🍪", "🍨", "🍮"];
const boissons = ["☕️", "🍵", "🍺", "🍷", "🍹", "🥤"];

const arrayEmoji = [fruits, legumes, plats, boissons, desserts, animaux, instruments, sports];
const randomIndexEmoji = Math.floor(Math.random() * arrayEmoji.length);
const randomEmoji = arrayEmoji[randomIndexEmoji];

export default {
   name: "MemoryGame",
   data() {
      return {
         timerId: null,
         turnCount: 0,
         flippedCards: [],
         deckOfCards: [],
         allPairsFound: false,
         cardContents: randomEmoji,
         image: randomImage
      };
   },
   setup() {
      const toast = useToast();
      return { toast };
   },
   methods: {
      /**
       * Retourne un objet avec les classes CSS correspondantes pour une carte en fonction de ses propriétés.
       * @param {object} card - L'objet représentant la carte.
       * @param {number} card.id - L'identifiant unique de la carte.
       * @param {boolean} card.isPairFound - Indique si la carte est une paire trouvée ou non.
       * @return {object} - L'objet avec les classes CSS correspondantes.
       */
      cardClass({ id, isPairFound }) {
         return {
            flipped: this.flippedCards.find((flippedCard) => flippedCard.id === id),
            matchingPair: isPairFound
         };
      },

      /**
       * Gère le clic sur une carte.
       * @param {object} card - L'objet représentant la carte cliquée.
       * @param {number} index - L'index de la carte dans le tableau.
       */
      clickHandler(card, index) {
         if (!card.isPairFound && !this.flippedCards.find(e => e.id === card.id)) {
            clearTimeout(this.timer);
            this.flippedCards = this.flippedCards.length === 2 ?
              [{ ...card, index }] :
              [...this.flippedCards, { ...card, index }];
         }
      },

      /**
       * Mélange un tableau de cartes aléatoirement.
       * @param {array} cards - Le tableau de cartes à mélanger.
       * @return {array} - Le tableau de cartes mélangé.
       */
      shuffle(cards) {
         return cards.sort(() => Math.random() - 0.5);
      },

      /**
       * Redémarre le jeu avec une nouvelle liste aléatoire.
       */
      restart() {
         // Génère une nouvelle liste aléatoire d'emoji et une nouvelle image aléatoire
         const randomIndexImage = Math.floor(Math.random() * arrayImage.length);
         const randomImage = arrayImage[randomIndexImage];
         const randomIndexEmoji = Math.floor(Math.random() * arrayEmoji.length);
         const randomEmoji = arrayEmoji[randomIndexEmoji];

         // Réinitialise les données du jeu avec la nouvelle liste aléatoire
         this.timerId = null;
         this.turnCount = 0;
         this.flippedCards = [];
         this.deckOfCards = [];
         this.allPairsFound = false;
         this.cardContents = randomEmoji;
         this.image = randomImage;

         // Crée les nouvelles cartes et mélange le paquet de cartes
         const cards = this.cardContents.map((content, index) => ({
            id: index,
            content,
            isPairFound: false
         }));
         const pairs = cards.slice().map(({ content, id }) => ({
            id: cards.length + id,
            content
         }));
         this.cards = [...cards, ...pairs];
         this.deckOfCards = this.shuffle(this.cards);
      }
   },
   watch: {
      flippedCards(cards) {
         // On vérifie si deux cartes ont été retournées
         if (cards.length === 2) {
            // On incrémente le compteur de tours
            this.turnCount++;

            // On vérifie si les deux cartes sont différentes et qu'elles ont le même contenu
            if (cards[0].id !== cards[1].id && cards[0].content === cards[1].content) {

               // Si les cartes sont identiques, on les marque comme "trouvées"
               this.deckOfCards[cards[0].index].isPairFound = true;
               this.deckOfCards[cards[1].index].isPairFound = true;
            } else {
               // Si les cartes sont différentes, on retourne les cartes au bout de 1,4 seconde
               const self = this;
               this.timer = setTimeout(() => {
                  self.flippedCards = [];
               }, 1400);
            }

            // On vérifie si toutes les paires ont été trouvées
            this.allPairsFound = this.deckOfCards.every((x) => x.isPairFound);
         }
      },
      allPairsFound(newValue) {
         if (newValue === true) {
            this.toast.info("Vous avez gagné en " + this.turnCount + " coups !");
         }
      }
   },
   mounted() {
      // Créer tous les objets de cartes
      const cards = this.cardContents.map((content, index) => ({
         id: index,
         content,
         isPairFound: false
      }));

      // Dupliquer les cartes pour obtenir des paires et les concaténer au tableau existant
      const pairs = cards.slice().map(({ content, id }) => ({
         id: cards.length + id,
         content
      }));
      this.cards = [...cards, ...pairs];

      this.deckOfCards = this.shuffle(this.cards);
   }
};
</script>

<style scoped>
.game-container {
   padding: 0 10px 10px 10px;
}

.cards-container {
   display: grid;
   grid-template-columns: repeat(4, 1fr);
   grid-template-rows: repeat(3, 1fr);
   gap: 16px;
   cursor: pointer;
   user-select: none;

   width: 100%;
   justify-items: center;
}

.card {
   width: 100%;
   height: 180px;
   font-size: 3rem;
   position: relative;
   transition: opacity 0.7s;
}

@media (max-width: 600px) {
   .cards-container {
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(4, 1fr);
      gap: 12px;
   }

   .card {
      height: 140px;
   }
}

.card-back,
.card-front {
   width: 100%;
   height: 100%;
   position: absolute;
   backface-visibility: hidden;
   transform: translateZ(0);
   transition: transform 0.8s;
   transform-style: preserve-3d;
   border-radius: 10px;
   background: white;
}

.card .card-front {
   background-size: 60%;
   background-position: center;
   background-repeat: no-repeat;
}

.card .card-back {
   transform: rotateY(-180deg);
   display: flex;
   justify-content: center;
   align-items: center;
}

.card.matchingPair .card-front,
.card.flipped .card-front {
   transform: rotateY(180deg);
}

.card.matchingPair .card-back,
.card.flipped .card-back {
   transform: rotateY(0deg);
}

.card.matchingPair {
   opacity: 0.4;
}
</style>