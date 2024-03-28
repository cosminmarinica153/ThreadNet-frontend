import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IThread } from '@apiModel/IThread';

@Component({
  selector: 'app-thread-list',
  templateUrl: './thread-list.component.html',
  styleUrls: ['./thread-list.component.css']
})
export class ThreadListComponent implements OnInit {
@Input() threads: IThread[] = [];

  constructor(private router: Router) { }

  ngOnInit() {
  }
}
