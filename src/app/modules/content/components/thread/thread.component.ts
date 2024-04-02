import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IThread } from 'app/core/models/api/IThread';
import { InteractionService } from '../../services/interaction.service';
import { BehaviorSubject, map, tap } from 'rxjs';
import { AuthentificationService } from 'app/modules/auth/authentification.service';
import { UserInteractions } from '@apiModel/interactions/UserInteractions';
import { Router } from '@angular/router';
import { UserService } from 'app/modules/info/user.service';
import { UserCreatedContent } from '@apiModel/interactions/UserCreatedContent';
import { ThreadService } from '../../services/thread.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UpdateThreadDto } from '@dto/UpdateThreadDto';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css']
})
export class ThreadComponent implements OnInit {
@Input() thread!: IThread;
@Output() deleteThreadEmit = new EventEmitter<any>();
@Output() favThread = new EventEmitter<any>();

  userInteractions!: UserInteractions | null
  userCreatedContent!: UserCreatedContent | null

  updateForm!: FormGroup;
  newThread!: UpdateThreadDto;
  submit: boolean = false;

  get title(){
    return this.updateForm.get('title') as FormControl;
  }
  get content(){
    return this.updateForm.get('content') as FormControl;
  }

  constructor(private interactionService: InteractionService, private authService: AuthentificationService, private router: Router,
              private userService: UserService, private threadService: ThreadService, private fb: FormBuilder) { }

  ngOnInit() {
    if(this.authService.getUser() != null){
      this.userInteractions = this.interactionService.getUserInteractions();
      this.userCreatedContent = this.interactionService.getUserCreatedContent();
    }

    this.createForm();
  }

  createForm(){
    this.updateForm = this.fb.group({
      title: [this.thread.title, [Validators.required]],
      content: [this.thread.content, [Validators.required]]
    })
  }

  onUpdateThread(){
    this.submit = true;

    if(!this.updateForm.valid)
      return;

    this.threadService.updateThread(this.updateData()).subscribe({
      next: () => {
        const currentUrl: string = decodeURIComponent(this.router.url)
        console.log(currentUrl);

        if(currentUrl.includes('thread'))
          this.router.navigate(['home']);
        else{
          this.thread.title = this.title.value;
          this.thread.content = this.content.value;
          this.isEditing = false;
        }
      }
    });

  }

  updateData(): UpdateThreadDto{
    return this.newThread = {
      id: this.thread.id,
      title: this.title.value,
      content: this.content.value
    }
  }

  isConfirmModalOpen: boolean = false;
  isEditing: boolean = false;

  toggleConfirmModal(){
    this.isConfirmModalOpen = !this.isConfirmModalOpen;
  }
  toggleEditing(){
    this.isEditing = !this.isEditing;
  }

  isUserThread(){
    if(this.userCreatedContent == null)
      return false;

    return this.userCreatedContent.threads.find(id => id == this.thread.id);
  }

  deleteThread(){
    this.threadService.deleteThread(this.thread.id).subscribe({
      next: () => {
        const url = decodeURIComponent(this.router.url);
        console.log(url);

        if(url.includes('thread'))
          this.router.navigate(['home']);
        else{
          this.deleteThreadEmit.emit({data: {thread: this.thread}})
          this.toggleConfirmModal();
        }
      }
    });
  }

  isFavourite(id: number): boolean{
    if(this.userInteractions == null)
      return false;

    if(this.userInteractions.favouriteThreads.find(threadId => threadId === id))
      return true;

    return false;
  }

  isUpVoted(id: number): boolean{
    if(this.userInteractions == null)
      return false;

    if(this.userInteractions.upVotedThreads.find(threadId => threadId === id))
      return true;

    return false;
  }

  isDownVoted(id: number): boolean{
    if(this.userInteractions == null)
      return false;

    if(this.userInteractions.downVotedThreads.find(threadId => threadId === id))
      return true;

    return false;
  }

  navigateToThread(){
    this.router.navigate(['thread', this.thread.id, this.thread.title]);
  }

  navigateToUser(){
    this.userService.getUser(this.thread.user.id).subscribe({
      next: user => {
        this.router.navigate(['user', user.id, user.username])
      }
    })
  }

  handleVoteEmit(event: any){
    const data = event['data'];

    if(this.thread.threadInteractions == undefined)
        return;

    if(data.action == '+'){
      if(data.target == 'upVote'){
        this.thread.threadInteractions.upVotes++;
        this.userInteractions?.upVotedThreads.push(data.contentId);
      }
      if(data.target == 'downVote'){
        this.thread.threadInteractions.downVotes++;
        this.userInteractions?.downVotedThreads.push(data.contentId);
      }
      if(data.target == 'favouriteThread'){
        this.userInteractions?.favouriteThreads.push(data.contentId);
        this.favThread.emit({data: {action: '+', thread: this.thread}})
      }
    }
    if(data.action == '-'){
      if(data.target == 'upVote'){
        this.thread.threadInteractions.upVotes--;
        this.userInteractions?.upVotedThreads.splice(this.userInteractions?.upVotedThreads.indexOf(data.contentId), 1);
      }
      if(data.target == 'downVote'){
        this.thread.threadInteractions.downVotes--;
        this.userInteractions?.downVotedThreads.splice(this.userInteractions?.downVotedThreads.indexOf(data.contentId), 1);
      }
      if(data.target == 'favouriteThread'){
        this.userInteractions?.favouriteThreads.splice(this.userInteractions?.favouriteThreads.indexOf(data.contentId), 1);
        this.favThread.emit({data: {action: '-', thread: this.thread}})
      }
    }

    if(this.userInteractions == null) return;
    this.interactionService.updateUserInteractions(this.userInteractions);
  }

}
