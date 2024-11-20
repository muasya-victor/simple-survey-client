<template>
  <div class="w-full">
    <div v-if="responses.length">
      <div v-for="(response, index) in responses" :key="index" class="question">
          <p><strong> {{index + 1}} . {{ response?.question_text }}</strong></p>
          <div class="bg-gray-200 p-2 rounded-md">
            {{response?.response_text}}
            <ul>
              <li v-for="(option, index) in response?.selected_option_texts" :key="index">{{ option }}</li>
            </ul>
          </div>
        </div>
    </div>
    <div v-else>
      <p>No responses available.</p>
    </div>

  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import axios from 'axios';

// Define reactive state using ref
const responses = ref([]);
const test = ref(
    [ { "id": 1, "question": { "id": 7, "text": "Is this a phone" }, "question_text": "Is this a phone", "response_text": null, "selected_options ": [], "selected_option_texts": [] }, { "id": 2, "question": { "id": 8, "text": "is that a bread?" }, "question_text": "is that a bread?", "response_text": null, "selected_options": [], "selected_option_texts": [] }, { "id": 3, "question": { "id" : 7, "text": "Is this a phone" }, "question_text": "Is this a phone", "response_text": null, "selected_options": [ { "id": 9, "option_text": "No" } ], "selected_option_texts": [ "No" ] }, { "id": 4, "question": { "id": 8 , "text": "is that a bread?" }, "question_text": "is that a bread?", "response_text": null, "selected_options": [ { "id": 13, "option_text": "I do not Know" } ], "selected_option_texts": [ "I don't know" ] } ]
);

// Fetch responses from API
const fetchResponses = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/responses/');
    console.log('API Response:', response.data);

    // Map the new response data
    responses.value = response.data;

  } catch (error) {
    console.error('Error fetching responses:', error);
  }
};

// Fetch data when the component is mounted
onMounted(() => {
  fetchResponses();
});
</script>

<style scoped>
.survey-form {
  max-width: 600px;
  margin: 0 auto;
}

.question {
  margin-bottom: 20px;
}

p {
  margin: 5px 0;
  font-size: 16px;
}

strong {
  font-weight: bold;
}

ul {
  list-style-type: none;
  padding-left: 20px;
}

li {
  font-size: 16px;
  margin: 5px 0;
}
</style>
