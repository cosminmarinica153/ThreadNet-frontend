import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from 'app/modules/auth/authentification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  imgSrc: string = "assets/icons/user.png";
  isLoggedIn: boolean = false;

  constructor(private router: Router, private authService: AuthentificationService) {}

  ngOnInit() {
    if(this.authService.getUser())
      this.isLoggedIn = true;
    else
      this.isLoggedIn = false;
  }

  toHome(){ this.router.navigate(['/']); }

}
