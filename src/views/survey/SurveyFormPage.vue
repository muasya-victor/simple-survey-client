<!-- src/views/SurveyFormPage.vue -->
<template>
  <div class="w-full">
    <h2>Survey Questions</h2>
    <SurveyForm />
  </div>
</template>

<script>
export default {
  data() {
    return {
      questions: [
        { text: 'What is your favorite color?', type: 'text' },
        { text: 'What is your gender?', type: 'multiple-choice', options: ['Male', 'Female', 'Other'] },
      ],
      responses: [],
    };
  },
  methods: {
    submitSurvey() {
      console.log('Survey Responses:', this.responses);
      alert('Survey submitted!');
    },
  },
};
</script>

<style scoped>
.survey-form {
  max-width: 600px;
  margin: 0 auto;
}

.question {
  margin-bottom: 20px;
}

button {
  background-color: #333;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #555;
}
</style>
