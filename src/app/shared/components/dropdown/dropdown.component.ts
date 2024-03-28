import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ICategory } from '@apiModel/ICategory';
import { DropdownItem } from '@interface/DropdownItem';
import { AuthentificationService } from 'app/modules/auth/authentification.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {
  @Input() imgSrc: string = '';
  @Input() dropdownItems: DropdownItem[] = [];
  @ViewChild('dropdown') dropdown: ElementRef | undefined;
  @Output() choice = new EventEmitter<any>();

  isDropdownOpen: boolean = false;
  isCategoryModalOpen: boolean = false;
  isThreadModalOpen: boolean = false;

  constructor(private authService: AuthentificationService, private router: Router) {}

  ngOnInit() {
  }

  toggleDropdown(){
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleCategoryModal(){
    this.choice.emit({data: 'category'});
    this.isCategoryModalOpen = !this.isCategoryModalOpen;
  }

  toggleThreadModal(){
    this.choice.emit({data: 'thread'});
    this.isThreadModalOpen = !this.isThreadModalOpen;
  }

  logout(){
    this.authService.logout();

    location.reload();
  }

  goToAccount(){
    var user = this.authService.getUser();
    if(user == undefined) return;

    this.router.navigate(['user', user.username], { state: { userData: user } })
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    if (this.isDropdownOpen && !this.dropdown?.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

}
