import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  StoreRouterConnectingModule,
  DefaultRouterStateSerializer,
} from '@ngrx/router-store';
import { NxModule } from '@nrwl/angular';

import { authInterceptorInit } from '@hbx/auth';
import { UserStoreModule } from '@hbx/user/store';
import { ToastsModule } from '@hbx/shared/notifications/toasts';

import { AdminShellComponent } from './admin-shell/admin-shell.component';

@NgModule({
  imports: [
    CommonModule,
    // Routing
    RouterModule.forRoot(
      [
        {
          path: 'agencies',
          loadChildren: () =>
            import('@hbx/admin/agencies/feature').then(
              module => module.AdminAgenciesFeatureModule
            ),
        },
        // {
        //   path: '',
        //   redirectTo: 'agencies',
        //   pathMatch: 'full',
        // },
      ],
      { initialNavigation: 'enabled' }
    ),
    NxModule.forRoot(),

    // NgRx setup
    StoreModule.forRoot(
      {},
      {
        metaReducers: [],
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true,
        },
      }
    ),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument(),
    StoreRouterConnectingModule.forRoot({
      serializer: DefaultRouterStateSerializer,
    }),
    UserStoreModule,
    ToastsModule,
  ],
  providers: [authInterceptorInit],
  declarations: [AdminShellComponent],
  exports: [AdminShellComponent],
})
export class AdminShellModule {}
