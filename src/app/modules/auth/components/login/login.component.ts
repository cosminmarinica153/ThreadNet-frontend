import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthentificationService } from '../../authentification.service';
import { Router } from '@angular/router';
import { Credentials } from '@apiModel/Credentials';
import { map } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  submit: boolean = false;
  loginForm!: FormGroup;
  credentials!: Credentials;

  get username(){
    return this.loginForm.get('username') as FormControl;
  }
  get password(){
    return this.loginForm.get('password') as FormControl;
  }

  constructor(private fb: FormBuilder, private authService: AuthentificationService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(){
    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    })
  }

  onLogin(){
    this.submit = true;

    if(!this.loginForm.valid){
      this.loginForm.reset();
      return;
    }

    this.authService.loginUser(this.userCredentials()).subscribe({
      next: user => {
        this.authService.setUser(user).subscribe({
          next: () => {
            this.submit = false;

            this.router.navigate(['/']).then(() => { location.reload() });
          }
        });
      },
      error: error => {
        if (error.message === 'User not Found') {
            this.loginForm.setErrors({ notFound: true });
        }
      },
    })
  }

  userCredentials(): Credentials{
    return this.credentials = {
      Username: this.username.value,
      Password: this.password.value
    }
  }

}
