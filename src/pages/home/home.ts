import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { LoadingController, ToastController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LoginPage } from "../login/login";

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {


  imageURI: any;
  imageFileName: any;

  addPetForm: FormGroup;
  public pet_name: string;
  public pet_fullname: string;
  public birth_date: any;
  public pet_gender: string;
  public greutate_pet: string;
  public culoare_pet: string;
  public deparazitare_interna_pet: any;
  public deparazitare_externa_pet: any;
  public userPetId: number;
  public vaccin_pet: any;
  public link_profile_picture: any;

  public loggedUser: string;
  public current_pet: {
    "pet_name": string;
    "birth_date": string;
    "pet_fullname": string;
    "rasa_pet": string;
    "pet_gender": string;
    "age": number;
    "userPetId": number;
    "greutate_pet": number;
    "culoare_pet": string;
    "deparazitare_interna_pet": string;
    "deparazitare_externa_pet": string;
    "vaccin_pet": string;
    "link_profile_picture": string;
  };

  public pets_of_user: Array<any>;

  constructor(private file: File, public localNotifications: LocalNotifications, private transfer: FileTransfer, public toastCtrl: ToastController, private camera: Camera, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
    this.loggedUser = window.localStorage.getItem('loggedUser');
    this.checkForPetsOfUser();

    this.addPetForm = formBuilder.group({
      pet_name: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*'), Validators.minLength(4), Validators.maxLength(30)])],
      pet_fullname: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*'), Validators.minLength(4), Validators.maxLength(30)])],
      pet_type: [''],
      birth_date: [''],
      rasa_pet: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*'), Validators.minLength(4), Validators.maxLength(30)])],
      pet_gender: [''],
      greutate_pet: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(4)])],
      culoare_pet: [''],
      deparazitare_interna_pet: [''],
      deparazitare_externa_pet: [''],
      vaccin_pet: [''],
      link_profile_picture: ['']
    });
  }
  // public presentActionSheet() {
  //   let actionSheet = this.actionSheetCtrl.create({
  //     title: 'Select Image Source',
  //     buttons: [
  //       {
  //         text: 'Load from Library',
  //         handler: () => {
  //           this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
  //         }
  //       },
  //       {
  //         text: 'Use Camera',
  //         handler: () => {
  //           this.takePicture(this.camera.PictureSourceType.CAMERA);
  //         }
  //       },
  //       {
  //         text: 'Cancel',
  //         role: 'cancel'
  //       }
  //     ]
  //   });
  //   actionSheet.present();
  // }

  getImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = imageData;
      this.presentToast(this.imageURI);

    }, (err) => {
      console.log(err);
      this.presentToast(err);
    });
  }

  // uploadFile() {
  //   let loader = this.loadingCtrl.create({
  //     content: "Uploading..."
  //   });
  //   //PLACE onSubmitPetAdd function inside uploaded succesfull
  //   loader.present();
  //   const fileTransfer: FileTransferObject = this.transfer.create();
  //
  //   let options: FileUploadOptions = {
  //     fileKey: this.userPetId + 'ionicfile',
  //     fileName: this.userPetId + 'ionicfile',
  //     chunkedMode: false,
  //     mimeType: "image/jpeg",
  //     headers: {}
  //   };
  //
  //   fileTransfer.upload(this.imageURI, 'http://botezatuionut.com/wydder/api/uploadPictures', options)
  //     .then((data) => {
  //       console.log(data.response);
  //       this.imageFileName = "vasile.jpg"
  //       loader.dismiss();
  //       this.checkForPetsOfUser();
  //       this.presentToast( JSON.stringify(data) + "Image uploaded successfully");
  //     }, (err) => {
  //       console.log(err);
  //       loader.dismiss();
  //       this.presentToast(err);
  //     });
  // }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: JSON.stringify(msg),
      duration: 30000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  logout(): void {
    window.localStorage.removeItem('loggedUser');

    this.navCtrl.setRoot(LoginPage);
    this.navCtrl.popToRoot();
  }



  public checkForPetsOfUser(): void {
    let userID = {
      "userID": this.loggedUser
    }


    let dataPets;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://botezatuionut.com/wydder/api/checkForCreatedPet", true);
    var that = this;
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
        dataPets = JSON.parse(xhr.responseText);
        that.pets_of_user = dataPets;
        that.setNotif();
        console.log(that.pets_of_user);
      }
    }
    this.current_pet = {
      "pet_name": '',
      "birth_date": '',
      "pet_fullname": '',
      "rasa_pet": '',
      "pet_gender": '',
      "userPetId": 0,
      "age": 0,
      "greutate_pet": 0,
      "culoare_pet": '',
      "deparazitare_interna_pet": '',
      "deparazitare_externa_pet": '',
      "vaccin_pet": '',
      "link_profile_picture": ''
    };
    xhr.send(JSON.stringify(userID));
  }

  onSubmitPetAdd(value: any) :void {
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    //PLACE onSubmitPetAdd function inside uploaded succesfull
    loader.present();
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: this.userPetId + 'ionicfile',
      fileName: this.userPetId + 'ionicfile',
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {}
    };

    fileTransfer.upload(this.imageURI, 'http://botezatuionut.com/wydder/api/uploadPictures', options)
      .then((data) => {
        console.log(data.response);
        this.imageFileName = "vasile.jpg"
        loader.dismiss();
        this.checkForPetsOfUser();
        this.presentToast(JSON.stringify(data) + "Image uploaded successfully");
        if (this.addPetForm.valid) {
          let pet_details_object = {
            "loggedUser": window.localStorage.getItem("loggedUser"),
            "pet_name": value.pet_name,
            "pet_fullname": value.pet_fullname,
            "birth_date": value.birth_date,
            "pet_type": value.pet_type,
            "rasa_pet": value.rasa_pet,
            "pet_gender": value.pet_gender,
            "greutate_pet": value.greutate_pet,
            "culoare_pet": value.culoare_pet,
            "deparazitare_interna_pet": value.deparazitare_interna_pet,
            "deparazitare_externa_pet": value.deparazitare_externa_pet,
            "vaccin_pet": value.vaccin_pet,
            "link_profile_picture": data.response.split('"')[1]
          }

          let xhr = new XMLHttpRequest();
          var that = this;
          xhr.open("POST", "http://botezatuionut.com/wydder/api/addPetMobileApk", true);
          xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
              document.getElementById('edit_btn').classList.add('hide');
              document.getElementById('my_pets').classList.remove('hide');
              document.getElementById('save_btn').classList.add('hide');
              document.getElementById('cancel_btn').classList.add('hide');
              document.getElementById('view_pet').classList.add('hide');
              document.getElementById('add_pet').classList.add('hide');
              document.getElementById('add_pet_btn').classList.remove('hide');
              that.checkForPetsOfUser();
            }
          }
          xhr.send(JSON.stringify(pet_details_object));
        }
        this.addPetForm.reset();
      }, (err) => {
        console.log(err);
        loader.dismiss();
        this.presentToast(err);
      });
  }
  setNotif() {
    this.localNotifications.clearAll();
    for(var i = 0 ; i < this.pets_of_user.length ; i++) {
      this.oneNotif(new Date(this.pets_of_user[i].birth_date), 'annual vaccine');
    }
  }


  oneNotif(date, type) {
    console.log(date);
    console.log(new Date(date.getTime() + 432000000 + 12900000 + 21600000 - 2100000 + 1500000));
    this.localNotifications.schedule({
      text: 'You should make the ' + type + ' for youre pet.',
      at: new Date(date.getTime() + 464400000 + 1500000),
      led: 'FF0000',
      sound: true ? 'file://sound.mp3': 'file://beep.caf'
    });
  }


  add_pet_btn() {
    document.getElementById('my_pets').classList.add('hide');
    document.getElementById('add_pet').classList.remove('hide');
    document.getElementById('log_out').classList.add('hide');
    document.getElementById('back_to_my_pets').classList.remove('hide');
    document.getElementById('add_pet_btn').classList.add('hide');
  }

  show_pet(userPetId) {
    for(let i = 0 ; i < this.pets_of_user.length ; i++) {
      if(userPetId == this.pets_of_user[i].userPetId) {
        this.current_pet = this.pets_of_user[i];
        let birthDatePet = this.pets_of_user[i].birth_date;
        birthDatePet = birthDatePet.split("-")[0];
        let age = (new Date().getFullYear() - birthDatePet);

        this.current_pet.age = age;
      }
    }

    document.getElementById('view_pet').classList.remove('hide');
    document.getElementById('my_pets').classList.add('hide');
    document.getElementById('delete_pet').classList.remove('hide');
    document.getElementById('back_to_my_pets').classList.remove('hide');
    document.getElementById('log_out').classList.add('hide');
    document.getElementById('add_pet').classList.add('hide');
    document.getElementById('edit_btn').classList.remove('hide');
    document.getElementById('add_pet_btn').classList.add('hide');
  }

  delete_btn() {
    var confirm = this.alertCtrl.create({
      title: 'Delete this pet?',
      message: 'Are you sure you want to delete your pet? All the information will be gone!',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked');
            let deletePetObject = {
              "userPetId": this.current_pet.userPetId,
            }
            let xhr = new XMLHttpRequest();
            xhr.open("POST","http://botezatuionut.com/wydder/api/deletePetMobileApk",true);
            var that = this;
            xhr.onreadystatechange = function() {
              if (xhr.readyState == 4 && xhr.status == 200) {
                document.getElementById('my_pets').classList.remove('hide');
                document.getElementById('view_pet').classList.add('hide');
                document.getElementById('back_to_my_pets').classList.add('hide');
                document.getElementById('delete_pet').classList.add('hide');
                document.getElementById('log_out').classList.remove('hide');
                document.getElementById('add_pet').classList.add('hide');
                document.getElementById('add_pet_btn').classList.remove('hide');
                document.getElementById('edit_btn').classList.add('hide');
                that.checkForPetsOfUser();
              }
            }
            xhr.send(JSON.stringify(deletePetObject));
          }
        }
      ]
    });
    confirm.present();
  }

  back_btn() {
    document.getElementById('my_pets').classList.remove('hide');
    document.getElementById('view_pet').classList.add('hide');
    document.getElementById('back_to_my_pets').classList.add('hide');
    document.getElementById('log_out').classList.remove('hide');
    document.getElementById('add_pet_btn').classList.remove('hide');
    document.getElementById('delete_pet').classList.add('hide');
    document.getElementById('edit_btn').classList.add('hide');
    document.getElementById('add_pet').classList.add('hide');
    document.getElementById('save_btn').classList.add('hide');
    document.getElementById('cancel_btn').classList.add('hide');
  }

  edit_pet() {
    for(let j = 0 ; j < document.getElementsByClassName('detail_of_pet').length ; j++) {
      document.getElementsByClassName('detail_of_pet')[j].classList.add('hide');
    }
    for(let k = 0 ; k < document.getElementsByClassName('edit_input').length ; k++) {
      document.getElementsByClassName('edit_input')[k].classList.remove('hide');
    }

    document.getElementById('edit_btn').classList.add('hide');
    document.getElementById('save_btn').classList.remove('hide');
    document.getElementById('cancel_btn').classList.remove('hide');
  }

  cancel_update_pet() {
    for(let j = 0 ; j < document.getElementsByClassName('detail_of_pet').length ; j++) {
      document.getElementsByClassName('detail_of_pet')[j].classList.remove('hide');
    }
    for(let k = 0 ; k < document.getElementsByClassName('edit_input').length ; k++) {
      document.getElementsByClassName('edit_input')[k].classList.add('hide');
    }

    document.getElementById('edit_btn').classList.remove('hide');
    document.getElementById('save_btn').classList.add('hide');
    document.getElementById('cancel_btn').classList.add('hide');
  }

  save_pet() {
    for(let j = 0 ; j < document.getElementsByClassName('detail_of_pet').length ; j++) {
      document.getElementsByClassName('detail_of_pet')[j].classList.remove('hide');
    }

    for(let k = 0 ; k < document.getElementsByClassName('edit_input').length ; k++) {
      document.getElementsByClassName('edit_input')[k].classList.add('hide');
    }

    let confirm = this.alertCtrl.create({
      title: 'Update this pet?',
      message: 'Are you sure you want to update your pet? All the information will be saved!',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked');
            let update_pet_object = {
              "user_pet_id": this.current_pet.userPetId,
              "nickname_pet_value": this.current_pet.pet_name,
              "fullname_pet_value": this.current_pet.pet_fullname,
              "birth_date_pet_value": this.current_pet.birth_date,
              "rasa_pet_value": this.current_pet.rasa_pet,
              "gender_pet_value": this.current_pet.pet_gender,
              "greutate_pet_value": this.current_pet.greutate_pet,
              "culoare_pet_value": this.current_pet.culoare_pet,
              "depint_pet_value": this.current_pet.deparazitare_interna_pet,
              "depext_pet_value": this.current_pet.deparazitare_externa_pet,
              "vaccin_pet_value": this.current_pet.vaccin_pet
            }

            let xhr = new XMLHttpRequest();
            xhr.open("POST","http://botezatuionut.com/wydder/api/updatePet",true);
            var that = this;
            xhr.onreadystatechange = function() {
              if (xhr.readyState == 4 && xhr.status == 200) {
                that.checkForPetsOfUser();
                document.getElementById('edit_btn').classList.add('hide');
                document.getElementById('my_pets').classList.remove('hide');
                document.getElementById('save_btn').classList.add('hide');
                document.getElementById('cancel_btn').classList.add('hide');
                document.getElementById('view_pet').classList.add('hide');
                document.getElementById('delete_pet').classList.add('hide');
                document.getElementById('add_pet_btn').classList.remove('hide');
              }
            }
            xhr.send(JSON.stringify(update_pet_object));
          }
        }
      ]
    });
    confirm.present();




  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

}
