import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators"
import {Observable} from "rxjs";
import * as moment from "moment";

export interface Task{
  id?: number
  title: string
  date?: string
}

interface CreateResponse{
  name: string
}
@Injectable({
  providedIn: 'root'
})

export class TasksService{
  static url = 'https://angular-organizer-5d9b8-default-rtdb.europe-west1.firebasedatabase.app/'

  constructor(private http: HttpClient) {
  }

  load(date: moment.Moment): Observable<Task[]> {
    return this.http.get<Task[]>(`${TasksService.url}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map( tasks =>{
         if(!tasks){
           return []
         } else{
           return Object.keys(tasks).map(key=>({
             ...tasks[key], id: key}))
         }
      }))
  }

  create(task: Task): Observable<any>{
    return this.http
      .post<CreateResponse>(`${TasksService.url}/${task.date}.json`, task)
      .pipe(map( res => {
        return {...task, id: res.name}
      }))
  }

  remove(task: Task): Observable<void>{
    return this.http.delete<void>(`${TasksService.url}/${task.date}/${task.id}.json`)
  }
}
