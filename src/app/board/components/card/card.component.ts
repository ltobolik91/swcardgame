import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { CardData, CardEntries } from '../../models/card-data.model';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'sw-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  providers: [TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent implements OnChanges {
  @Input() cardData: CardData<string> = {};

  constructor(private titleCasePipe: TitleCasePipe) {}

  dataEntries: CardEntries[] = [];

  ngOnChanges(): void {
    this.dataEntries = Object.entries(this.cardData).map(([key, value]) => {
      const mappedKey = this.mapToTitleCase(key);
      return { key: mappedKey, value };
    });
  }

  private mapToTitleCase(input: string): string {
    return input
      .split('_')
      .map((word) => this.titleCasePipe.transform(word))
      .join(' ');
  }
}
