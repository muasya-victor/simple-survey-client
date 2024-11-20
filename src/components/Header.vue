<template>
  <header class="border-b w-full p-4">
    <div class="flex justify-between items-center">
      <!-- Logo and Brand Name -->
      <div class="flex items-center text-2xl italic text-orange-600 font-extrabold">
        <img class="h-10" alt="logo" src="/logo.png" />
        SurveyPro
      </div>

      <!-- Mobile Toggle Button (Hamburger) -->
      <div
          class="flex lg:hidden"
      >
        <el-button
            type="text"
            @click="toggleMenu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </el-button>
      </div>


      <!-- Desktop Navigation Links -->
      <div class="lg:flex gap-4 text-lg items-center">
        <router-link
            v-for="(link, index) in links"
            :key="index"
            :to="link.to"
            exact-active-class="text-orange-600"
            class="text-black hover:text-orange-600"
        >
          {{ link.text }}
        </router-link>
      </div>

      <!-- Mobile Menu (Hamburger) Links -->
      <el-drawer
          v-model="isMenuOpen"
          direction="ttb"
          @close="toggleMenu"
          class="lg:hidden"
          size="50%"
      >
        <div class="flex flex-col gap-4">
          <router-link
              v-for="(link, index) in links"
              :key="index"
              :to="link.to"
              exact-active-class="text-orange-600"
              class="text-black hover:text-orange-600"
              @click="()=> isMenuOpen = false"
          >
            {{ link.text }}
          </router-link>
        </div>
      </el-drawer>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      // Controls the visibility of the mobile menu
      isMenuOpen: false,
      links: [
        {text: 'Questions', to: '/'},
        {text: 'Responses', to: '/responses'},
      ],
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>

<style scoped>
/* For Desktop */
header {
  background-color: #fff;
}

/* Mobile Menu */
@media (max-width: 1024px) {
  .lg\:hidden {
    display: block !important;
  }

  .lg\:flex {
    display: none !important;
  }
}

.el-button {
  padding: 8px;
}

/* Styling for mobile menu items */
.el-link {
  font-size: 16px;
  padding: 12px;
  width: 100%;
}
</style>
