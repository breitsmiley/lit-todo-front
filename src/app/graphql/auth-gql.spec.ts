import { TestBed } from '@angular/core/testing';

import { AuthGQL } from './auth-gql';

describe('AuthGQL', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthGql = TestBed.get(AuthGql);
    expect(service).toBeTruthy();
  });
});
