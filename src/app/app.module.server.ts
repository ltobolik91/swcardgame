import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { HttpClientModule } from '@angular/common/http';
import { BoardComponent } from './board/board.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    HttpClientModule,
  ],
  bootstrap: [BoardComponent],
})
export class AppServerModule {}
