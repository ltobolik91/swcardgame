import { DestroyRef, Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SWApiService } from '../services/sw-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SWFetchedData } from './models/card-data.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private destroyRef = inject(DestroyRef);
  private fetchedDataSubject$: BehaviorSubject<SWFetchedData> =
    new BehaviorSubject<SWFetchedData>({});
  public fetchedData$: Observable<SWFetchedData> =
    this.fetchedDataSubject$.asObservable();

  constructor(private readonly swApiService: SWApiService) {}

  getSWData(newCategory: string): void {
    this.swApiService
      .fetchAllData(newCategory)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((newData) =>
        this.fetchedDataSubject$.next({
          ...this.fetchedDataSubject$.value,
          [newCategory]: newData,
        } as SWFetchedData),
      );
  }
}
