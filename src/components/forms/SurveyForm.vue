<template>
  <div style="display: flex; flex-direction: column; gap: 6rem" class="w-full p-4 flex flex-col gap-8">
    <el-steps style="width: 100%" :active="activeStep">
      <el-step
          v-for="(question, index) in questions"
          :key="question.id"
          :title="`Step ${index + 1}`"
      ></el-step>
    </el-steps>

    <div v-if="activeQuestion">
      <div class="flex items-center font-bold">
        <span v-if="activeQuestion.required" class="text-red-500">*</span>
        <p class="text-xl font-bold mt-4">{{ activeQuestion.text }}</p>
      </div>
      <p class="text-xs text-gray-500 mb-4">{{ activeQuestion?.description }}</p>

      <el-input
          v-if="['short_text', 'long_text', 'email'].includes(activeQuestion.type)"
          v-model="formData[activeQuestion.id].answer"
          :type="activeQuestion.type === 'long_text' ? 'textarea' : (activeQuestion.type === 'email' ? 'email' : 'text')"
          :rules="activeQuestion.type === 'email' ? emailRule : []"
          :placeholder="activeQuestion.type === 'email' ? 'Enter a valid email address' : ''"
      />

      <el-radio-group
          v-if="activeQuestion.type === 'choice' && !activeQuestion.multiple"
          v-model="formData[activeQuestion.id].answer"
      >
        <el-radio
            v-for="(option, index) in activeQuestion.choices"
            :key="option.id"
            :value="option"
            :label="option.id"
        >
          {{ option.option_text }}
        </el-radio>
      </el-radio-group>

      <el-checkbox-group
          v-if="activeQuestion.type === 'choice' && activeQuestion.multiple"
          v-model="formData[activeQuestion.id].answer"
      >
        <el-checkbox
            v-for="(option, index) in activeQuestion.choices"
            :key="option.id"
            :label="option.id"
            :value="option"
        >
          {{ option.option_text }}
        </el-checkbox>
      </el-checkbox-group>

      <el-upload
          v-if="activeQuestion.type === 'file'"
          multiple
          :on-success="handleFileUpload"
      >
        <el-button>Upload File</el-button>
      </el-upload>
    </div>


    <div v-if="showPreview" class="w-full">
      <h3 class="text-lg font-semibold mb-4">Review Your Responses</h3>
      <div v-for="(question, index) in questions" :key="question.id" class="mb-4">
        <p class="font-bold">{{ question.text }}</p>

        <div class="bg-gray-200 p-4 rounded-md" v-if="formData[question.id]">
          <div v-if="['short_text', 'long_text', 'email'].includes(question.type)">
            <p>{{ formData[question.id].answer }}</p>
          </div>
          <div v-if="question.type === 'choice' && !question.multiple">
            <p>{{ formData[question.id].answer.option_text }}</p>
          </div>
          <div v-if="question.type === 'choice' && question.multiple">
            <ul>
              <li v-for="(option, index) in formData[question.id].answer" :key="index">
                {{ option.option_text }}
              </li>
            </ul>
          </div>
          <div v-if="question.type === 'file'">
            <ul>
              <li v-for="(file, index) in formData[question.id].answer" :key="index">
                {{ file.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between">
      <button
          class="rounded-none bg-transparent border py-2 px-4 hover:py-3 hover:px-6"
          v-if="activeStep !== 0"
          @click="prevStep"
          :disabled="activeStep === 0"
      >
        Previous
      </button>

      <div v-if="activeStep === 0"></div>

      <button
          v-if="activeStep === questions.length - 1"
          class="rounded-none bg-gray-500 text-white py-2 px-4 hover:py-3 hover:px-6"
          @click="() => (showPreview = !showPreview)"
      >
        Preview
      </button>

      <div v-if="activeStep < questions.length - 1" class="flex gap-2">
        <button class="rounded-none bg-orange-600 text-white py-2 px-4 hover:py-3 hover:px-6" @click="nextStep">
          Next
        </button>
      </div>
    </div>

    <el-button type="success" size="large" @click="submitForm" v-if="activeStep === questions.length - 1">
      Submit
    </el-button>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import api from '@/services/api';
import { ElNotification } from 'element-plus';
import {useRouter} from "vue-router";

export default {
  setup() {
    const questions = ref([]);
    const activeStep = ref(0);
    const showPreview = ref(false);
    const formData = reactive({});
    const emailRule = [
      {
        required: true,
        message: 'Please input your email address!',
        trigger: 'blur',
      },
      {
        pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        message: 'Please enter a valid email address!',
        trigger: 'blur',
      },
    ];

    const activeQuestion = computed(() => questions.value[activeStep.value]);

    const fetchQuestions = async () => {
      try {
        const response = await api.get('questions/');
        questions.value = response.data;

        questions.value.forEach((question) => {
          formData[question.id] = {
            question: {
              id: question.id,
              text: question.text,
              description: question.description,
              required: question.required,
            },
            answer: question.type === 'choice' && question.multiple ? [] : '',
          };
        });
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    const handleFileUpload = (file) => {
      const questionId = activeQuestion.value.id;
      if (!formData[questionId].answer) formData[questionId].answer = [];
      formData[questionId].answer.push(file);
    };

    const prevStep = () => {
      if (activeStep.value > 0) activeStep.value--;
    };

    const nextStep = () => {
      if (isRequiredQuestionUnanswered()) {
        ElNotification({
          title: 'Warning',
          message: 'Please answer the required question before proceeding.',
          type: 'warning',
        });
        return;
      }
      if (activeStep.value < questions.value.length - 1) activeStep.value++;
    };

    const isRequiredQuestionUnanswered = () => {
      const question = activeQuestion.value;
      if (question.required && (!formData[question.id].answer || formData[question.id].answer.length === 0)) {
        return true;
      }
      return false;
    };

    const submitForm = async () => {
      try {
        // Format the payload properly
        const formattedPayload = {
          responses: Object.values(formData).map((data) => ({
            "question": data.question.id, // Assuming question is an object with an id
            "response_text": data.question.type === 'text' ? data.answer : null,
            "selected_options": data.question.type !== 'text'
                ? (Array.isArray(data.answer)
                        ? data.answer.map(option => option.id) // If multiple options, map to their ids
                        : [data.answer.id] // If single option, extract the id
                ).filter(Boolean)
                : [] // For text-based questions, leave selected_options as an empty array
          }))
        };

        console.log('Submitting payload:', formattedPayload);

        const response = await api.post('responses/', formattedPayload);

        // Success notification
        ElNotification({
          title: 'Success',
          message: 'Survey submitted successfully!',
          type: 'success',
        });

        const router = useRouter()
        router.push({name:'responses'})

        // Reset form
        Object.keys(formData).forEach((key) => (formData[key].answer = ''));
        activeStep.value = 0;
      }
      catch (error){
      console.error('Error submitting survey:', error);

      // Check if there are multiple errors in the response
      const errorMessages = [];

      if (error.response && error.response.data) {
        // Check if there are non_field_errors (general errors across multiple fields)
        if (error.response.data.responses) {
          // Loop through each response error and extract error messages
          error.response.data.responses.forEach((responseError) => {
            if (responseError.non_field_errors) {
              responseError.non_field_errors.forEach((errorMessage) => {
                errorMessages.push(errorMessage);
              });
            }
          });
        }

        // Check if there's a generic error message
        if (error.response.data.detail) {
          errorMessages.push(error.response.data.detail);
        }
      }

      // If there are multiple error messages, display them with a delay
      if (errorMessages.length > 0) {
        errorMessages.forEach((message, index) => {
          setTimeout(() => {
            ElNotification({
              title: 'Error',
              message: message, // Show each error message individually
              type: 'error',
            });
          }, index * 200); // Delay each notification by 2 seconds (index * 2000ms)
        });
      } else {
        // Default error message if no specific errors are found
        ElNotification({
          title: 'Error',
          message: 'There was an error submitting your survey.',
          type: 'error',
        });
      }
      }
    }
    onMounted(fetchQuestions);

    return {
      questions,
      activeStep,
      showPreview,
      formData,
      emailRule,
      activeQuestion,
      fetchQuestions,
      handleFileUpload,
      prevStep,
      nextStep,
      isRequiredQuestionUnanswered,
      submitForm,
    };
  },
};
</script>

<style scoped>
/* Add any styles if necessary */
</style>
