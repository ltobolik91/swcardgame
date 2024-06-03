import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, filter, map, switchMap, tap } from 'rxjs';
import _ from 'lodash';
import { Player } from './models/player.model';
import { DropdownOption } from './models/dropdown.model';
import { SWFetchedData } from './models/card-data.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BoardService } from './board.service';

@Component({
  selector: 'sw-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements OnInit {
  public categories: DropdownOption<string>[] = [
    { value: 'people', viewValue: 'People', determinesWinningProperty: 'mass' },
    {
      value: 'starships',
      viewValue: 'Starships',
      determinesWinningProperty: 'crew',
    },
    {
      value: 'vehicles',
      viewValue: 'Vehicles',
      determinesWinningProperty: 'crew',
    },
    {
      value: 'planets',
      viewValue: 'Planets',
      determinesWinningProperty: 'population',
    },
  ];

  public selectedType = new FormControl('');
  public p1: Player = new Player();
  public p2: Player = new Player();

  private fetchedData: SWFetchedData = {};
  private p1WonLabel = 'P1 Won!';
  private p2WonLabel = 'P2 Won!';
  private drawLabel = 'Draw !';
  private destroyRef = inject(DestroyRef);
  private fetchedData$ = this.boardService.fetchedData$;

  private isLoadingSubject$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private resultSubject$: BehaviorSubject<string> = new BehaviorSubject<string>(
    '',
  );

  public result$: Observable<string> = this.resultSubject$.asObservable();
  public isLoading$: Observable<boolean> =
    this.isLoadingSubject$.asObservable();

  constructor(private readonly boardService: BoardService) {}

  ngOnInit(): void {
    this.selectedType.valueChanges
      .pipe(
        filter((newCategory) => newCategory !== null),
        map((newCategory) => newCategory as string),
        filter((newCategory) => !this.fetchedData?.hasOwnProperty(newCategory)),
        tap(() => this.isLoadingSubject$.next(true)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((newCategory) => {
        this.boardService.getSWData(newCategory);
        this.isLoadingSubject$.next(false);
      });
    this.fetchedData$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((newFetchedData) => {
        this.fetchedData = newFetchedData;
        this.isLoadingSubject$.next(false);
      });
    this.selectedType.setValue(this.categories[0].value);
  }

  public roll(): void {
    const currentUsedType = this.fetchedData[this.selectedType.value as string];

    this.p1.card = currentUsedType[_.random(0, currentUsedType.length - 1)];
    this.p2.card = currentUsedType[_.random(0, currentUsedType.length - 1)];

    this.findWinner();
  }

  private findWinner(): void {
    this.resultSubject$.next('');

    // Find the winning property using Lodash's `find` with type safety
    const winningProperty: string | null =
      _.find(
        this.categories,
        (category) => category.value === this.selectedType.value,
      )?.determinesWinningProperty || null;

    if (!winningProperty) {
      return;
    }

    const player1Value = parseInt(this.p1.card[winningProperty] as string);
    const player2Value = parseInt(this.p2.card[winningProperty] as string);

    // Use Lodash's `isNaN` for type safety and potential null handling
    const bothValuesValid = !_.isNaN(player1Value) && !_.isNaN(player2Value);
    const bothValuesUnknown = _.isNaN(player1Value) && _.isNaN(player2Value);

    if (bothValuesValid) {
      if (player1Value > player2Value) {
        this.p1.recordWin();
        this.p2.recordLoss();
        this.resultSubject$.next(this.p1WonLabel);
      } else if (player2Value > player1Value) {
        this.p2.recordWin();
        this.p1.recordLoss();
        this.resultSubject$.next(this.p2WonLabel);
      } else {
        this.p1.recordLoss();
        this.p2.recordLoss();
        this.resultSubject$.next(this.drawLabel);
      }
    } else if (bothValuesUnknown) {
      this.p1.recordLoss();
      this.p2.recordLoss();
      this.resultSubject$.next(this.drawLabel);
    } else {
      // Handle cases where only one value is valid
      const winner = _.isNaN(player1Value) ? this.p2 : this.p1;
      winner.recordWin();
      const loser = winner === this.p1 ? this.p2 : this.p1;
      loser.recordLoss();
      this.resultSubject$.next(
        winner === this.p1 ? this.p1WonLabel : this.p2WonLabel,
      );
    }
  }
}
