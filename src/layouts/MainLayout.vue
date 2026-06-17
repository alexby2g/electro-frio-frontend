<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="text-weight-bold">
          ❄️ Electro Frío
        </q-toolbar-title>

        <q-chip color="white" text-color="primary" icon="verified">
          Sistema Técnico
        </q-chip>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="260">
      <div class="q-pa-md bg-primary text-white">
        <div class="text-h6 text-weight-bold">Electro Frío</div>
        <div class="text-caption">Gestión de servicios técnicos</div>
      </div>

      <q-list padding>
        <q-item clickable v-ripple to="/" exact>
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/clientes">
          <q-item-section avatar>
            <q-icon name="groups" />
          </q-item-section>
          <q-item-section>Clientes</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/servicios">
          <q-item-section avatar>
            <q-icon name="build" />
          </q-item-section>
          <q-item-section>Servicios</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>