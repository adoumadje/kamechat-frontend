import { inject, Injectable, signal } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../configuration/auth-config';

@Injectable({
  providedIn: 'root'
})
export class AuthGoogleService {
  private oAuthService = inject(OAuthService);

  profile = signal<any>(null)

  constructor() {
    this.initConfiguration();
  }

  initConfiguration() {
    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
    
    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {

      if (this.oAuthService.hasValidIdToken()) {
        this.profile.set(this.oAuthService.getIdentityClaims());
        sessionStorage.setItem('my_token', this.oAuthService.getIdToken());
      }

    });

  }

  login() {
    this.oAuthService.initImplicitFlow();
  }

  logout() {
    this.oAuthService.revokeTokenAndLogout();
    this.oAuthService.logOut();
    this.profile.set(null);
  }

  getProfile() {
    return this.profile();
  }
}
