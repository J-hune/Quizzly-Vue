<template>
   <router-view />
</template>

<script>
console.log("" +
  " ./////*   */*   ,//  *//  ///////, *//////*  //,   //,  .//\n" +
  "*//    //, *//   ,//  *//      ///      ///   //,    //,.// \n" +
  "//*    //* *//   ,//  *//    ///      ,//.    //,     ////  \n" +
  ",//.  ,//. ,//   ///  *//  *//.     .//,      //,     .//   \n" +
  "  ,////*     *///*.   *//  ///////, *//////*  */////. .//   \n" +
  "       ,*")
</script>

<style>
body {
   background: #eeebf3;
}

#app {
   font-family: Nunito, serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   color: #2c3e50;
}

nav {
   padding: 30px;
}

nav a {
   font-weight: bold;
   color: #2c3e50;
}

nav a.router-link-exact-active {
   color: #42b983;
}
</style>
