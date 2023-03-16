<template>
   <div class="custom-card">
      <div class="top-right-container">
         <ul class="legend">
            <li @click="toggleSeries('Sequences')">Sequences</li>
            <li @click="toggleSeries('Questions')">Questions</li>
         </ul>
         <vue-feather @click="reset" class="reset" size="16" type="home" />
      </div>

      <vue-apex-charts ref="chart" height="400" type="area" :options="chartOptions" class="w-full"
                       :series="series" />
   </div>
</template>

<script>
import moment from "moment";
import VueApexCharts from "vue3-apexcharts";

export default {
   name: "apexChartParticipation",
   components: { VueApexCharts },
   props: { series: Array, categories: Array },
   data: function() {
      return {
         displaySeries: ["Sequences", "Questions"],
         chartOptions: {
            chart: {
               type: "area",
               toolbar: {
                  show: false
               }
            },
            dataLabels: {
               enabled: false
            },
            xaxis: {
               type: "categories",
               show: false,
               labels: {
                  low: 0,
                  offsetX: 0,
                  show: false,
                  formatter: function(value) {
                     return moment.unix(value).format("L");
                  }
               },
               axisBorder: {
                  low: 0,
                  offsetX: 0,
                  show: false
               },
               axisTicks: {
                  show: false
               },
               tooltip: {
                  enabled: false
               }
            },
            yaxis: [
               {
                  seriesName: "series1",
                  show: false,
                  labels: {
                     show: false
                  },
                  axisBorder: {
                     show: false
                  }
               },
               {
                  seriesName: "series2",
                  show: false,
                  labels: {
                     show: false
                  },
                  axisBorder: {
                     left: 0,
                     show: false
                  }
               }],
            grid: {
               show: false,
               padding: {
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0
               }
            },
            markers: {
               strokeWidth: 3,
               colors: "#ffffff",
               strokeColors: ["#a6acec", "#a56cc1"],
               hover: {
                  size: 6
               }
            },
            colors: ["#a6acec", "#a56cc1"],
            legend: {
               show: false
            },
            tooltip: {
               x: {
                  format: "MM"
               }
            },
            stroke: {
               curve: "smooth", // courbe de la line
               colors: ["#a6acec", "#a56cc1"] // couleur de la line
            },
            fill: {
               type: "gradient",
               gradient: {
                  shadeIntensity: 1,
                  opacityFrom: 0.7,
                  opacityTo: 0.5,
                  stops: [0, 80, 100]
               }
            }
         }
      };
   },
   watch: {
      categories: function(newVal) {
         this.$refs.chart.updateOptions({
            xaxis: {
               categories: newVal.map(value => moment.unix(value).format("L"))
            }
         });
      }
   },
   methods: {
      /**
       * Bascule la visibilité de la série ayant le nom en paramètre.
       * @param {string} seriesName - Le nom de la série à basculer.
       */
      toggleSeries(seriesName) {
         this.$refs.chart.toggleSeries(seriesName);
      },

      /**
       * Réinitialise le zoom sur l'axe X du graphique.
       */
      reset() {
         this.$refs.chart.zoomX();
      }
   }
};
</script>

<style scoped>
.custom-card {
   width: 100%;
   background: white;
   border-radius: 15px;
   box-shadow: 0 9px 20px rgba(46, 35, 94, 0.07);
   padding: 30px 30px 0 30px;
}

.top-right-container {
   display: flex;
   align-items: center;
   justify-content: right;
}

.legend {
   display: flex;
   justify-content: end;
   cursor: pointer;
   user-select: none;
}

.legend li {
   color: #4e5d6c;
   position: relative;
   font-weight: 600;
   line-height: 22px;
   margin-left: 35px;
}

.legend li::before {
   border-radius: 50%;
   content: "";
   height: 8px;
   left: -22%;
   position: absolute;
   top: 27%;
   width: 8px;
}

.legend li:first-child::before {
   background-color: #b281ca;
}

.legend li:last-child::before {
   background-color: #b3b8ee;
}

.reset {
   padding: 3px;
   cursor: pointer;
   color: #4e5d6c;
   margin-left: 14px;
}
</style>