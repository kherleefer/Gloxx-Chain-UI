import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { PreferencesService } from '@/services/preferencesService';

export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const token = await PreferencesService.get('token');
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !token) {
    return next('/login');
  }

  next();
}