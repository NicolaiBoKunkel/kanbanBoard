<script setup lang="ts">
import BoardView from '@/views/BoardView.vue'
</script>

<template>
  <v-app>
    <v-app-bar color="primary" density="comfortable" flat>
      <v-app-bar-title>Kanban Board</v-app-bar-title>
    </v-app-bar>
    <v-main>
      <BoardView />
    </v-main>
  </v-app>
</template>
