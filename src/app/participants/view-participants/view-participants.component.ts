import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from 'src/app/auth-service.service';

@Component({
  selector: 'app-view-participants',
  templateUrl: './view-participants.component.html',
  styleUrls: ['./view-participants.component.css'],
})
export class ViewParticipantsComponent implements OnInit {
  participant: any = {};
  constructor(private service: AuthServiceService, private queryString: ActivatedRoute) {}
  event: any = {};
  ngOnInit(): void {
    this.queryString.params.subscribe((params) => {
      this.getParticipantData(params.page);
    });
  }
  getParticipantData(id) {
    this.service.getParticipantById(id).subscribe((res) => {
      this.participant = res.body;
      this.getEventName();
    });
  }
  getEventName() {
    this.service.getEventDetail(this.participant.eventId).subscribe((res) => {
      this.event = res;
    });
  }
}
