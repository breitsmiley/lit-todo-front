import { TestBed } from '@angular/core/testing';

import { AuthLoginGql } from './auth-login-gql';

describe('AuthGQL', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthLoginGql = TestBed.get(AuthLoginGql);
    expect(service).toBeTruthy();
  });
});
