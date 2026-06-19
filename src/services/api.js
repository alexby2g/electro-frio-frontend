import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  timeout: 15000,
})

export const extraerMensajeError = (error, mensajeDefault = 'Ocurrió un error inesperado') => {
  const data = error?.response?.data

  if (data?.message) return data.message
  if (data?.mensaje) return data.mensaje

  const errores = data?.errors
  if (errores) {
    const primerCampo = Object.keys(errores)[0]
    if (primerCampo && errores[primerCampo]?.[0]) return errores[primerCampo][0]
  }

  return mensajeDefault
}

export default api
