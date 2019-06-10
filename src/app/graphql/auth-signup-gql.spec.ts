import { TestBed } from '@angular/core/testing';

import { AuthSignupGql } from './auth-signup-gql';

describe('AuthSignupGql', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthSignupGql = TestBed.get(AuthSignupGql);
    expect(service).toBeTruthy();
  });
});
