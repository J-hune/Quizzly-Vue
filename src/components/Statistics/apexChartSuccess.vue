<template>
   <div class="custom-card">
      <div class="top-right-container">
         <ul class="legend">
            <li>Taux de réussite</li>
         </ul>
         <vue-feather @click="reset" class="reset" size="16" type="home" />
      </div>

      <vue-apex-charts ref="chart" height="150" type="area" :options="chartOptions" class="w-full"
                       :series="series" />
   </div>
</template>

<script>
import moment from "moment";
import VueApexCharts from "vue3-apexcharts";

export default {
   name: "apexChartSuccess",
   components: { VueApexCharts },
   props: { series: Array, categories: Array },
   data: function() {
      return {
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
                  show: false
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
                     show: false,
                     formatter: function (value) {
                        return value + "%";
                     }
                  },
                  axisBorder: {
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
               strokeColors: ["#18937B"],
               hover: {
                  size: 6
               }
            },
            colors: ["#18937B"],
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
               colors: ["#18937B"] // couleur de la line
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
   left: -16%;
   position: absolute;
   top: 27%;
   width: 8px;
}

.legend li:first-child::before {
   background-color: #18937B;
}

.reset {
   padding: 3px;
   cursor: pointer;
   color: #4e5d6c;
   margin-left: 14px;
}
</style>