import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrevRunsPage } from './prev-runs';

@NgModule({
  declarations: [
    PrevRunsPage,
  ],
  imports: [
    IonicPageModule.forChild(PrevRunsPage),
  ],
})
export class PrevRunsPageModule {}
