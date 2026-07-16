export interface BrowserGeolocation {
  latitude: number
  longitude: number
}

/**
 * Dispara el prompt nativo de permisos del navegador (el consentimiento real).
 * Nunca rechaza ni bloquea el flujo que la llama: si el usuario deniega, no
 * hay soporte, o se agota el tiempo de espera, resuelve null.
 */
export function requestGeolocation(timeoutMs = 5000): Promise<BrowserGeolocation | null> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      () => resolve(null),
      { timeout: timeoutMs },
    )
  })
}
