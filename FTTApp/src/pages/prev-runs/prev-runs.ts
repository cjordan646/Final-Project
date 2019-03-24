import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { HealthKit, HealthKitOptions } from '@ionic-native/health-kit';

/**
 * Generated class for the PrevRunsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-prev-runs',
  templateUrl: 'prev-runs.html',
})
export class PrevRunsPage {
  stepcount = 'No Data';
  workouts = [];

  constructor(public navCtrl: NavController, private healthKit: HealthKit, private plt: Platform) {
    this.plt.ready().then(() => {
      this.healthKit.available().then(available => {
        if (available) {
          // Request all permissions up front if you like to
          var options: HealthKitOptions = {
            readTypes: [ 'HKQuantityTypeIdentifierStepCount', 'HKWorkoutTypeIdentifier', 'HKQuantityTypeIdentifierActiveEnergyBurned', 'HKQuantityTypeIdentifierdistanceWalkingRunning'],
            writeTypes: [ 'HKWorkoutTypeIdentifier', 'HKQuantityTypeIdentifierActiveEnergyBurned', 'HKQuantityTypeIdentifierdistanceWalkingRunning']
          }
          this.healthKit.requestAuthorization(options).then(_ => {
            this.loadWorkouts();
          })
        }
      });
    })
  }

  loadWorkouts() {
    var stepOptions = {
      startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      endDate: new Date(),
      sampleType: 'HKQuantityTypeIdentifierStepCount',
      unit: 'count'
    }
 
    this.healthKit.querySampleType(stepOptions).then(data => {
      let stepSum = data.reduce((a, b) => a + b.quantity, 0);
      this.stepcount = stepSum;
    }, err => {
      console.log('No steps: ', err);
    });
 
    this.healthKit.findWorkouts().then(data => {
      this.workouts = data;
    }, err => {
      console.log('no workouts: ', err);
      // Sometimes the result comes in here, very strange.
      this.workouts = err;
    });
 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrevRunsPage');
  }

}
