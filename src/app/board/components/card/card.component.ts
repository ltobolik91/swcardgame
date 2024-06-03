
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { CardData, CardEntries } from '../../models/card-data.model';

@Component({
    selector: 'sw-card',
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent implements OnChanges {
    @Input() cardData: CardData<string> = {}; 

    dataEntries: CardEntries[] = [];

    constructor(){}

    ngOnChanges(): void {
        this.dataEntries = Object.entries(this.cardData).map(([key, value]) => { 
            const mappedKey = this.mapToTitleCase(key)
            return { key:mappedKey, value }
        });
    }

    private mapToTitleCase(input: string): string {
            return input.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
}
