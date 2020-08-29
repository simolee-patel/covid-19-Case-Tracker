import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { GlobalDataSummary } from '../model/global-data';
import { DateWiseData } from '../model/date-wise-data';

@Injectable({
  providedIn: 'root'
})
export class DataServicesService {
  private dateWiseUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'
  private baseUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/'

  private globalDataUrl = ''
  private extention = '.csv';
  month
  date;
  year;

  getDate(date: number) {
    if (date < 10) {
      return '0' + date
    }
    return date
  }

  constructor(private http: HttpClient) {
    let now = new Date()
    this.month = now.getMonth() + 1;
    this.year = now.getFullYear();
    this.date = now.getDate();

    console.log(
      {
        date: this.date,
        month: this.month,
        year: this.year
      });

    this.globalDataUrl = `${this.baseUrl}${this.getDate(this.month)}-${this.getDate(this.date)}-${this.year}${this.extention}`;
    console.log(this.globalDataUrl);
  }

  getDateWiseData() {
    return this.http.get(this.dateWiseUrl, { responseType: 'text' })
      .pipe(map(result => {
        let rows = result.split('\n');
        // console.log(rows);
        let mainData = {};
        let header = rows[0];
        let dates = header.split(/,(?=\S)/)
        dates.splice(0, 4);
        rows.splice(0, 1);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/)
          let con = cols[1];
          cols.splice(0, 4);
          // console.log(con , cols);
          mainData[con] = [];
          cols.forEach((value, index) => {
            let dw: DateWiseData = {
              cases: +value,
              country: con,
              date: new Date(Date.parse(dates[index]))

            }
            mainData[con].push(dw)
          })

        })


        // console.log(mainData);
        return mainData;
      }))
  }

  getGlobalData() {
    return this.http.get(this.globalDataUrl, { responseType: 'text' }).pipe(
      map(result => {
        let data: GlobalDataSummary[] = [];
        let raw = {}
        let rows = result.split('\n');
        rows.splice(0, 1);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/)
          let cs = {
            country: cols[3],
            conformed: +cols[7],
            death: +cols[8],
            recoverd: +cols[9],
            active: +cols[10]
          };
          let temp: GlobalDataSummary = raw[cs.country];

          if (temp) {
            temp.active = cs.active + temp.active
            temp.conformed = cs.active + temp.active
            temp.death = cs.death + temp.death
            temp.recoverd = cs.recoverd + temp.recoverd

            raw[cs.country] = temp;
          } else {
            raw[cs.conformed] = cs;
          }
        })

        return <GlobalDataSummary[]>Object.values(raw);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status == 404) {
          this.date = this.date - 1
          this.globalDataUrl = `${this.baseUrl}${this.getDate(this.month)}-${this.getDate(this.date)}-${this.year}${this.extention}`;
          console.log(this.globalDataUrl);
          return this.getGlobalData()

        }
      })
    )
  }
}
