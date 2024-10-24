import { TestBed } from '@angular/core/testing';

import { ActualUserService } from './actual-user.service';

describe('ActualUserService', () => {
  let service: ActualUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActualUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
