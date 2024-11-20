<template>
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-4">Survey Responses</h2>
      <survey-responses />
    </div>
  </template>
  
  <script>
  import SurveyResponses from '@/components/responses/SurveyResponse.vue';
  
  export default {
    components: {
      SurveyResponses,
    },
  };
  </script>
  