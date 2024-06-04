import { CardData } from './card-data.model';

export class Player {
  private _wins: number = 0;
  private _streak: number = 0;
  private _card: CardData<string> = {};
  private _currentWinner: boolean = false;

  get wins(): number {
    return this._wins;
  }

  get streak(): number {
    return this._streak;
  }

  get card(): CardData<string> {
    return this._card;
  }

  get currentWinner(): boolean {
    return this._currentWinner;
  }

  set card(newCard: CardData<string>) {
    this._card = newCard;
  }

  set streak(newStreak: number) {
    this._streak = newStreak;
  }

  set currentWinner(newCurrentWinner: boolean) {
    this._currentWinner = newCurrentWinner;
  }

  recordWin(): void {
    this._wins += 1;
    this._streak += 1;
    this._currentWinner = true;
  }

  recordLoss(): void {
    this._streak = 0;
    this._currentWinner = false;
  }
}
