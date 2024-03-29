import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  searchText: string = '';
@Output() search = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {}

  onSearch(){
    this.search.emit({text: this.searchText});
  }

}
