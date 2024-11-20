<!-- src/views/Dashboard.vue -->
<template>
    <div class="dashboard">
      <Header />
      <div class="content">
        <router-view /> <!-- This is where other pages like SurveyFormPage will be injected -->
      </div>
    </div>
  </template>
  
  <script>
  import Header from '@/components/Header.vue';
  
  export default {
    components: {
      Header,
    },
  };
  </script>
  
  <style scoped>
  .dashboard {
    display: flex;
    flex-direction: column;
  }
  
  .content {
    padding: 20px;
  }
  </style>
  