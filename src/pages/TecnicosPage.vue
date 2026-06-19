<template>
  <q-page class="q-pa-md page-shell">
    <div class="row items-center justify-between q-mb-md q-col-gutter-md">
      <div><div class="text-h4 text-weight-bold text-primary">Técnicos</div><div class="text-subtitle2 text-grey-7">Personal técnico de Electro Frío</div></div>
      <div class="q-gutter-sm"><q-btn color="primary" icon="add" label="Nuevo Técnico" @click="abrirCrear" /><q-btn color="primary" outline icon="refresh" label="Actualizar" @click="cargarTecnicos" /></div>
    </div>
    <q-card class="content-card q-mb-md"><q-card-section><q-input v-model="buscar" outlined dense clearable debounce="400" label="Buscar técnico" @update:model-value="cargarTecnicos"><template #prepend><q-icon name="search" /></template></q-input></q-card-section></q-card>
    <q-banner v-if="error" class="bg-red-1 text-red q-mb-md rounded-borders">{{ error }}</q-banner>
    <q-card class="content-card">
      <q-table title="Listado de técnicos" :rows="tecnicos" :columns="columns" row-key="id" :loading="loading" no-data-label="No hay técnicos registrados">
        <template #body-cell-activo="props"><q-td :props="props"><q-chip dense :color="props.row.activo ? 'positive' : 'grey'" text-color="white">{{ props.row.activo ? 'Activo' : 'Inactivo' }}</q-chip></q-td></template>
        <template #body-cell-acciones="props"><q-td :props="props" class="table-actions"><q-btn dense flat round color="primary" icon="visibility" @click="abrirVer(props.row)" /><q-btn dense flat round color="warning" icon="edit" @click="abrirEditar(props.row)" /><q-btn dense flat round color="negative" icon="delete" @click="eliminarTecnico(props.row)" /></q-td></template>
      </q-table>
    </q-card>
    <q-dialog v-model="dialogo"><q-card class="rounded-dialog" style="width: 650px; max-width: 95vw"><q-card-section class="bg-primary text-white"><div class="text-h6">{{ tituloDialogo }}</div></q-card-section><q-card-section class="row q-col-gutter-md"><div class="col-12 col-md-6"><q-input v-model="form.nombre" label="Nombre" outlined :readonly="modo === 'ver'" /></div><div class="col-12 col-md-6"><q-input v-model="form.telefono" label="Teléfono" outlined :readonly="modo === 'ver'" /></div><div class="col-12 col-md-8"><q-input v-model="form.especialidad" label="Especialidad" outlined :readonly="modo === 'ver'" /></div><div class="col-12 col-md-4"><q-toggle v-model="form.activo" label="Activo" :disable="modo === 'ver'" /></div></q-card-section><q-card-actions align="right"><q-btn flat label="Cerrar" color="grey-8" v-close-popup /><q-btn v-if="modo !== 'ver'" color="primary" icon="save" :label="modo === 'crear' ? 'Guardar' : 'Actualizar'" @click="guardarTecnico" /></q-card-actions></q-card></q-dialog>
  </q-page>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import api, { extraerMensajeError } from '../services/api.js'
const $q = useQuasar()
const loading = ref(false), error = ref(''), buscar = ref(''), tecnicos = ref([]), dialogo = ref(false), modo = ref('crear'), tecnicoId = ref(null)
const formInicial = { nombre: '', telefono: '', especialidad: '', activo: true }
const form = ref({ ...formInicial })
const columns = [{ name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true }, { name: 'telefono', label: 'Teléfono', field: 'telefono', align: 'left' }, { name: 'especialidad', label: 'Especialidad', field: 'especialidad', align: 'left' }, { name: 'activo', label: 'Estado', field: 'activo', align: 'center' }, { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' }]
const tituloDialogo = computed(() => modo.value === 'crear' ? 'Registrar técnico' : modo.value === 'editar' ? 'Editar técnico' : 'Ver técnico')
const limpiarFormulario = () => { form.value = { ...formInicial }; tecnicoId.value = null }
const cargarTecnicos = async () => { loading.value = true; error.value = ''; try { const r = await api.get('/tecnicos', { params: { buscar: buscar.value || undefined } }); tecnicos.value = r.data.data || [] } catch (err) { error.value = extraerMensajeError(err, 'No se pudo cargar la lista de técnicos.') } finally { loading.value = false } }
const abrirCrear = () => { modo.value = 'crear'; limpiarFormulario(); dialogo.value = true }
const abrirVer = item => { modo.value = 'ver'; tecnicoId.value = item.id; form.value = { ...item }; dialogo.value = true }
const abrirEditar = item => { modo.value = 'editar'; tecnicoId.value = item.id; form.value = { ...item }; dialogo.value = true }
const guardarTecnico = async () => { if (!form.value.nombre) { $q.notify({ type: 'warning', message: 'El nombre del técnico es obligatorio' }); return } try { if (modo.value === 'crear') await api.post('/tecnicos', form.value); else await api.put(`/tecnicos/${tecnicoId.value}`, form.value); $q.notify({ type: 'positive', message: 'Técnico guardado correctamente' }); dialogo.value = false; limpiarFormulario(); cargarTecnicos() } catch (err) { $q.notify({ type: 'negative', message: extraerMensajeError(err, 'No se pudo guardar el técnico') }) } }
const eliminarTecnico = item => { $q.dialog({ title: 'Confirmar eliminación', message: `¿Eliminar al técnico ${item.nombre}?`, cancel: true, persistent: true }).onOk(async () => { try { await api.delete(`/tecnicos/${item.id}`); $q.notify({ type: 'positive', message: 'Técnico eliminado correctamente' }); cargarTecnicos() } catch (err) { $q.notify({ type: 'negative', message: extraerMensajeError(err, 'No se pudo eliminar el técnico') }) } }) }
onMounted(cargarTecnicos)
</script>
