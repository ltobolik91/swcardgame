import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BoardComponent, CardData, Player } from './board.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

class MockPlayer {
    card = {};
    wins = 0;
    streak = 0;
    currentWinner = false;
    playerWon = jasmine.createSpy('playerWon');
    playerLose = jasmine.createSpy('playerLose');
    setCard = jasmine.createSpy('setCard');
  }

describe('BoardComponent', () => {
    let component: BoardComponent;
    let fixture: ComponentFixture<BoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule 
      ],
      declarations: [
        BoardComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

     fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should declare p1 as winner if p1Value > p2Value', () => {
    component.p1 = new MockPlayer();
    component.p2 = new MockPlayer();
    component['fetchedData'] = {
        'someValue': [
          { someProperty: '10' },
          { someProperty: '5' }
        ]
      };
    component.p1.card = { someProperty: '10' };
    component.p2.card = { someProperty: '5' };
    component['p1WonLabel'] = 'P1 Won!';
    component['selectedType'].setValue('someValue');
    component['cardType'] = [{
        value: 'someValue', determinesWinningProperty: 'someProperty',
        viewValue: ''
    }];

    spyOn(component['resultSubject$'], 'next');

    component.roll();

    expect(component['p1'].playerWon).toHaveBeenCalled();
    expect(component['p2'].playerLose).toHaveBeenCalled();
    expect(component['resultSubject$'].next).toHaveBeenCalledWith('P1 Won!');
  });
  it('should declare p2 as winner if p2Value > p1Value', () => {
    component.p1 = new MockPlayer();
    component.p2 = new MockPlayer();
    component['fetchedData'] = {
      'someValue': [
        { someProperty: '5' },
        { someProperty: '10' }
      ]
    };
    component.p1.card = { someProperty: '5' };
    component.p2.card = { someProperty: '10' };
    component['p2WonLabel'] = 'P2 Won!';
    component['selectedType'].setValue('someValue');
    component['cardType'] = [{
        value: 'someValue', determinesWinningProperty: 'someProperty',
        viewValue: ''
    }];

    spyOn(component['resultSubject$'], 'next');

    component.roll();

    expect(component.p1.playerLose).toHaveBeenCalled();
    expect(component.p2.playerWon).toHaveBeenCalled();
    expect(component['resultSubject$'].next).toHaveBeenCalledWith('P2 Won!');
  });

  it('should declare a draw if p1Value equals p2Value', () => {
    component.p1 = new MockPlayer();
    component.p2 = new MockPlayer();
    component['fetchedData'] = {
      'someValue': [
        { someProperty: '10' },
        { someProperty: '10' }
      ]
    };
    component.p1.card = { someProperty: '10' };
    component.p2.card = { someProperty: '10' };
    component['drawLabel'] = 'Draw !';
    component['selectedType'].setValue('someValue');
    component['cardType'] = [{
        value: 'someValue', determinesWinningProperty: 'someProperty',
        viewValue: ''
    }];

    spyOn(component['resultSubject$'], 'next');

    component.roll();

    expect(component.p1.playerLose).toHaveBeenCalled();
    expect(component.p2.playerLose).toHaveBeenCalled();
    expect(component['resultSubject$'].next).toHaveBeenCalledWith('Draw !');
  });

  it('should declare p1 as winner if p2Value is NaN', () => {
    component.p1 = new MockPlayer();
    component.p2 = new MockPlayer();
    component['fetchedData'] = {
      'someValue': [
        { someProperty: '10' },
        { someProperty: 'unknown' }
      ]
    };
    component.p1.card = { someProperty: '10' };
    component.p2.card = { someProperty: 'unknown' };
    component['p1WonLabel'] = 'P1 Won!';
    component['selectedType'].setValue('someValue');
    component['cardType'] = [{
        value: 'someValue', determinesWinningProperty: 'someProperty',
        viewValue: ''
    }];

    spyOn(component['resultSubject$'], 'next');

    component.roll();

    expect(component.p1.playerWon).toHaveBeenCalled();
    expect(component.p2.playerLose).toHaveBeenCalled();
    expect(component['resultSubject$'].next).toHaveBeenCalledWith('P1 Won!');
  });

  it('should declare p2 as winner if p1Value is NaN', () => {
    component.p1 = new MockPlayer();
    component.p2 = new MockPlayer();
    component['fetchedData'] = {
      'someValue': [
        { someProperty: 'unknown' },
        { someProperty: '10' }
      ]
    };
    component.p1.card = { someProperty: 'unknown' };
    component.p2.card = { someProperty: '10' };
    component['p2WonLabel'] = 'P2 Won!';
    component['selectedType'].setValue('someValue');
    component['cardType'] = [{
        value: 'someValue', determinesWinningProperty: 'someProperty',
        viewValue: ''
    }];

    spyOn(component['resultSubject$'], 'next');

    component.roll();

    expect(component.p1.playerLose).toHaveBeenCalled();
    expect(component.p2.playerWon).toHaveBeenCalled();
    expect(component['resultSubject$'].next).toHaveBeenCalledWith('P2 Won!');
  });

  it('should declare a draw if both values are NaN', () => {
    component.p1 = new MockPlayer();
    component.p2 = new MockPlayer();
    component['fetchedData'] = {
      'someValue': [
        { someProperty: 'unknown' },
        { someProperty: 'unknown' }
      ]
    };
    component.p1.card = { someProperty: 'unknown' };
    component.p2.card = { someProperty: 'unknown' };
    component['drawLabel'] = 'Draw !';
    component['selectedType'].setValue('someValue');
    component['cardType'] = [{
        value: 'someValue', determinesWinningProperty: 'someProperty',
        viewValue: ''
    }];

    spyOn(component['resultSubject$'], 'next');

    component.roll();

    expect(component.p1.playerLose).toHaveBeenCalled();
    expect(component.p2.playerLose).toHaveBeenCalled();
    expect(component['resultSubject$'].next).toHaveBeenCalledWith('Draw !');
  });
});

describe('Player', () => {
    let player: Player;
  
    beforeEach(() => {
      player = new Player();
    });
  
    it('should set card correctly', () => {
      const newCard: CardData<string> = { name: 'Luke Skywalker' };
      player.setCard(newCard);
      expect(player.card).toEqual(newCard);
    });
  
    it('should increase wins and streak when player wins', () => {
      player.playerWon();
      expect(player.wins).toBe(1);
      expect(player.streak).toBe(1);
      expect(player.currentWinner).toBeTrue();
    });
  
    it('should reset streak and set currentWinner to false when player loses', () => {
      player.streak = 5;
      player.currentWinner = true;
      player.playerLose();
      expect(player.streak).toBe(0);
      expect(player.currentWinner).toBeFalse();
    });
  });


