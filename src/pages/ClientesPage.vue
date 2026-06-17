<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h4 text-weight-bold text-primary">Clientes</div>
        <div class="text-subtitle2 text-grey-7">Crear, ver, editar y eliminar clientes</div>
      </div>

      <div class="q-gutter-sm">
        <q-btn color="primary" icon="add" label="Nuevo Cliente" @click="abrirCrear" />
        <q-btn color="primary" outline icon="refresh" label="Actualizar" @click="cargarClientes" />
      </div>
    </div>

    <q-banner v-if="error" class="bg-red-1 text-red q-mb-md rounded-borders">
      {{ error }}
    </q-banner>

    <q-card>
      <q-table
        title="Listado de clientes"
        :rows="clientes"
        :columns="columns"
        row-key="id"
        :loading="loading"
        no-data-label="No hay clientes registrados"
      >
        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <q-btn dense flat round color="primary" icon="visibility" @click="abrirVer(props.row)" />
            <q-btn dense flat round color="warning" icon="edit" @click="abrirEditar(props.row)" />
            <q-btn dense flat round color="negative" icon="delete" @click="eliminarCliente(props.row)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="dialogo">
      <q-card style="width: 700px; max-width: 95vw">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            {{ tituloDialogo }}
          </div>
        </q-card-section>

        <q-card-section class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input v-model="form.nombre" label="Nombre" outlined :readonly="modo === 'ver'" />
          </div>

          <div class="col-12 col-md-6">
            <q-input v-model="form.telefono" label="Teléfono" outlined :readonly="modo === 'ver'" />
          </div>

          <div class="col-12 col-md-6">
            <q-input v-model="form.direccion" label="Dirección" outlined :readonly="modo === 'ver'" />
          </div>

          <div class="col-12 col-md-6">
            <q-input v-model="form.equipo" label="Equipo" outlined :readonly="modo === 'ver'" />
          </div>

          <div class="col-12 col-md-6">
            <q-input v-model="form.marca" label="Marca" outlined :readonly="modo === 'ver'" />
          </div>

          <div class="col-12">
            <q-input
              v-model="form.observacion"
              label="Observación"
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
            @click="guardarCliente"
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
const clientes = ref([])
const dialogo = ref(false)
const modo = ref('crear')
const clienteId = ref(null)

const formInicial = {
  nombre: '',
  telefono: '',
  direccion: '',
  equipo: '',
  marca: '',
  observacion: '',
}

const form = ref({ ...formInicial })

const columns = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
  { name: 'telefono', label: 'Teléfono', field: 'telefono', align: 'left' },
  { name: 'direccion', label: 'Dirección', field: 'direccion', align: 'left' },
  { name: 'equipo', label: 'Equipo', field: 'equipo', align: 'left' },
  { name: 'marca', label: 'Marca', field: 'marca', align: 'left' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

const tituloDialogo = computed(() => {
  if (modo.value === 'crear') return 'Registrar cliente'
  if (modo.value === 'editar') return 'Editar cliente'
  return 'Ver cliente'
})

const limpiarFormulario = () => {
  form.value = { ...formInicial }
  clienteId.value = null
}

const cargarClientes = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await axios.get(`${API_URL}/clientes`)
    clientes.value = response.data.data || []
  } catch (e) {
    error.value = 'No se pudo cargar la lista de clientes.'
  } finally {
    loading.value = false
  }
}

const abrirCrear = () => {
  modo.value = 'crear'
  limpiarFormulario()
  dialogo.value = true
}

const abrirVer = (cliente) => {
  modo.value = 'ver'
  clienteId.value = cliente.id
  form.value = { ...cliente }
  dialogo.value = true
}

const abrirEditar = (cliente) => {
  modo.value = 'editar'
  clienteId.value = cliente.id
  form.value = { ...cliente }
  dialogo.value = true
}

const guardarCliente = async () => {
  if (!form.value.nombre) {
    $q.notify({
      type: 'warning',
      message: 'El nombre del cliente es obligatorio',
    })
    return
  }

  try {
    if (modo.value === 'crear') {
      await axios.post(`${API_URL}/clientes`, form.value)

      $q.notify({
        type: 'positive',
        message: 'Cliente registrado correctamente',
      })
    } else {
      await axios.put(`${API_URL}/clientes/${clienteId.value}`, form.value)

      $q.notify({
        type: 'positive',
        message: 'Cliente actualizado correctamente',
      })
    }

    dialogo.value = false
    limpiarFormulario()
    cargarClientes()
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: 'No se pudo guardar el cliente',
    })
  }
}

const eliminarCliente = async (cliente) => {
  const confirmar = window.confirm(`¿Eliminar al cliente ${cliente.nombre}?`)

  if (!confirmar) return

  try {
    await axios.delete(`${API_URL}/clientes/${cliente.id}`)

    $q.notify({
      type: 'positive',
      message: 'Cliente eliminado correctamente',
    })

    cargarClientes()
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: 'No se pudo eliminar el cliente',
    })
  }
}

onMounted(() => {
  cargarClientes()
})
</script>