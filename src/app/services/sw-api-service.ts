import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, mergeMap, of } from 'rxjs';
import { omit } from 'lodash';

interface SwPageDTO<T> {
  count: number;
  next: string;
  previous: string | null;
  results: T[];
}

@Injectable({
  providedIn: 'root',
})
export class SWApiService {
  constructor(private httpClient: HttpClient) {}

  private url = 'https://swapi.dev/api/';
  private propertiesToRemove: string[] = [
    'url',
    'starships',
    'species',
    'vehicles',
    'created',
    'edited',
    'films',
    'homeworld',
    'pilots',
    'residents',
  ];

  public fetchAllData<T extends object>(type: string): Observable<T[]> {
    return this.fetchPage<T>(`${this.url}${type}`, []).pipe(
      map((swData) =>
        swData.map((element) => omit(element, this.propertiesToRemove) as T),
      ),
    );
  }

  private fetchPage<T>(url: string, accumulatedData: T[]): Observable<T[]> {
    return this.httpClient.get<SwPageDTO<T[]>>(url).pipe(
      mergeMap((response) => {
        accumulatedData = accumulatedData.concat(response.results as T);
        if (response.next) {
          return this.fetchPage(response.next, accumulatedData);
        } else {
          return of(accumulatedData);
        }
      }),
    );
  }
}
