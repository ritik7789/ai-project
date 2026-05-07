import { Routes } from '@angular/router';

import { ErpDocumentsPageComponent } from './features/erp-documents/erp-documents-page';
import { RagPageComponent } from './features/rag/rag-page';
import { UsersPageComponent } from './features/users/users-page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'users' },
  { path: 'users', component: UsersPageComponent },
  { path: 'erp-documents', component: ErpDocumentsPageComponent },
  { path: 'rag', component: RagPageComponent },
  { path: '**', redirectTo: 'users' }
];
