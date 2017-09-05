import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  posts: FirebaseListObservable<any[]>;
  searchTerm: string;

  constructor(
    public db: AngularFireDatabase,
    public globalService: GlobalService
  ) {
    this.posts = db.list('/posts', {
      query: {
        orderByChild: 'published',
        equalTo: true,
        limitToLast: 20,
      }
    });

    this.globalService.searchTerm.subscribe((term) => {
      this.searchTerm = term;
    });
  }

  getPostImage(post:any) {
    if (post.thumbnail) {
      return post.thumbnail;
    } else {
      return '../../assets/placeholder.jpg';
    }
  }

  ngOnInit() {
  }
}
