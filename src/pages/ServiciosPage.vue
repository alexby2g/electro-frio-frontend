<template>
  <q-page class="q-pa-md page-shell">
    <div class="row items-center justify-between q-mb-md q-col-gutter-md">
      <div>
        <div class="text-h4 text-weight-bold text-primary">Servicios</div>
        <div class="text-subtitle2 text-grey-7">Catálogo de trabajos técnicos y precios</div>
      </div>
      <div class="q-gutter-sm">
        <q-btn color="primary" icon="add" label="Nuevo Servicio" @click="abrirCrear" />
        <q-btn color="primary" outline icon="refresh" label="Actualizar" @click="cargarServicios" />
      </div>
    </div>

    <q-card class="content-card q-mb-md"><q-card-section><q-input v-model="buscar" outlined dense clearable debounce="400" label="Buscar servicio" @update:model-value="cargarServicios"><template #prepend><q-icon name="search" /></template></q-input></q-card-section></q-card>
    <q-banner v-if="error" class="bg-red-1 text-red q-mb-md rounded-borders">{{ error }}</q-banner>

    <q-card class="content-card">
      <q-table title="Listado de servicios" :rows="servicios" :columns="columns" row-key="id" :loading="loading" no-data-label="No hay servicios registrados">
        <template #body-cell-precio="props"><q-td :props="props">Bs {{ Number(props.row.precio || 0).toFixed(2) }}</q-td></template>
        <template #body-cell-activo="props"><q-td :props="props"><q-chip dense :color="props.row.activo ? 'positive' : 'grey'" text-color="white">{{ props.row.activo ? 'Activo' : 'Inactivo' }}</q-chip></q-td></template>
        <template #body-cell-acciones="props">
          <q-td :props="props" class="table-actions">
            <q-btn dense flat round color="primary" icon="visibility" @click="abrirVer(props.row)" />
            <q-btn dense flat round color="warning" icon="edit" @click="abrirEditar(props.row)" />
            <q-btn dense flat round color="negative" icon="delete" @click="eliminarServicio(props.row)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="dialogo">
      <q-card class="rounded-dialog" style="width: 650px; max-width: 95vw">
        <q-card-section class="bg-primary text-white"><div class="text-h6">{{ tituloDialogo }}</div></q-card-section>
        <q-card-section class="row q-col-gutter-md">
          <div class="col-12 col-md-8"><q-input v-model="form.nombre" label="Nombre del servicio" outlined :readonly="modo === 'ver'" /></div>
          <div class="col-12 col-md-4"><q-input v-model.number="form.precio" label="Precio" outlined type="number" prefix="Bs" :readonly="modo === 'ver'" /></div>
          <div class="col-12 col-md-6"><q-toggle v-model="form.activo" label="Servicio activo" :disable="modo === 'ver'" /></div>
          <div class="col-12"><q-input v-model="form.descripcion" label="Descripción" outlined type="textarea" :readonly="modo === 'ver'" /></div>
        </q-card-section>
        <q-card-actions align="right"><q-btn flat label="Cerrar" color="grey-8" v-close-popup /><q-btn v-if="modo !== 'ver'" color="primary" icon="save" :label="modo === 'crear' ? 'Guardar' : 'Actualizar'" @click="guardarServicio" /></q-card-actions>
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
const servicios = ref([])
const dialogo = ref(false)
const modo = ref('crear')
const servicioId = ref(null)
const formInicial = { nombre: '', descripcion: '', precio: 0, activo: true }
const form = ref({ ...formInicial })

const columns = [
  { name: 'nombre', label: 'Servicio', field: 'nombre', align: 'left', sortable: true },
  { name: 'descripcion', label: 'Descripción', field: 'descripcion', align: 'left' },
  { name: 'precio', label: 'Precio', field: 'precio', align: 'right', sortable: true },
  { name: 'activo', label: 'Estado', field: 'activo', align: 'center' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

const tituloDialogo = computed(() => modo.value === 'crear' ? 'Registrar servicio' : modo.value === 'editar' ? 'Editar servicio' : 'Ver servicio')
const limpiarFormulario = () => { form.value = { ...formInicial }; servicioId.value = null }

const cargarServicios = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await api.get('/servicios', { params: { buscar: buscar.value || undefined } })
    servicios.value = response.data.data || []
  } catch (err) {
    error.value = extraerMensajeError(err, 'No se pudo cargar la lista de servicios.')
  } finally {
    loading.value = false
  }
}

const abrirCrear = () => { modo.value = 'crear'; limpiarFormulario(); dialogo.value = true }
const abrirVer = servicio => { modo.value = 'ver'; servicioId.value = servicio.id; form.value = { ...servicio }; dialogo.value = true }
const abrirEditar = servicio => { modo.value = 'editar'; servicioId.value = servicio.id; form.value = { ...servicio }; dialogo.value = true }

const guardarServicio = async () => {
  if (!form.value.nombre) {
    $q.notify({ type: 'warning', message: 'El nombre del servicio es obligatorio' })
    return
  }
  try {
    if (modo.value === 'crear') await api.post('/servicios', form.value)
    else await api.put(`/servicios/${servicioId.value}`, form.value)
    $q.notify({ type: 'positive', message: modo.value === 'crear' ? 'Servicio registrado correctamente' : 'Servicio actualizado correctamente' })
    dialogo.value = false
    limpiarFormulario()
    cargarServicios()
  } catch (err) {
    $q.notify({ type: 'negative', message: extraerMensajeError(err, 'No se pudo guardar el servicio') })
  }
}

const eliminarServicio = servicio => {
  $q.dialog({ title: 'Confirmar eliminación', message: `¿Eliminar el servicio ${servicio.nombre}?`, cancel: true, persistent: true }).onOk(async () => {
    try {
      await api.delete(`/servicios/${servicio.id}`)
      $q.notify({ type: 'positive', message: 'Servicio eliminado correctamente' })
      cargarServicios()
    } catch (err) {
      $q.notify({ type: 'negative', message: extraerMensajeError(err, 'No se pudo eliminar el servicio') })
    }
  })
}

onMounted(cargarServicios)
</script>
