import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PartformComponent} from './partform.component';
import {FormsModule} from '@angular/forms';
import {PartService} from '../services/part.service';
import {PartServiceFake} from '../services/fake-part.service';
import {RouterTestingModule} from '@angular/router/testing';

describe('PartformComponent', () => {
  let component: PartformComponent;
  let fixture: ComponentFixture<PartformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [PartformComponent],
      providers: [{provide: PartService, useClass: PartServiceFake}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
