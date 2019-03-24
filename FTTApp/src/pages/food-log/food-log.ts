import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Health } from '@ionic-native/health';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';


/**
 * Generated class for the FoodLogPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-food-log',
  templateUrl: 'food-log.html',
  // providers: [FoodDatabaseProvider]
})
export class FoodLogPage {

  selectedDate: any;
  stepcount: any;
  bre: string = 'Breakfast';
  lun: string = 'Lunch';
  din: string = 'Dinner';
  sna: string = 'Snack';
  key: string;
  break: any = [];
  lunch: any = [];
  dinner: any = [];
  snack: any = [];
  totalCal =0;

//private storage: Storage
  constructor(public navCtrl: NavController, public navParams: NavParams, private health: Health,
    private sqlite: SQLite,
     ) {
    console.log(this.navParams.get('selectedDate'));
    this.selectedDate = navParams.get('selectedDate');
      

  //  Access the devices health data
    this.health.isAvailable()
    .then((available:boolean) => {
      console.log(available);
      this.health.requestAuthorization([
        'distance', 'nutrition',  //read and write permissions
        {
          read: ['steps'],       //read only permission
          write: ['height', 'weight']  //write only permission
        }
      ])
      .then(res => console.log(res))
      .catch(e => console.log(e));
      
    })
    .catch(e => console.log(e));
    this.loadstepData;

  }


loadstepData(){


  var stepOptions = {
    startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // last 24Hours
    endDate: new Date(), // now
    dataType: 'steps',
    unit: 'count'
  }

  
  this.health.query(stepOptions).then(data => {
    this.stepcount = data.values;
  }, err => {
    console.log('error steps: ', err)
  });
}

    //Retrieve Data from the Database
  getBreak() {
    //Database method
    this.sqlite.create({
      name: "tracker.db", 
      location:"default"})
      .then((db : SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS meals (id INTEGER PRIMARY KEY AUTOINCREMENT, meal TEXT, desc TEXT, calories TEXT, date TEXT)', [])
      .then(res => console.log('Meals table created'))
      .catch((error) => 
      console.log(error));
      db.executeSql('SELECT * FROM meals WHERE date ='+ this.selectedDate +' AND meal ='+ this.break +'', [])
      .then(res => {
        this.break = [];
        if (res.rows.length > 0) {
          for (var i =0; i < res.rows.length; i++) {
            this.break.push({
              name: res.rows.item[i].desc,
              calories: res.rows.item[i].calories
            });
          }
        }
      }).catch(e => console.log(e));
      db.executeSql('SELECT SUM(calories) AS totalCalories FROM meals WHERE date ='+ this.selectedDate +' AND meal ='+ this.break +'', [])
      .then(res => {
        if(res.rows.length>0) {
          this.totalCal = parseInt(res.rows.item(0).totalCalories);
        }
      })
    }).catch(e => console.log(e));
  }


    //Original Retrieval method using local Storage. 
    //No longer used as it overwrites data
    // this.key=this.bre
    //   this.storage.get(this.key).then(val => {
    //     console.log('Your breakfast was', val);
    //     if(val!=null && val !=undefined) {
    //     this.break = JSON.parse(val);
    //   }
    //   });

    getLunch() {
        //Database method
        this.sqlite.create({
          name: "tracker.db", 
          location:"default"})
          .then((db : SQLiteObject) => {
          db.executeSql('CREATE TABLE IF NOT EXISTS meals (id INTEGER PRIMARY KEY AUTOINCREMENT, meal TEXT, desc TEXT, calories TEXT, date TEXT)', [])
          .then(res => console.log('Meals table created'))
          .catch((error) => 
          console.log(error));
          db.executeSql('SELECT * FROM meals WHERE date ='+ this.selectedDate +' AND meal ='+ this.break +'', [])
          .then(res => {
            this.break = [];
            if (res.rows.length > 0) {
              for (var i =0; i < res.rows.length; i++) {
                this.break.push({
                  name: res.rows.item[i].desc,
                  calories: res.rows.item[i].calories
                });
              }
            }
          }).catch(e => console.log(e));
          db.executeSql('SELECT SUM(calories) AS totalCalories FROM meals WHERE date ='+ this.selectedDate +' AND meal ='+ this.break +'', [])
          .then(res => {
            if(res.rows.length>0) {
              this.totalCal = parseInt(res.rows.item(0).totalCalories)
            }
          })
        }).catch(e => console.log(e));
      }


    getDin() {
        //Database method
    this.sqlite.create({
      name: "tracker.db", 
      location:"default"})
      .then((db : SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS meals (id INTEGER PRIMARY KEY AUTOINCREMENT, meal TEXT, desc TEXT, calories TEXT, date TEXT)', [])
      .then(res => console.log('Meals table created'))
      .catch((error) => 
      console.log(error));
      db.executeSql('SELECT * FROM meals WHERE date ='+ this.selectedDate +' AND meal ='+ this.break +'', [])
      .then(res => {
        this.break = [];
        if (res.rows.length > 0) {
          for (var i =0; i < res.rows.length; i++) {
            this.break.push({
              name: res.rows.item[i].desc,
              calories: res.rows.item[i].calories
            });
          }
        }
      }).catch(e => console.log(e));
      db.executeSql('SELECT SUM(calories) AS totalCalories FROM meals WHERE date ='+ this.selectedDate +' AND meal ='+ this.break +'', [])
      .then(res => {
        if(res.rows.length>0) {
          this.totalCal = parseInt(res.rows.item(0).totalCalories)
        }
      })
    }).catch(e => console.log(e));
  }
    getSnack() {
    //Database method
    this.sqlite.create({
      name: "tracker.db", 
      location:"default"})
      .then((db : SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS meals (id INTEGER PRIMARY KEY AUTOINCREMENT, meal TEXT, desc TEXT, calories TEXT, date TEXT)', [])
      .then(res => console.log('Meals table created'))
      .catch((error) => 
      console.log(error));
      db.executeSql('SELECT * FROM meals WHERE date ='+ this.selectedDate +' AND meal ='+ this.break +'', [])
      .then(res => {
        this.break = [];
        if (res.rows.length > 0) {
          for (var i =0; i < res.rows.length; i++) {
            this.break.push({
              name: res.rows.item[i].desc,
              calories: res.rows.item[i].calories
            });
          }
        }
      }).catch(e => console.log(e));
      db.executeSql('SELECT SUM(calories) AS totalCalories FROM meals WHERE date ='+ this.selectedDate +' AND meal ='+ this.break +'', [])
      .then(res => {
        if(res.rows.length>0) {
          this.totalCal = parseInt(res.rows.item(0).totalCalories)
        }
      })
    }).catch(e => console.log(e));
  }
 

  ionViewDidLoad() {
    console.log('ionViewDidLoad FoodLogPage');
    console.log(this.navParams.get('selectedDate'));
    this.getBreak();
    this.getLunch();
    this.getLunch();
    this.getSnack();
  }

}
