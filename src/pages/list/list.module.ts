import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListPage } from './list';
import { StarRatingModule } from 'ionic3-star-rating';

@NgModule({
  declarations: [
    ListPage,
  ],
  imports: [
    StarRatingModule,
    IonicPageModule.forChild(ListPage),
  ],
})
export class ListPageModule { }
