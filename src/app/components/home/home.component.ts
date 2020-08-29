import { Component, OnInit } from '@angular/core';
import { DataServicesService } from 'src/app/services/data-services.service';
import { GlobalDataSummary } from 'src/app/model/global-data';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConformed = 0;
  totalActive = 0;
  totalDeathes = 0;
  totalRecoverd = 0;
  globalData: GlobalDataSummary[];
  database = [];
  chart = {
    PieChart: "PieChart",
    ColumnChart: "ColumnChart",
    height: 500,
    widthp: 750,
    width: 500,
    options: {
      animation: {
        duration: 1000,
        easing: 'out',
      },
    }
  }


  constructor(private dataservices: DataServicesService) { }

  initChart() {

    // this.database.push(["country", "cases"])
    this.globalData.forEach(cs => {
      if (cs.conformed > 60000)
        this.database.push([
          cs.country, cs.conformed
        ])
    })
    console.log(this.database)


  }
  ngOnInit(): void {

    this.dataservices.getGlobalData()
      .subscribe({
        next: (result => {
          console.log(result);
          this.globalData = result;
          result.forEach(cs => {
            if (!Number.isNaN(cs.conformed)) {
              this.totalActive += cs.active
              this.totalConformed += cs.conformed
              this.totalDeathes += cs.death
              this.totalRecoverd += cs.recoverd
            }
          })
          this.initChart();
        })
      });

  }

}
