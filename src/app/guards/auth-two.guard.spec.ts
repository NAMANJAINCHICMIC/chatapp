import { TestBed } from '@angular/core/testing';

import { AuthTwoGuard } from './auth-two.guard';

describe('AuthTwoGuard', () => {
  let guard: AuthTwoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthTwoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
