import { Routes } from '@angular/router';
import {authGuard} from "./shared/guards/auth.guard";

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/workspace',
    },
    {
        path: 'auth',
        loadChildren: () =>
            import('./core/auth/auth.routes').then(
                (routes) => routes.authRoutes
            ),
    },
    {
        canActivate: [authGuard],
        path: 'workspace',
        loadChildren: () => import('./core/layout/main/main.routes').then(
            (routes) => routes.mainRoutes
        )
    },
    {
        canActivate: [authGuard],
        path: 'profile',
        loadComponent: () =>
            import('./workspace/leaflet-map/views/menu/profile/profile.component').then((c) => c.ProfileComponent),
    },
    {
        path: '**',
        redirectTo: '/workspace',
        pathMatch: 'full',
    },
];
