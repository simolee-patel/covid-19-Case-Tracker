import { Component, OnInit } from '@angular/core';
import { DataServicesService } from 'src/app/services/data-services.service';
import { GlobalDataSummary } from 'src/app/model/global-data';
import { DateWiseData } from 'src/app/model/date-wise-data'

import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  public data: GlobalDataSummary[];
  countries: string[] = [];

  totalConformed = 0;
  totalActive = 0;
  totalDeathes = 0;
  totalRecoverd = 0;
  loading: false;
  selectedCountryData: DateWiseData[];
  dataTable = [];
  chart = {
    PieChart: "PieChart",
    ColumnChart: "ColumnChart",
    height: 500,
    width: 400,
    options: {
      animation: {
        duration: 1000,
        easing: 'out',
      },
      is3D: true
    }
  }
  dateWiseData;

  constructor(private dataservice: DataServicesService) { }

  ngOnInit(): void {
    merge(
      this.dataservice.getDateWiseData().pipe(
        map(result => {
          this.dateWiseData = result;
        })
      ),
      this.dataservice.getGlobalData().pipe(
        map(result => {
          this.data = <GlobalDataSummary[]>result
          this.data.forEach(cs => {
            this.countries.push(cs.country)
          })
        }))
    ).subscribe(
      {
        complete: () => {
          this.updateValues('India')
          this.loading = false;
        }
      }
    )



  }

  updateChart() {

    // this.dataTable.push(["Date", 'case'])
    this.selectedCountryData.forEach(cs => {
      this.dataTable.push([cs.date, cs.cases])
    })

  }

  updateValues(country: string) {
    console.log(country);
    this.data.forEach(cs => {
      if (cs.country == country) {
        this.totalActive = cs.active;
        this.totalDeathes = cs.death;
        this.totalConformed = cs.conformed;
        this.totalRecoverd = cs.recoverd;
      }
    })
    this.selectedCountryData = this.dateWiseData[country]
    this.updateChart()
  }
}
