import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { HttpClientModule } from '@angular/common/http';
import { BoardComponent } from './board/board.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [AppModule, ServerModule, HttpClientModule, CommonModule],
  bootstrap: [BoardComponent],
})
export class AppServerModule {}
