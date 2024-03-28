import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-submit-btn',
  templateUrl: './submit-btn.component.html',
  styleUrls: ['./submit-btn.component.css']
})
export class SubmitBtnComponent implements OnInit {
@Output() submit = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  submitForm(){
    this.submit.emit();
  }

}
