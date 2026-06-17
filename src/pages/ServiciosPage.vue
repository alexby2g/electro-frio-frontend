<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h4 text-weight-bold text-primary">Servicios</div>
        <div class="text-subtitle2 text-grey-7">Crear, ver, editar y eliminar servicios</div>
      </div>

      <div class="q-gutter-sm">
        <q-btn color="primary" icon="add" label="Nuevo Servicio" @click="abrirCrear" />
        <q-btn color="primary" outline icon="refresh" label="Actualizar" @click="cargarServicios" />
      </div>
    </div>

    <q-banner v-if="error" class="bg-red-1 text-red q-mb-md rounded-borders">
      {{ error }}
    </q-banner>

    <q-card>
      <q-table
        title="Listado de servicios"
        :rows="servicios"
        :columns="columns"
        row-key="id"
        :loading="loading"
        no-data-label="No hay servicios registrados"
      >
        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <q-btn dense flat round color="primary" icon="visibility" @click="abrirVer(props.row)" />
            <q-btn dense flat round color="warning" icon="edit" @click="abrirEditar(props.row)" />
            <q-btn dense flat round color="negative" icon="delete" @click="eliminarServicio(props.row)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="dialogo">
      <q-card style="width: 650px; max-width: 95vw">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            {{ tituloDialogo }}
          </div>
        </q-card-section>

        <q-card-section class="row q-col-gutter-md">
          <div class="col-12 col-md-8">
            <q-input v-model="form.nombre" label="Nombre del servicio" outlined :readonly="modo === 'ver'" />
          </div>

          <div class="col-12 col-md-4">
            <q-input
              v-model="form.precio"
              label="Precio"
              outlined
              type="number"
              prefix="Bs"
              :readonly="modo === 'ver'"
            />
          </div>

          <div class="col-12">
            <q-input
              v-model="form.descripcion"
              label="Descripción"
              outlined
              type="textarea"
              :readonly="modo === 'ver'"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="grey-8" v-close-popup />

          <q-btn
            v-if="modo !== 'ver'"
            color="primary"
            icon="save"
            :label="modo === 'crear' ? 'Guardar' : 'Actualizar'"
            @click="guardarServicio"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const API_URL = 'http://127.0.0.1:8000/api'

const loading = ref(false)
const error = ref('')
const servicios = ref([])
const dialogo = ref(false)
const modo = ref('crear')
const servicioId = ref(null)

const formInicial = {
  nombre: '',
  descripcion: '',
  precio: 0,
}

const form = ref({ ...formInicial })

const columns = [
  { name: 'nombre', label: 'Servicio', field: 'nombre', align: 'left', sortable: true },
  { name: 'descripcion', label: 'Descripción', field: 'descripcion', align: 'left' },
  { name: 'precio', label: 'Precio', field: 'precio', align: 'right', sortable: true },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

const tituloDialogo = computed(() => {
  if (modo.value === 'crear') return 'Registrar servicio'
  if (modo.value === 'editar') return 'Editar servicio'
  return 'Ver servicio'
})

const limpiarFormulario = () => {
  form.value = { ...formInicial }
  servicioId.value = null
}

const cargarServicios = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await axios.get(`${API_URL}/servicios`)
    servicios.value = response.data.data || []
  } catch (e) {
    error.value = 'No se pudo cargar la lista de servicios.'
  } finally {
    loading.value = false
  }
}

const abrirCrear = () => {
  modo.value = 'crear'
  limpiarFormulario()
  dialogo.value = true
}

const abrirVer = (servicio) => {
  modo.value = 'ver'
  servicioId.value = servicio.id
  form.value = { ...servicio }
  dialogo.value = true
}

const abrirEditar = (servicio) => {
  modo.value = 'editar'
  servicioId.value = servicio.id
  form.value = { ...servicio }
  dialogo.value = true
}

const guardarServicio = async () => {
  if (!form.value.nombre) {
    $q.notify({
      type: 'warning',
      message: 'El nombre del servicio es obligatorio',
    })
    return
  }

  try {
    if (modo.value === 'crear') {
      await axios.post(`${API_URL}/servicios`, form.value)

      $q.notify({
        type: 'positive',
        message: 'Servicio registrado correctamente',
      })
    } else {
      await axios.put(`${API_URL}/servicios/${servicioId.value}`, form.value)

      $q.notify({
        type: 'positive',
        message: 'Servicio actualizado correctamente',
      })
    }

    dialogo.value = false
    limpiarFormulario()
    cargarServicios()
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: 'No se pudo guardar el servicio',
    })
  }
}

const eliminarServicio = async (servicio) => {
  const confirmar = window.confirm(`¿Eliminar el servicio ${servicio.nombre}?`)

  if (!confirmar) return

  try {
    await axios.delete(`${API_URL}/servicios/${servicio.id}`)

    $q.notify({
      type: 'positive',
      message: 'Servicio eliminado correctamente',
    })

    cargarServicios()
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: 'No se pudo eliminar el servicio',
    })
  }
}

onMounted(() => {
  cargarServicios()
})
</script>