import { Component, OnInit,ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';
import { CapacitacionService } from 'src/app/services/capacitacion.service';
import { EventYearService } from 'src/app/services/event-year.service';
import { EventYearCalendarService } from 'src/app/services/event-yearCalendar.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

//Borrar en caso de error
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, } from 'angular-calendar';


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  green: {
    primary: '#25e308',
    secondary: '#c7fdba',
  },
};
@Component({
  selector: 'app-calendar-view',
  changeDetection: ChangeDetectionStrategy.Default,
  styles: [
    `
      h3 {
        margin: 0 0 10px;
      }

      pre {
        background-color: #f5f5f5;
        padding: 15px;
      }
    `,
  ],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  locale: string = 'es';
  calendario : CalendarEvent[] = [];
		rolid: any = sessionStorage.getItem('rolid');
		refresh = new Subject<void>();
  events: CalendarEvent[];
  activeDayIsOpen: boolean = false;

  constructor(private navigationService: NavigationService,
    private capacitacionService: CapacitacionService,
    private eventYearCalendarService: EventYearCalendarService,
    private eventEmitterService: EventEmitterService,
    private modal: NgbModal) { }

  ngOnInit() {  
    this.getCapacitacionesCalendario();
  }

  getCapacitacionesCalendario(): void {
    this.capacitacionService.getCapacitacionesCalendario(parseInt(sessionStorage.getItem('userid')), parseInt(sessionStorage.getItem('rolid')))
      .then(response => {
        for(let o of response){
						let titulo = "";
						if(this.rolid == 1 || this.rolid == 2){
              titulo = "Capacitación : "+ o.name + "(Plan Asociado : "  + o.planCapacitacion+") Estado : "+ o.stateShortDescription ;
						}else{
              titulo = "Capacitación : "+ o.name+ " Estado : "+ o.stateShortDescription;
						}
            let fecha = o.fecha.split("-");
            let currentTime = new Date()
            let month = currentTime.getMonth() + 1
            let year = currentTime.getFullYear()
            let fechaActual = new Date(year, month);
            let fechaCapacitacion = new Date(fecha[2], fecha[1]);

            let estado = 0;
            if((o.stateId == 5 || o.stateId == 7 || o.stateId == 8) || (o.stateId == 1 && fechaCapacitacion > fechaActual)){
              estado = 1
            }else if(o.stateId == 1 && (year == fecha[2] && month == fecha[1])){
              estado = 2
            }else if(o.stateId == 1 && (fechaCapacitacion < fechaActual)){
              estado = 3
            } 

          let array : any = {
            
            start: startOfDay(new Date(fecha[2], fecha[1] - 1, fecha[0])),
            title: titulo,
            color: estado == 1 ? colors.green : estado == 2 ? colors.yellow : colors.red
          }
          this.calendario.push(array);
				}
					this.events = this.calendario;
			})
      .catch(error => {
        error = true;
      });
  }

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  
}
