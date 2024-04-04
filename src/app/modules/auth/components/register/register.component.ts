import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateUserDto } from '@dto/CreateUserDto';
import { AuthentificationService } from '../../authentification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  submit: boolean = false;
  registerForm!: FormGroup;
  user!: CreateUserDto;
  token!: string;

  get email(){
    return this.registerForm.get('email') as FormControl;
  }
  get username(){
    return this.registerForm.get('username') as FormControl;
  }
  get password(){
    return this.registerForm.get('password') as FormControl;
  }
  get confirmPwd(){
    return this.registerForm.get('confirmPwd') as FormControl;
  }
  // get terms(){
  //   return this.registerForm.get('terms') as FormControl;
  // }

  constructor(private fb: FormBuilder, private authService: AuthentificationService, private router: Router) { }

  ngOnInit() {
    this.token = this.generateUniqueToken(10);
    this.createForm();
  }

  createForm(){
    this.registerForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      username: [null, [Validators.required, Validators.minLength(5)]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmPwd: [null, [Validators.required]],
      // terms: [null, [Validators.required]]
    }, {validators: [this.confirmPwdValidation, /*this.checkTermsValidation*/]})
  }

  confirmPwdValidation(fg: AbstractControl): Validators | null{
    return fg.get('password')?.value === fg.get('confirmPwd')?.value ? null : { notMatched: true };
  }
  // checkTermsValidation(fg: AbstractControl): Validators | null{
  //   return fg.get('terms')?.value === true ? null : { notChecked: true };
  // }

  onRegister(){
    this.submit = true;

    if(!this.registerForm.valid){
      this.registerForm.reset();
      return;
    }

    this.authService.registerUser(this.userData()).subscribe({
      next: success => {
        if(success){
          this.submit = false;
          this.router.navigate(['/']);
        }
      },
      error: error => {
        if (error.message == 'Username already taken'){
          this.registerForm.setErrors({ notUnique: true })
        }

      }
    })
  }

  generateUniqueToken(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let token = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      token += characters.charAt(randomIndex);
    }

    const timestamp = Date.now().toString(36);
    token += timestamp;

    return token;
  }

  userData(): CreateUserDto{
    return this.user = {
      Username: this.username.value,
      Password: this.password.value,
      Email: this.email.value,
      IsVerified: 0,
      RegisterDate: new Date(),
      AuthToken: this.token,
      AuthKey: 0
    };
  }

}
