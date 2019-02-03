import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController, Nav } from 'ionic-angular';
import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})


export class LoginPage {
  public passwordCheck: boolean;
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController, public formBuilder: FormBuilder, public nav: Nav) {
    this.passwordCheck = true;



    this.loginForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*'), Validators.minLength(4), Validators.maxLength(30)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.registerForm = formBuilder.group({
      usernameRegister: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*'), Validators.minLength(4), Validators.maxLength(30)])],
      fullnameRegister: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])],
      emailRegister: ['', Validators.compose([Validators.required, Validators.pattern('[.a-zäöüßÄÖÜA-Z0-9~]+@[a-zäöüßÄÖÜA-Z0-9~]+.[a-zäöüßÄÖÜA-Z0-9]+')])],
      passwordRegister: ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });
  }


  incorrect_user_pass() {
    let toast = this.toastCtrl.create({
      message: 'Incorrect username/password',
      duration: 3000,
      position: 'top',
      showCloseButton: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  have_account() {
    let toast = this.toastCtrl.create({
      message: 'Allready have an account!',
      duration: 3000,
      position: 'top',
      showCloseButton: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  welcome_user_pass() {
    let toast = this.toastCtrl.create({
      message: 'Welcome',
      duration: 3000,
      position: 'top',
      showCloseButton: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  no_password() {
    let toast = this.toastCtrl.create({
      message: 'Please enter a password also!',
      duration: 3000,
      position: 'top',
      showCloseButton: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  onSubmitLogin(value: any): void {
    if(this.loginForm.valid) {
      let xhr = new XMLHttpRequest();
      let that = this;
      let loginObject = {
        "username": value.username,
        "password": value.password
      }
      xhr.open("POST", "http://botezatuionut.com/wydder/api/login-data", true);
      xhr.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
          if(xhr.responseText != "Try again!") {
            let response = JSON.parse(xhr.responseText);
            window.localStorage.setItem("loggedUser", response.ID);
            that.nav.setRoot(HomePage);
          } else {
            that.incorrect_user_pass();
          }
        }
      }
      xhr.send(JSON.stringify(loginObject));
    }
    console.log(window.localStorage);
  }

  registerPageHandler(event) {

    document.getElementById('loginSection_id').classList.add('hidden');
    document.getElementById('registerSection_id').classList.remove('class', 'hidden');

  }

  registerBackButton(event) {
    document.getElementById('loginSection_id').classList.remove('hidden');
    document.getElementById('registerSection_id').classList.add('class', 'hidden');

  }

  onSubmitRegister(value: any): void {
    if(this.registerForm.valid) {
      let registerObject = {
        "username": value.usernameRegister,
        "password": value.passwordRegister,
        "email": value.emailRegister,
        "firstName": value.fullnameRegister
      }

      let that = this;
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "http://botezatuionut.com/wydder/api/register-data", true);
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          let response = xhr.responseText;
          if (response == "Already have an account") {
            that.have_account();
          } else {
            let response = JSON.parse(xhr.responseText);
            that.welcome_user_pass();
            console.log(response);
            window.localStorage.setItem("loggedUser", response.ID);
            that.navCtrl.push(HomePage);
          }
        }
      }
      xhr.send(JSON.stringify(registerObject));
    }
    console.log(window.localStorage);
  }
}
