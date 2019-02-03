import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreatePetPage } from './create-pet';

@NgModule({
  declarations: [
    CreatePetPage,
  ],
  imports: [
    IonicPageModule.forChild(CreatePetPage),
  ],
})
export class CreatePetPageModule {}
