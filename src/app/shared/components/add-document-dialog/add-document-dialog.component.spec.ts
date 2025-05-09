import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDocumentDialogComponent } from './add-document-dialog.component';

describe('AddDocumentDialogComponent', () => {
  let component: AddDocumentDialogComponent;
  let fixture: ComponentFixture<AddDocumentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDocumentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
