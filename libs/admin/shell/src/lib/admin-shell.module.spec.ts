import { async, TestBed } from '@angular/core/testing';
import { AdminShellModule } from './admin-shell.module';

describe('AdminShellModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AdminShellModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(AdminShellModule).toBeDefined();
  });
});
