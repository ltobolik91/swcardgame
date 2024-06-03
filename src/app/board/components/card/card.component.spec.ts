import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { CardData } from '../../models/card-data.model';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize dataEntries correctly on ngOnChanges', () => {
    const cardData: CardData<string> = {
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      gender: 'male',
    };

    component.cardData = cardData;
    component.ngOnChanges();

    const expectedDataEntries = [
      { key: 'Name', value: 'Luke Skywalker' },
      { key: 'Height', value: '172' },
      { key: 'Mass', value: '77' },
      { key: 'Hair Color', value: 'blond' },
      { key: 'Skin Color', value: 'fair' },
      { key: 'Eye Color', value: 'blue' },
      { key: 'Birth Year', value: '19BBY' },
      { key: 'Gender', value: 'male' },
    ];

    expect(component.dataEntries).toEqual(expectedDataEntries);
  });

  it('should map keys to title case in mapToTitleCase method', () => {
    const input = 'hair_color';
    const output = component['mapToTitleCase'](input);
    expect(output).toBe('Hair Color');
  });

  it('should handle empty cardData gracefully', () => {
    component.cardData = {};
    component.ngOnChanges();
    expect(component.dataEntries).toEqual([]);
  });
});