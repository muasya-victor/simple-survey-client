// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/views/Dashboard.vue';
import SurveyFormPage from '@/views/survey/SurveyFormPage.vue';
import SurveyResponses from "@/views/survey/SurveyResponses.vue";

const routes = [
  {
    path: '/',
    component: Dashboard,
    children: [
      {
        path: '',
        name: 'questions',
        component: SurveyFormPage,
      },
      {
        path: 'responses',
        name: 'responses',
        component: SurveyResponses,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
