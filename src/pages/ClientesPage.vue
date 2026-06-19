<template>
  <q-page class="q-pa-md page-shell">
    <div class="row items-center justify-between q-mb-md q-col-gutter-md">
      <div>
        <div class="text-h4 text-weight-bold text-primary">Clientes</div>
        <div class="text-subtitle2 text-grey-7">Crear, ver, editar y eliminar clientes</div>
      </div>
      <div class="q-gutter-sm">
        <q-btn color="primary" icon="add" label="Nuevo Cliente" @click="abrirCrear" />
        <q-btn color="primary" outline icon="refresh" label="Actualizar" @click="cargarClientes" />
      </div>
    </div>

    <q-card class="content-card q-mb-md">
      <q-card-section>
        <q-input v-model="buscar" outlined dense clearable debounce="400" label="Buscar por nombre, teléfono, dirección, equipo o marca" @update:model-value="cargarClientes">
          <template #prepend><q-icon name="search" /></template>
        </q-input>
      </q-card-section>
    </q-card>

    <q-banner v-if="error" class="bg-red-1 text-red q-mb-md rounded-borders">{{ error }}</q-banner>

    <q-card class="content-card">
      <q-table title="Listado de clientes" :rows="clientes" :columns="columns" row-key="id" :loading="loading" no-data-label="No hay clientes registrados">
        <template #body-cell-activo="props">
          <q-td :props="props">
            <q-chip dense :color="props.row.activo ? 'positive' : 'grey'" text-color="white">
              {{ props.row.activo ? 'Activo' : 'Inactivo' }}
            </q-chip>
          </q-td>
        </template>
        <template #body-cell-acciones="props">
          <q-td :props="props" class="table-actions">
            <q-btn dense flat round color="primary" icon="visibility" @click="abrirVer(props.row)" />
            <q-btn dense flat round color="warning" icon="edit" @click="abrirEditar(props.row)" />
            <q-btn dense flat round color="negative" icon="delete" @click="eliminarCliente(props.row)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="dialogo">
      <q-card class="rounded-dialog" style="width: 720px; max-width: 95vw">
        <q-card-section class="bg-primary text-white"><div class="text-h6">{{ tituloDialogo }}</div></q-card-section>
        <q-card-section class="row q-col-gutter-md">
          <div class="col-12 col-md-6"><q-input v-model="form.nombre" label="Nombre" outlined :readonly="modo === 'ver'" /></div>
          <div class="col-12 col-md-6"><q-input v-model="form.telefono" label="Teléfono" outlined :readonly="modo === 'ver'" /></div>
          <div class="col-12 col-md-6"><q-input v-model="form.direccion" label="Dirección" outlined :readonly="modo === 'ver'" /></div>
          <div class="col-12 col-md-6"><q-input v-model="form.equipo" label="Equipo principal" outlined :readonly="modo === 'ver'" /></div>
          <div class="col-12 col-md-6"><q-input v-model="form.marca" label="Marca" outlined :readonly="modo === 'ver'" /></div>
          <div class="col-12 col-md-6"><q-toggle v-model="form.activo" label="Cliente activo" :disable="modo === 'ver'" /></div>
          <div class="col-12"><q-input v-model="form.observacion" label="Observación" outlined type="textarea" :readonly="modo === 'ver'" /></div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="grey-8" v-close-popup />
          <q-btn v-if="modo !== 'ver'" color="primary" icon="save" :label="modo === 'crear' ? 'Guardar' : 'Actualizar'" @click="guardarCliente" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import api, { extraerMensajeError } from '../services/api.js'

const $q = useQuasar()
const loading = ref(false)
const error = ref('')
const buscar = ref('')
const clientes = ref([])
const dialogo = ref(false)
const modo = ref('crear')
const clienteId = ref(null)
const formInicial = { nombre: '', telefono: '', direccion: '', equipo: '', marca: '', observacion: '', activo: true }
const form = ref({ ...formInicial })

const columns = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
  { name: 'telefono', label: 'Teléfono', field: 'telefono', align: 'left' },
  { name: 'direccion', label: 'Dirección', field: 'direccion', align: 'left' },
  { name: 'equipo', label: 'Equipo', field: 'equipo', align: 'left' },
  { name: 'marca', label: 'Marca', field: 'marca', align: 'left' },
  { name: 'activo', label: 'Estado', field: 'activo', align: 'center' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

const tituloDialogo = computed(() => modo.value === 'crear' ? 'Registrar cliente' : modo.value === 'editar' ? 'Editar cliente' : 'Ver cliente')
const limpiarFormulario = () => { form.value = { ...formInicial }; clienteId.value = null }

const cargarClientes = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await api.get('/clientes', { params: { buscar: buscar.value || undefined } })
    clientes.value = response.data.data || []
  } catch (err) {
    error.value = extraerMensajeError(err, 'No se pudo cargar la lista de clientes.')
  } finally {
    loading.value = false
  }
}

const abrirCrear = () => { modo.value = 'crear'; limpiarFormulario(); dialogo.value = true }
const abrirVer = cliente => { modo.value = 'ver'; clienteId.value = cliente.id; form.value = { ...cliente }; dialogo.value = true }
const abrirEditar = cliente => { modo.value = 'editar'; clienteId.value = cliente.id; form.value = { ...cliente }; dialogo.value = true }

const guardarCliente = async () => {
  if (!form.value.nombre) {
    $q.notify({ type: 'warning', message: 'El nombre del cliente es obligatorio' })
    return
  }
  try {
    if (modo.value === 'crear') await api.post('/clientes', form.value)
    else await api.put(`/clientes/${clienteId.value}`, form.value)
    $q.notify({ type: 'positive', message: modo.value === 'crear' ? 'Cliente registrado correctamente' : 'Cliente actualizado correctamente' })
    dialogo.value = false
    limpiarFormulario()
    cargarClientes()
  } catch (err) {
    $q.notify({ type: 'negative', message: extraerMensajeError(err, 'No se pudo guardar el cliente') })
  }
}

const eliminarCliente = cliente => {
  $q.dialog({ title: 'Confirmar eliminación', message: `¿Eliminar al cliente ${cliente.nombre}?`, cancel: true, persistent: true }).onOk(async () => {
    try {
      await api.delete(`/clientes/${cliente.id}`)
      $q.notify({ type: 'positive', message: 'Cliente eliminado correctamente' })
      cargarClientes()
    } catch (err) {
      $q.notify({ type: 'negative', message: extraerMensajeError(err, 'No se pudo eliminar el cliente') })
    }
  })
}

onMounted(cargarClientes)
</script>
