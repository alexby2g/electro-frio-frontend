<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="main-header">
      <q-toolbar class="q-px-md">
        <q-btn flat dense round icon="menu" class="text-white" @click="toggleLeftDrawer" />

        <q-toolbar-title class="row items-center no-wrap">
          <q-avatar size="42px" class="bg-white text-primary q-mr-sm">
            <q-icon name="ac_unit" size="28px" />
          </q-avatar>
          <div>
            <div class="text-weight-bold text-h6">Electro Frío</div>
            <div class="text-caption text-blue-1 gt-xs">Sistema de gestión técnica</div>
          </div>
        </q-toolbar-title>

        <q-chip class="bg-white text-primary text-weight-bold gt-xs" icon="verified_user">
          Sistema Técnico
        </q-chip>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="main-drawer" :width="285">
      <div class="drawer-header q-pa-md">
        <div class="row items-center no-wrap">
          <q-avatar size="58px" class="bg-white text-primary q-mr-md">
            <q-icon name="ac_unit" size="34px" />
          </q-avatar>
          <div>
            <div class="text-h6 text-weight-bold">Electro Frío</div>
            <div class="text-caption">Servicios técnicos</div>
          </div>
        </div>
      </div>

      <q-list padding>
        <q-item
          v-for="item in menu"
          :key="item.to"
          clickable
          v-ripple
          :to="item.to"
          :exact="item.exact"
          active-class="menu-active"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
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

const menu = [
  { label: 'Dashboard', icon: 'dashboard', to: '/', exact: true },
  { label: 'Clientes', icon: 'groups', to: '/clientes' },
  { label: 'Técnicos', icon: 'engineering', to: '/tecnicos' },
  { label: 'Servicios', icon: 'build', to: '/servicios' },
  { label: 'Equipos', icon: 'devices_other', to: '/equipos' },
  { label: 'Citas', icon: 'event_available', to: '/citas' },
  { label: 'Pagos', icon: 'payments', to: '/pagos' },
]

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
