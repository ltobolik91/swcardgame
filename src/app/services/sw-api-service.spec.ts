import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SWApiService } from './sw-api-service';

describe('SWApiService', () => {
  let service: SWApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SWApiService],
    });
    service = TestBed.inject(SWApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all data for a given type', () => {
    const mockResponse = {
      count: 3,
      next: null,
      previous: null,
      results: [
        { name: 'Luke Skywalker', height: '172', gender: 'male' },
        { name: 'Leia Organa', height: '150', gender: 'female' },
        { name: 'Darth Vader', height: '202', gender: 'male' },
      ],
    };

    const type = 'people';
    service.fetchAllData(type).subscribe((data: string | object[]) => {
      expect(data.length).toBe(3);
      expect(data).toEqual(mockResponse.results);
    });

    const req = httpMock.expectOne(`https://swapi.dev/api/${type}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should remove specified properties from fetched data', () => {
    const mockResponse = {
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'Tatooine', url: 'something', edited: 'something' }],
    };

    const type = 'planets';
    service.fetchAllData(type).subscribe((data) => {
      expect(data.length).toBe(1);
      expect(data[0]).toEqual({ name: 'Tatooine' });
      expect(data[0].hasOwnProperty('url')).toBeFalse();
      expect(data[0].hasOwnProperty('edited')).toBeFalse();
    });

    const req = httpMock.expectOne(`https://swapi.dev/api/${type}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle an empty response', () => {
    const mockResponse = {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };

    const type = 'species';
    service.fetchAllData(type).subscribe((data) => {
      expect(data.length).toBe(0);
    });

    const req = httpMock.expectOne(`https://swapi.dev/api/${type}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch all pages of data recursively', () => {
    const mockResponse1 = {
      count: 2,
      next: 'https://swapi.dev/api/people/?page=2',
      previous: null,
      results: [{ name: 'Luke Skywalker', height: '172', gender: 'male' }],
    };

    const mockResponse2 = {
      count: 2,
      next: null,
      previous: 'https://swapi.dev/api/people/?page=1',
      results: [{ name: 'Leia Organa', height: '150', gender: 'female' }],
    };

    const type = 'people';

    service['fetchPage'](`${service['url']}${type}`, []).subscribe((data) => {
      // Sprawdź, czy dane zostały poprawnie pobrane
      expect(data.length).toBe(2);
      expect(data).toEqual([
        { name: 'Luke Skywalker', height: '172', gender: 'male' },
        { name: 'Leia Organa', height: '150', gender: 'female' },
      ]);
    });

    // Oczekujemy na jedno zapytanie HTTP za każdym razem, gdy funkcja fetchPage jest wywoływana
    const req1 = httpMock.expectOne(`https://swapi.dev/api/${type}`);
    expect(req1.request.method).toBe('GET');
    req1.flush(mockResponse1);

    const req2 = httpMock.expectOne('https://swapi.dev/api/people/?page=2');
    expect(req2.request.method).toBe('GET');
    req2.flush(mockResponse2);
  });
});
