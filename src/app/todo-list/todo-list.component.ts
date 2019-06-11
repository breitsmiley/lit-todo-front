import { Component, OnInit } from '@angular/core';


interface ITask {
  name: string;
  date: Date;
  color: string;
  project: string;
  projectColor: string;
}

const Tasks: ITask[] = [
  {
    name: 'Jogging',
    date: new Date(),
    color: 'red',
    project: 'Home',
    projectColor: 'black'
  },{
    name: 'Send email',
    date: new Date(),
    color: 'green',
    project: 'Work',
    projectColor: 'red'
  },{
    name: 'Buy Guitar',
    date: new Date(), 
    color: 'black',
    project: 'Music',
    projectColor: 'blue'
  },
];


interface IProject {
  name: string;
  color: string;
  total: number;
}

const PROJECTS: IProject[] = [
  {
    name: 'Work',
    color: 'red',
    total: 2,
  },{
    name: 'Home',
    color: 'black',
    total: 7,
  },{
    name: 'Music',
    color: 'blue',
    total: 0,
  },{
    name: 'Other',
    color: 'green',
    total: 34,
  },
];

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  todayDate = new Date();
  isShowSidebarMenu = false;


  tasks = Tasks;
  projects = PROJECTS;

  constructor() { }

  ngOnInit() {
  }

  onSidebarMenu() {
    this.isShowSidebarMenu = !this.isShowSidebarMenu;
  }

}
