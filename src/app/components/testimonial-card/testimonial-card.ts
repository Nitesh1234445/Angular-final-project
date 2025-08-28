import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonial-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonial-card.html',
  styleUrls: ['./testimonial-card.scss']
})
export class TestimonialCardComponent {
  @Input() item: any;
}
