import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { MdSnackBar } from '@angular/material';
import { GlobalService } from '../global.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.css']
})
export class AddPageComponent implements OnInit {

  pages: FirebaseListObservable<any>;
  page: FirebaseObjectObservable<any>;
  newURL: string;
  newTitle: string;
  newBody: string;
  newPublished: boolean;
  currentUser: any;

  constructor(public db: AngularFireDatabase, public snackBar: MdSnackBar, public globalService: GlobalService, public route: ActivatedRoute) {
    this.newPublished = false;
    this.pages = db.list('/pages');
    this.globalService.user.subscribe(user => {
      this.currentUser = user;
    });
  }

  addPage(newURL: string, newTitle: string, newBody: string, newPublished: boolean) {
    if (newURL && newTitle && newBody && this.currentUser.uid) {
      this.pages.push({
        url: newURL,
        dateAdded: Date.now(),
        title: newTitle,
        body: newBody,
        published: newPublished,
        postedBy: this.currentUser.uid
      });

      this.newURL = null;
      this.newTitle = null;
      this.newBody = null;
      this.newPublished = false;

      let snackBarRef = this.snackBar.open('Page saved', 'OK!', {
        duration: 3000
      });
    }
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
        if (params && params.key) {
          this.db.object('/pages/' + params.key).subscribe(p => {
            this.newURL = p.url;
            this.newTitle = p.title;
            this.newBody = p.body;
            this.newPublished = p.published;
          });
        }
    });
  }

}

