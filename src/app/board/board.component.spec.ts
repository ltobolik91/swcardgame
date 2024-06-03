import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BoardComponent } from './board.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockPlayer } from './models/mock-player.model';
import { CardData } from './models/card-data.model';
import { Player } from './models/player.model';
import _ from 'lodash';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [BoardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should declare p1 as winner if p1Value > p2Value', () => {
    component.p1 = new MockPlayer({ someProperty: '10' });
    component.p2 = new MockPlayer({ someProperty: '5' });
    component['fetchedData'] = {
      someValue: [{ someProperty: '10' }, { someProperty: '5' }],
    };
    component['p1WonLabel'] = 'P1 Won!';
    component['selectedType'].setValue('someValue');
    component['categories'] = [
      {
        value: 'someValue',
        determinesWinningProperty: 'someProperty',
        viewValue: '',
      },
    ];

    spyOn(component['resultSubject$'], 'next');
    spyOn(component.p2, 'recordLoss').and.callThrough();
    spyOn(component.p1, 'recordWin').and.callThrough();
    spyOn(_, 'random').and.returnValues(0, 1);

    component.roll();

    expect(component.p1.recordWin).toHaveBeenCalled();
    expect(component.p2.recordLoss).toHaveBeenCalled();
    expect(component['resultSubject$'].next).toHaveBeenCalledWith('P1 Won!');
  });

  it('should declare p2 as winner if p2Value > p1Value', () => {
    component.p1 = new MockPlayer({ someProperty: '5' });
    component.p2 = new MockPlayer({ someProperty: '10' });
    component['fetchedData'] = {
      someValue: [{ someProperty: '5' }, { someProperty: '10' }],
    };
    component['p2WonLabel'] = 'P2 Won!';
    component['selectedType'].setValue('someValue');
    component['categories'] = [
      {
        value: 'someValue',
        determinesWinningProperty: 'someProperty',
        viewValue: '',
      },
    ];

    spyOn(component['resultSubject$'], 'next');
    spyOn(component.p2, 'recordWin').and.callThrough();
    spyOn(component.p1, 'recordLoss').and.callThrough();
    spyOn(_, 'random').and.returnValues(0, 1);

    component.roll();

    expect(component.p1.recordLoss).toHaveBeenCalled();
    expect(component.p2.recordWin).toHaveBeenCalled();
    expect(component['resultSubject$'].next).toHaveBeenCalledWith('P2 Won!');
  });

  it('should declare a draw if p1Value equals p2Value', () => {
    component.p1 = new MockPlayer({ someProperty: '10' });
    component.p2 = new MockPlayer({ someProperty: '10' });
    component['fetchedData'] = {
      someValue: [{ someProperty: '10' }, { someProperty: '10' }],
    };
    component['drawLabel'] = 'Draw !';
    component['selectedType'].setValue('someValue');
    component['categories'] = [
      {
        value: 'someValue',
        determinesWinningProperty: 'someProperty',
        viewValue: '',
      },
    ];

    spyOn(component['resultSubject$'], 'next');
    spyOn(component.p2, 'recordLoss').and.callThrough();
    spyOn(component.p1, 'recordLoss').and.callThrough();

    component.roll();

    expect(component.p1.recordLoss).toHaveBeenCalled();
    expect(component.p2.recordLoss).toHaveBeenCalled();
    expect(component['resultSubject$'].next).toHaveBeenCalledWith('Draw !');
  });

  it('should declare a draw if p1Value equals p2Value', () => {
    component.p1 = new MockPlayer({ someProperty: '10' });
    component.p2 = new MockPlayer({ someProperty: '10' });
    component['fetchedData'] = {
      someValue: [{ someProperty: '10' }, { someProperty: '10' }],
    };
    component.p1.card = { someProperty: '10' };
    component.p2.card = { someProperty: '10' };
    component['drawLabel'] = 'Draw !';
    component['selectedType'].setValue('someValue');
    component['categories'] = [
      {
        value: 'someValue',
        determinesWinningProperty: 'someProperty',
        viewValue: '',
      },
    ];

    spyOn(component['resultSubject$'], 'next');
    spyOn(component.p2, 'recordLoss').and.callThrough();
    spyOn(component.p1, 'recordLoss').and.callThrough();
    spyOn(_, 'random').and.returnValues(1, 1);

    component.roll();

    expect(component.p1.recordLoss).toHaveBeenCalled();
    expect(component.p2.recordLoss).toHaveBeenCalled();
    expect(component['resultSubject$'].next).toHaveBeenCalledWith('Draw !');
  });

  it('should declare p1 as winner if p2Value is NaN', () => {
    component.p1 = new MockPlayer({ someProperty: '10' });
    component.p2 = new MockPlayer({ someProperty: 'unknown' });
    component['fetchedData'] = {
      someValue: [{ someProperty: 'unknown' }, { someProperty: '10' }],
    };

    component['p2WonLabel'] = 'P2 Won!';
    component['selectedType'].setValue('someValue');
    component['categories'] = [
      {
        value: 'someValue',
        determinesWinningProperty: 'someProperty',
        viewValue: '',
      },
    ];

    spyOn(component.p2, 'recordLoss').and.callThrough();
    spyOn(component.p1, 'recordWin').and.callThrough();
    spyOn(component['resultSubject$'], 'next');
    spyOn(_, 'random').and.returnValues(1, 0);

    component.roll();

    expect(component.p2.recordLoss).toHaveBeenCalled();
    expect(component.p1.recordWin).toHaveBeenCalled();
    expect(component['resultSubject$'].next).toHaveBeenCalledWith('P1 Won!');
  });

  it('should declare p2 as winner if p1Value is NaN', () => {
    component.p1 = new MockPlayer({ someProperty: 'unknown' });
    component.p2 = new MockPlayer({ someProperty: '10' });
    component['fetchedData'] = {
      someValue: [{ someProperty: 'unknown' }, { someProperty: '10' }],
    };

    component['p2WonLabel'] = 'P2 Won!';
    component['selectedType'].setValue('someValue');
    component['categories'] = [
      {
        value: 'someValue',
        determinesWinningProperty: 'someProperty',
        viewValue: '',
      },
    ];

    spyOn(component.p1, 'recordLoss').and.callThrough();
    spyOn(component.p2, 'recordWin').and.callThrough();
    spyOn(component['resultSubject$'], 'next');
    spyOn(_, 'random').and.returnValues(0, 1);

    component.roll();

    expect(component.p1.recordLoss).toHaveBeenCalled();
    expect(component.p2.recordWin).toHaveBeenCalled();
    expect(component['resultSubject$'].next).toHaveBeenCalledWith('P2 Won!');
  });

  //   it('should declare a draw if both values are NaN', () => {
  //     component.p1 = new MockPlayer();
  //     component.p2 = new MockPlayer();
  //     component['fetchedData'] = {
  //       someValue: [{ someProperty: 'unknown' }, { someProperty: 'unknown' }],
  //     };
  //     component.p1.card = { someProperty: 'unknown' };
  //     component.p2.card = { someProperty: 'unknown' };
  //     component['drawLabel'] = 'Draw !';
  //     component['selectedType'].setValue('someValue');
  //     component['categories'] = [
  //       {
  //         value: 'someValue',
  //         determinesWinningProperty: 'someProperty',
  //         viewValue: '',
  //       },
  //     ];

  //     spyOn(component['resultSubject$'], 'next');

  //     component.roll();

  //     expect(component.p1.recordLoss).toHaveBeenCalled();
  //     expect(component.p2.recordLoss).toHaveBeenCalled();
  //     expect(component['resultSubject$'].next).toHaveBeenCalledWith('Draw !');
  //   });
  // });

  describe('Player', () => {
    let player: Player;

    beforeEach(() => {
      player = new Player();
    });

    it('should set card correctly', () => {
      const newCard: CardData<string> = { name: 'Luke Skywalker' };
      player.card = newCard;
      expect(player.card).toEqual(newCard);
    });

    it('should increase wins and streak when player wins', () => {
      player.recordWin();
      expect(player.wins).toBe(1);
      expect(player.streak).toBe(1);
      expect(player.currentWinner).toBeTrue();
    });

    it('should reset streak and set currentWinner to false when player loses', () => {
      player.streak = 5;
      player.currentWinner = true;
      player.recordLoss();
      expect(player.streak).toBe(0);
      expect(player.currentWinner).toBeFalse();
    });
  });
});
