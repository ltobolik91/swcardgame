import { CardData } from "./card-data.model";


export class Player {
    wins: number = 0;
    streak: number = 0;
    card: CardData<string> = {};
    currentWinner: boolean = false;
  
    setCard(newCard:CardData<string>): void{
      this.card = newCard;
    }
  
    playerWon(): void {
      this.wins +=1;
      this.streak +=1;
      this.currentWinner = true;
    }

    playerLose(): void {
      this.streak = 0;
      this.currentWinner = false;
    }
  }