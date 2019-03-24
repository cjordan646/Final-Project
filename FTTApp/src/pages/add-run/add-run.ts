// import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

/**
 * Generated class for the AddRunPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


declare var google;

@IonicPage()

@Component({
  selector: 'page-add-run',
  templateUrl: 'add-run.html',
})
export class AddRunPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  currentMapTrack = null;

  isTracking = false;
  trackedRoute = [];
  previousRoutes = [];

  positionSubscription: Subscription;
  finishTime : any;
  startTime : any;
  speed = [];
  avgSpeed : any;
  totSpeed : any;
  dist: any;

  // private storage: Storage
  constructor(public navCtrl: NavController, private platform: Platform,
    private geolocation: Geolocation, private sqlite: SQLite) {

  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.loadHistoricRoutes();

      let mapOptions = {
        zoom: 13,
        mapTypeId: google.maps.mapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullScreenControl: false
      };

      this.map = new google.mpas.Map(this.mapElement.nativeElement, mapOptions);
    
      this.geolocation.getCurrentPosition().then(pos => {
        let LatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        this.map.setCenter(LatLng);
        this.map.setZoom(15);
      });
    });
  }

  loadHistoricRoutes() {
    // this.storage.get('routes').then(data => {
    //   if (data) {
    //     this.previousRoutes=data;
    //   }
    // });

    this.sqlite.create({
      name: "tracker.db", 
      location:"default"})
      .then((db : SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS routes (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT, startTime TEXT, endTime TEXT, speed NUMBER, dist NUMBER)', [])
      .then(res => console.log('Routes table created'))
      .catch((error) => {
      console.log(error);
      db.executeSql('SELECT path, endTime FROM routes', [])
      .then(res => {
        if(res.rows.length > 0) {
          for (var i =0; i < res.rows.length; i++) {
            this.previousRoutes.push({
              finished: res.rows.item[i].endTime,
              path: res.rows.item[i].path
            });
          }
        }
      }).catch(e => console.log(e));
     });
    }).catch(e => console.log(e));
  }

  startRun() {
    this.isTracking = true;
    this.trackedRoute = [];
    this.startTime = new Date().getTime();

    this.positionSubscription = this.geolocation.watchPosition()
    .filter(p => p.coords !== undefined)  //Filter out any error that occur
    .subscribe(data => {
      setTimeout(() => {
        this.trackedRoute.push({ lat: data.coords.latitude, lng: data.coords.longitude});
        this.redrawPath(this.trackedRoute);
        this.speed.push({Speed: data.coords.speed});

        
      });
    })
  }

  redrawPath(path) {
    if (this.currentMapTrack) {
      this.currentMapTrack.setMap(null);
    }

    if(path.length > 1) {
      this.currentMapTrack = new google.maps.Polyline({
        path: path,
        geodesic: false,
        strokeColor: '#ff00ff',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });

      this.currentMapTrack.setMap(this.map);
    }
  }

  stopRun() {

    let newRoute = { finished: new Date().getTime(), path: this.trackedRoute};
    this.finishTime = new Date().getTime();
    this.previousRoutes.push(newRoute);
    
    //Calculate Average Speed
    for(var i = 0; i <= this.trackedRoute.length; i++){
        this.totSpeed = this.totSpeed + this.speed[i];   
    }
    this.avgSpeed = this.totSpeed / this.speed.length;

    //Calculate total distance
    for(var i = 0; i <= this.trackedRoute.length; i++){
      this.dist = this.dist + this.trackedRoute[i].distance.value;   
    }


    //Using a defined datasbase
    this.sqlite.create({
      name: "tracker.db", 
      location:"default"})
      .then((db : SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS routes (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT, startTime TEXT, endTime TEXT, speed NUMBER, dist NUMBER)', [])
      .then(res => console.log('Routes table created'))
      .catch((error) => {
      console.log(error);
     })

    db.executeSql('INSERT INTO routes(path, startTime, endTime, speed) VALUES (?, ?, ?, ?, ?)',
      [this.trackedRoute, this.startTime, this.finishTime, this.avgSpeed, this.dist])
      .then((res) => {
        console.log(res);
        this.isTracking = false;
        this.positionSubscription.unsubscribe();
        this.currentMapTrack.setMap(null);
       }, (error) => {
        console.log(error);
        });
  });

    //using local storage
   // this.previousRoutes.push(newRoute);
   // this.storage.set('routes', this.previousRoutes);

    // this.isTracking = false;
    // this.positionSubscription.unsubscribe();
    // this.currentMapTrack.setMap(null);
  }

  showHistoricRunRoute(route){
    this.redrawPath(route);
  }


}
