import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SWApiService } from '../services/sw-api-service';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, filter, switchMap, tap } from 'rxjs';
import _ from 'lodash';
import { Player } from './models/player.model';
import { DropdownOption } from './models/dropdown.model';
import { SWFetchedData } from './models/card-data.model';

@Component({
  selector: 'sw-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements OnInit {
  cardType: DropdownOption<string>[] = [
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

  private isLoadingSubject$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> =
    this.isLoadingSubject$.asObservable();

  private resultSubject$: BehaviorSubject<string> = new BehaviorSubject<string>(
    '',
  );
  public result$: Observable<string> = this.resultSubject$.asObservable();

  constructor(private readonly swApiService: SWApiService) {}

  ngOnInit(): void {
    this.selectedType.valueChanges
      .pipe(
        filter(
          (newType) => !this.fetchedData.hasOwnProperty(newType as string),
        ),
        tap(() => this.isLoadingSubject$.next(true)),
        switchMap((newType) =>
          this.swApiService.fetchAllData(newType as string),
        ),
      )
      .subscribe((newData) => {
        const newType = this.selectedType.value as string;
        this.fetchedData = {
          ...this.fetchedData,
          [newType]: newData,
        } as SWFetchedData;
        this.isLoadingSubject$.next(false);
      });

    this.selectedType.setValue(this.cardType[0].value);
  }

  public roll(): void {
    const currentUsedType = this.fetchedData[this.selectedType.value as string];

    this.p1.setCard(currentUsedType[_.random(0, currentUsedType.length - 1)]);
    this.p2.setCard(currentUsedType[_.random(0, currentUsedType.length - 1)]);
    this.findWinner();
  }

  private findWinner(): void {
    this.resultSubject$.next('');
    const winningProperty: string | null =
      this.cardType.find((type) => type.value === this.selectedType.value)
        ?.determinesWinningProperty || null;

    if (!winningProperty) {
      return;
    }

    const p1Value = parseInt(this.p1.card[winningProperty] as string);
    const p2Value = parseInt(this.p2.card[winningProperty] as string);

    //In some cases property has value unknown in this case win card with value
    if (!isNaN(p1Value) && !isNaN(p2Value)) {
      if (p1Value > p2Value) {
        this.p1.playerWon();
        this.p2.playerLose();
        this.resultSubject$.next(this.p1WonLabel);
      } else if (p2Value > p1Value) {
        this.p2.playerWon();
        this.p1.playerLose();
        this.resultSubject$.next(this.p2WonLabel);
      } else {
        this.p1.playerLose();
        this.p2.playerLose();
        this.resultSubject$.next(this.drawLabel);
      }
    } else if (!isNaN(p1Value)) {
      this.p1.playerWon();
      this.p2.playerLose();
      this.resultSubject$.next(this.p1WonLabel);
    } else if (!isNaN(p2Value)) {
      this.p2.playerWon();
      this.p1.playerLose();
      this.resultSubject$.next(this.p2WonLabel);
    } else {
      this.p1.playerLose();
      this.p2.playerLose();
      this.resultSubject$.next(this.drawLabel);
    }
  }
}
