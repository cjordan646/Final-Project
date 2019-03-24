import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddMealPage } from './add-meal';

@NgModule({
  declarations: [
    AddMealPage,
  ],
  imports: [
    IonicPageModule.forChild(AddMealPage),
  ],
})
export class AddMealPageModule {}
