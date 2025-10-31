// plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


const customTheme = {
  dark: false, 
  colors: {
    primary: '#1d8d06', 
    secondary: '#424242',
 surface: '#212121', // Fondo de tarjetas/componentes oscuros
    background: '#121212', // Fondo general de la aplicación oscuro

  }
};


export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true, // HABILITA soporte SSR 
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
    },
    theme: {
        defaultTheme: 'customTheme',
      themes: {
        customTheme,
      },
      //defaultTheme: 'dark',
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
