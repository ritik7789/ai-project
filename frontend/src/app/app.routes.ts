import { Routes } from '@angular/router';

import { ErpDocumentsCreatePageComponent } from './features/erp-documents/pages/erp-documents-create-page';
import { ErpDocumentsListPageComponent } from './features/erp-documents/pages/erp-documents-list-page';
import { HomePageComponent } from './features/home/home-page';
import { RagPageComponent } from './features/rag/rag-page';
import { UsersCreatePageComponent } from './features/users/pages/users-create-page';
import { UsersEditPageComponent } from './features/users/pages/users-edit-page';
import { UsersListPageComponent } from './features/users/pages/users-list-page';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'users', component: UsersListPageComponent },
  { path: 'users/new', component: UsersCreatePageComponent },
  { path: 'users/:id/edit', component: UsersEditPageComponent },
  { path: 'erp-documents', component: ErpDocumentsListPageComponent },
  { path: 'erp-documents/new', component: ErpDocumentsCreatePageComponent },
  { path: 'rag', component: RagPageComponent },
  { path: '**', redirectTo: '' }
];
