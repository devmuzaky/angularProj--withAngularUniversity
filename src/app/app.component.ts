import {Component, Inject, Injectable, InjectionToken, Injector, OnInit, ViewChild} from '@angular/core';
import {Course} from './model/course';
import {AppConfig, CONFIG_TOKEN} from './config';
import {CoursesService} from './courses/courses.service';
import {createCustomElement} from '@angular/elements';
import {CourseTitleComponent} from './course-title/course-title.component';
import {HighlightedDirective} from "./courses/directives/highlighted.directive";
import {CourseCardComponent} from "./courses/course-card/course-card.component";
import {HttpClient} from "@angular/common/http";
import {EMPTY, Observable} from "rxjs";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  courses$: Observable<Course[]> = EMPTY;

  courses: any;

  @ViewChild(CourseCardComponent, {read: HighlightedDirective})
  highlighted!: HighlightedDirective;

  constructor(
    private http: HttpClient,
    private coursesService: CoursesService,
    @Inject(CONFIG_TOKEN) private config: AppConfig,
    private injector: Injector) {

  }

  ngOnInit() {
    this.courses$ = this.coursesService.loadCourses();
    const htmlElement = createCustomElement(CourseTitleComponent, {injector: this.injector});
    customElements.define('course-title', htmlElement);

  }

  ngAfterViewInit() {
  }

  onEditCourse() {
    this.courses[1].category = 'ADVANCED';
  }


  save(course: Course) {
    this.coursesService.saveCourse(course)
      .subscribe(
        () => console.log('Course Saved!')
      );
  }

  onToggleHighlight($event: boolean) {
    console.log('Highlighted: ', $event);
  }
}


/* TODO: Factor function for the CourseService
// Dependency Injection services system is a tree of injectors
// that are responsible for creating instances of services.
TODO: https://angular.io/guide/dependency-injection-in-action
function courseServiceProvideFactory(http: HttpClient): CoursesService {
  return new CoursesService(http);
}

const COURSE_SERVICE = new InjectionToken<CoursesService>('COURSE_SERVICE');


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // providers: [
  //   {
  //     provide: COURSE_SERVICE,
  //     useFactory: courseServiceProvideFactory,
  //     deps: [HttpClient]
  //   }]
})

and in the constructor:
constructor(
    private http: HttpClient,
    @Inject(COURSE_SERVICE) private coursesService: CoursesService,
    @Inject(CONFIG_TOKEN) private config: AppConfig) {
}
* */
