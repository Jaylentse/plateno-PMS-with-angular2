import { LoadingService } from '../loading.service/loading.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: [ './loading.component.scss' ]
})
export class LoadingComponent implements OnInit {

  public loading = false;

  constructor(
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.loadingService.loadingListener.subscribe(isLoading => {
      this.loading = isLoading;
    });
  }

}
