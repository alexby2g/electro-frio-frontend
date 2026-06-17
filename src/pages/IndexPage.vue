<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h4 text-weight-bold text-primary">Dashboard</div>
        <div class="text-subtitle2 text-grey-7">
          Resumen general del sistema Electro Frío
        </div>
      </div>

      <q-btn color="primary" icon="refresh" label="Actualizar" @click="cargarDatos" />
    </div>

    <q-banner v-if="error" class="bg-red-1 text-red q-mb-md rounded-borders">
      {{ error }}
    </q-banner>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="q-pa-md">
          <div class="text-grey-7">Total Clientes</div>
          <div class="text-h4 text-weight-bold text-primary">
            {{ resumenClientes.total_clientes ?? 0 }}
          </div>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="q-pa-md">
          <div class="text-grey-7">Clientes Activos</div>
          <div class="text-h4 text-weight-bold text-positive">
            {{ resumenClientes.clientes_activos ?? 0 }}
          </div>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="q-pa-md">
          <div class="text-grey-7">Total Servicios</div>
          <div class="text-h4 text-weight-bold text-primary">
            {{ resumenServicios.total_servicios ?? 0 }}
          </div>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="q-pa-md">
          <div class="text-grey-7">Precio Promedio</div>
          <div class="text-h4 text-weight-bold text-deep-orange">
            Bs {{ precioPromedio }}
          </div>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 text-weight-bold">Últimos clientes</div>
          </q-card-section>

          <q-separator />

          <q-table
            flat
            :rows="resumenClientes.ultimos_clientes || []"
            :columns="columnasClientes"
            row-key="id"
            :loading="loading"
            no-data-label="No hay clientes registrados"
          />
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 text-weight-bold">Últimos servicios</div>
          </q-card-section>

          <q-separator />

          <q-table
            flat
            :rows="resumenServicios.servicios || []"
            :columns="columnasServicios"
            row-key="id"
            :loading="loading"
            no-data-label="No hay servicios registrados"
          />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000/api'

const loading = ref(false)
const error = ref('')
const resumenClientes = ref({})
const resumenServicios = ref({})

const columnasClientes = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left' },
  { name: 'telefono', label: 'Teléfono', field: 'telefono', align: 'left' },
  { name: 'equipo', label: 'Equipo', field: 'equipo', align: 'left' },
]

const columnasServicios = [
  { name: 'nombre', label: 'Servicio', field: 'nombre', align: 'left' },
  { name: 'precio', label: 'Precio', field: 'precio', align: 'right' },
]

const precioPromedio = computed(() => {
  const precio = Number(resumenServicios.value.precio_promedio || 0)
  return precio.toFixed(2)
})

const cargarDatos = async () => {
  loading.value = true
  error.value = ''

  try {
    const [clientesRes, serviciosRes] = await Promise.all([
      axios.get(`${API_URL}/resumen-clientes`),
      axios.get(`${API_URL}/resumen-servicios`),
    ])

    resumenClientes.value = clientesRes.data
    resumenServicios.value = serviciosRes.data
  } catch (e) {
    error.value = 'No se pudo conectar con el backend. Verifica que Laravel esté encendido.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarDatos()
})
</script>