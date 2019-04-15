import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
/* @IonicPage({ priority: 'high', segment: 'tabs' }) */
@Component({
    selector: 'page-tabs',
    templateUrl: 'tab.html',
})
export class TabPage {
    form = 'HomePage';
    ProfilePage = 'ProfilePage';
    AddItemPage = 'AddItemPage';
    ListPage = 'ListPage';
    myIndex;
    constructor(public navCtrl: NavController, public navParams: NavParams) {
        console.log('navParams.data.tabIndex :: ' + navParams.data.tabIndex);
        this.myIndex = this.navParams.get('tabIndex');
    }


}