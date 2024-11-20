<template>
    <div class="min-h-screen flex flex-col items-center justify-center">
      <h1 class="text-4xl font-bold text-blue-600 mb-4">Welcome to the Survey App</h1>
      <div class="flex gap-4">
        <el-button type="primary" size="large" @click="$router.push('/survey')">
          Start Survey
        </el-button>
        <el-button type="success" size="large" @click="$router.push('/responses')">
          View Responses
        </el-button>
      </div>
    </div>
  </template>
  
  <script>
  export default {};
  </script>
  