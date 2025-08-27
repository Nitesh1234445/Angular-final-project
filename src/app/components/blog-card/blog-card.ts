import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-card.html',
  styleUrls: ['./blog-card.scss']
})
export class BlogCardComponent {
  @Input() item: any;
}
