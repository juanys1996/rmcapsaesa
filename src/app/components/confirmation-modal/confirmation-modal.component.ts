import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {
  @Input() modal: any;
  @Input() tittle: string;
  @Input() message: string;
  @Input() hasComment = false;
  @Input() hasOptions = false;
  @Input() isCommentObligatory = false;
  @Input() optionLabel: string;
  @Input() options: { label: string, value: any }[];
  @Output() accept: EventEmitter<{ comment: string, option: any }> = new EventEmitter<{ comment: string, option: any }>();
  errors = {
    comment: false,
    option: false
  }
  comment = '';
  option = null;

  constructor() { }

  ngOnInit() {
  }

  changeOption(value: any): void {
    this.option = value;
  }

  changeComment(comment: string): void {
    this.comment = comment;
  }

  onAccept(): void {


    if (this.isCommentObligatory) {
      if (this.comment != "" && (this.option.value != "-1")) {
        this.errors.comment = false;
        this.errors.option = false;
        this.accept.emit({ comment: this.comment, option: this.option });
        this.modal.dismiss('Accept');
      } else {
        this.errors.comment = true;
        this.errors.option = true;
      }
    }
    else if (!this.isCommentObligatory) {
      this.accept.emit({ comment: this.comment, option: this.option });
      this.modal.dismiss('Accept');
    }

  }
}
