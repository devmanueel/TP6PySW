import { Routes } from '@angular/router';
import { SocioListComponent } from './components/socio-list/socio-list.component';

export const routes: Routes = [
    { 
        path: 'socios',loadComponent:()=>
        import('./components/socio-list/socio-list.component').then(m => m.SocioListComponent),
        title : 'Lista de Socios'
     },
     {
        path: 'socios/nuevo',
        loadComponent:()=>
        import('./components/socio-form/socio-form.component').then(m => m.SocioFormComponent),
        title : 'Nuevo Socio'
     },
     {
        path: 'socios/editar/:id',
        loadComponent:()=>
        import('./components/socio-form/socio-form.component').then(m => m.SocioFormComponent),
        title : 'Editar Socio'
     },
     {
        path:'', redirectTo:'/socios', pathMatch:'full'
     },
     {
        path:'**', redirectTo:'/socios'
     }
];
