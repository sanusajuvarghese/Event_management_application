import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/auth-service.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css'],
})
export class BlogDetailComponent implements OnInit {
  constructor(private actRoute: ActivatedRoute, private service: AuthServiceService, private route: Router) {}
  blog;
  blogId;
  show = false;
  imageurl = '';
  resourceTags: any[] = [];
  ngOnInit(): void {
    this.actRoute.params.subscribe((params) => {
      this.blogId = params.page;
      this.getBlogData(params.page);
    });
  }
  getBlogData(id) {
    this.show = true;
    this.service.getResourceById(id).subscribe((res) => {
      this.blog = res.body;
      this.imageurl = this.blog.thumbnailImageUrl;
      this.show = false;
      this.resourceTags = this.blog.resourceTags;
    });
  }
  editBlogRoute() {
    this.route.navigate(['/blog-edit'], { queryParams: { page: this.blogId } });
  }
}
