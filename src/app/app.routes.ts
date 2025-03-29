import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DocumentPanelComponent } from './document-panel/document-panel.component';
import { AuthGuard } from './auth/auth.guard';
import { RegistrationComponent } from './registration/registration.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'test-registration', component: RegistrationComponent },
    { path: 'document-control-panel', component: DocumentPanelComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'login' }
];
