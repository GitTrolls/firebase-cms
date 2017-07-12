import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { MdSnackBar } from '@angular/material';
import { GlobalService } from '../global.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  posts: FirebaseListObservable<any>;
  newLink: string;
  newDate: string;
  newTitle: string;
  newDescription: string;
  newPublished: boolean;
  currentUser: any;

  constructor(public db: AngularFireDatabase, public snackBar: MdSnackBar, public globalService: GlobalService, public route: ActivatedRoute) {
    this.newPublished = false;
    this.posts = db.list('/posts');
    this.globalService.user.subscribe(user => {
      this.currentUser = user;
    });
  }

  addPost(newLink: string, newDate: string, newTitle: string, newDescription: string, newPublished: boolean) {
    let date = new Date(newDate);
    let dateTime = date.getTime();
    if (newLink && newDate && newTitle && newDescription && this.currentUser.uid) {
      this.posts.push({
        link: newLink,
        dateAdded: Date.now(),
        date: dateTime,
        title: newTitle,
        description: newDescription,
        published: newPublished,
        postedBy: this.currentUser.uid
      });

      this.newLink = null;
      this.newDate = null;
      this.newTitle = null;
      this.newDescription = null;
      this.newPublished = false;

      let snackBarRef = this.snackBar.open('Post saved', 'OK!', {
        duration: 3000
      });
    }
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
        if (params && params.key) {
          this.db.object('/posts/' + params.key).subscribe(p => {
            this.newLink = p.link;
            this.newDate = p.date;
            this.newTitle = p.title;
            this.newDescription = p.description;
            this.newPublished = p.published;
          });
        }
    });
  }

}

