import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { initializeRouter } from './services/api';
import { PreferencesService } from '@/services/preferencesService';
import { IonicVue } from '@ionic/vue';

//Tailwind Css
import './asset/css/tailwind.css'
/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';
/* Bootstrap css*/
//import './asset/css/bootstrap.min.css';

/* Import jQuery*/
//import './asset/js/jquery-3.5.1.min.js';

/* Import Popper.js*/
import '@popperjs/core';

/*Import Bootstrap JS*/
//import './asset/js/bootstrap.bundle.min.js';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* Theme variables */
import './theme/variables.css';

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
import '@ionic/vue/css/palettes/dark.class.css';
//import '@ionic/vue/css/palettes/dark.system.css';   // Comment out this line

 

let prefersDark: MediaQueryList | null = null;
let prefersDarkListener: ((e: MediaQueryListEvent) => void) | null = null;

export const importCss = async () => {
  const theme =  await PreferencesService.get('theme') || 'auto';
  //console.log('Current theme:', theme);

  // Remove theme classes
  document.documentElement.classList.remove('dark');
  document.body.classList.remove('dark');

  // Remove previous listener if it exists
  if (prefersDark && prefersDarkListener) {
    prefersDark.removeEventListener('change', prefersDarkListener);
    prefersDarkListener = null;
  }

  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  } else if (theme === 'auto') {
    prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    }
    // Define and add the listener
    prefersDarkListener = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    };
    prefersDark.addEventListener('change', prefersDarkListener);
  }
};

 

// Initialize router for API interceptors
initializeRouter(router);

const app = createApp(App)
app.use(IonicVue)
app.use(router);

router.isReady().then(async () => {
  await importCss();
  app.mount('#app');
});
