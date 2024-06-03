import { CardData } from "./card-data.model";
import { Player } from "./player.model";

export class MockPlayer extends Player {
  constructor(newCard: CardData<string>) {
    super();
    this.card = newCard; // Ustawienie karty w konstruktorze
  }

  override recordWin(): void {
    super.recordWin();
  }

  override recordLoss(): void {
    super.recordLoss();
  }
}
