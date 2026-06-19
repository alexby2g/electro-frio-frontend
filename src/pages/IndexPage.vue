<template>
  <q-page class="q-pa-md page-shell">
    <q-card class="hero-card q-pa-lg q-mb-md">
      <div class="row items-center justify-between q-col-gutter-md">
        <div class="col-12 col-md-8">
          <div class="text-h4 text-weight-bold">Dashboard Electro Frío</div>
          <div class="text-subtitle1 text-blue-1 q-mt-xs">
            Control de clientes, técnicos, equipos, servicios, citas y pagos.
          </div>
        </div>
        <div class="col-12 col-md-auto">
          <q-btn unelevated color="white" text-color="primary" icon="refresh" label="Actualizar" @click="cargarDatos" />
        </div>
      </div>
    </q-card>

    <q-banner v-if="error" class="bg-red-1 text-red q-mb-md rounded-borders">
      {{ error }}
    </q-banner>

    <div class="row q-col-gutter-md">
      <div v-for="card in cards" :key="card.label" class="col-12 col-sm-6 col-md-4 col-lg-2">
        <q-card class="stat-card q-pa-md">
          <div class="row items-center no-wrap">
            <div class="stat-icon q-mr-md">
              <q-icon :name="card.icon" color="primary" size="28px" />
            </div>
            <div>
              <div class="text-grey-7 text-caption">{{ card.label }}</div>
              <div class="text-h5 text-weight-bold text-primary">{{ card.value }}</div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mt-sm">
      <div class="col-12 col-md-5">
        <q-card class="content-card">
          <q-card-section>
            <div class="text-h6 text-weight-bold">Estado de citas</div>
            <div class="text-caption text-grey-7">Resumen rápido por estado</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div v-for="estado in estados" :key="estado.key" class="q-mb-md">
              <div class="row justify-between q-mb-xs">
                <span>{{ estado.label }}</span>
                <strong>{{ estado.value }}</strong>
              </div>
              <q-linear-progress rounded size="12px" :value="estado.percent" :color="estado.color" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-7">
        <q-card class="content-card">
          <q-card-section>
            <div class="text-h6 text-weight-bold">Últimas citas</div>
            <div class="text-caption text-grey-7">Servicios técnicos registrados recientemente</div>
          </q-card-section>
          <q-separator />
          <q-table
            flat
            :rows="dashboard.ultimas_citas || []"
            :columns="columnasCitas"
            row-key="id"
            :loading="loading"
            no-data-label="No hay citas registradas"
          >
            <template #body-cell-estado="props">
              <q-td :props="props">
                <q-chip dense :color="colorEstado(props.row.estado)" text-color="white">
                  {{ textoEstado(props.row.estado) }}
                </q-chip>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import api, { extraerMensajeError } from '../services/api.js'

const loading = ref(false)
const error = ref('')
const dashboard = ref({ totales: {}, estado_citas: {}, ultimas_citas: [], ultimos_pagos: [] })

const columnasCitas = [
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'left', sortable: true },
  { name: 'hora', label: 'Hora', field: 'hora', align: 'left' },
  { name: 'cliente', label: 'Cliente', field: row => row.cliente?.nombre || 'Sin cliente', align: 'left' },
  { name: 'servicio', label: 'Servicio', field: row => row.servicio?.nombre || 'Sin servicio', align: 'left' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
]

const cards = computed(() => {
  const totales = dashboard.value.totales || {}
  return [
    { label: 'Clientes', icon: 'groups', value: totales.clientes ?? 0 },
    { label: 'Técnicos', icon: 'engineering', value: totales.tecnicos ?? 0 },
    { label: 'Equipos', icon: 'devices_other', value: totales.equipos ?? 0 },
    { label: 'Servicios', icon: 'build', value: totales.servicios ?? 0 },
    { label: 'Citas', icon: 'event_available', value: totales.citas ?? 0 },
    { label: 'Pagos Bs', icon: 'payments', value: Number(totales.pagos || 0).toFixed(2) },
  ]
})

const estados = computed(() => {
  const data = dashboard.value.estado_citas || {}
  const total = Object.values(data).reduce((sum, value) => sum + Number(value || 0), 0) || 1
  return [
    { key: 'pendiente', label: 'Pendientes', color: 'warning', value: data.pendiente || 0 },
    { key: 'en_proceso', label: 'En proceso', color: 'info', value: data.en_proceso || 0 },
    { key: 'concluida', label: 'Concluidas', color: 'positive', value: data.concluida || 0 },
    { key: 'cancelada', label: 'Canceladas', color: 'negative', value: data.cancelada || 0 },
  ].map(item => ({ ...item, percent: Number(item.value || 0) / total }))
})

const textoEstado = estado => ({
  pendiente: 'Pendiente',
  en_proceso: 'En proceso',
  concluida: 'Concluida',
  cancelada: 'Cancelada',
}[estado] || estado)

const colorEstado = estado => ({
  pendiente: 'warning',
  en_proceso: 'info',
  concluida: 'positive',
  cancelada: 'negative',
}[estado] || 'grey')

const cargarDatos = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await api.get('/dashboard')
    dashboard.value = response.data
  } catch (err) {
    error.value = extraerMensajeError(err, 'No se pudo conectar con el backend. Verifica que Laravel esté encendido.')
  } finally {
    loading.value = false
  }
}

onMounted(cargarDatos)
</script>
