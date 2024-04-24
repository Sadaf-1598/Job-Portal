import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { CommonService } from '../../common.services';
import { Router } from '@angular/router';


export interface JobData {
  id: number,
  companyName: string,
  title: string,
  companyLogo: string,
  reference: string,
  isSelectedFavorite: boolean
}

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'all-job-list.component.html',
  styleUrl: 'all-job-list.component.css'
})
export class AllJobListComponent implements OnInit {
  http = inject(HttpClient)
  jobList: JobData[] = [];
  isSelected: boolean = false;

  constructor(private commonservice: CommonService, private router: Router) { }

  ngOnInit(): void {
    if (this.commonservice.selectedJobArray.length != 0) {
      this.jobList = this.commonservice.DuplicateJobList;
    } else {
      this.fetchJobList();
    }
  }

  fetchJobList() {
    this.commonservice.fetchData().subscribe(data => {
      this.jobList = data;
      this.commonservice.DuplicateJobList = this.jobList;
    })
  }

  OptiSelect(job: JobData) {
    const item = this.jobList.filter(x => x.id === job.id);
    if (item[0].isSelectedFavorite) {
      item[0].isSelectedFavorite = false;
    } else {
      item[0].isSelectedFavorite = true;
    }
    this.onJobSelect(job);
  }

  onJobSelect(job: JobData) {
    if (this.commonservice.selectedJobArray.length === 0) {
      this.commonservice.selectedJobArray.push(job);
      this.commonservice.duplicateArray = this.commonservice.selectedJobArray;
      this.commonservice.favoriteJob = this.commonservice.selectedJobArray;
    }
    else {
      for (let i = 0; i < this.commonservice.selectedJobArray.length; i++) {
        if (this.commonservice.selectedJobArray.find(x => x.id === job.id) === undefined) {
          this.commonservice.duplicateArray.push(job);
          break;
        } else {
          this.commonservice.duplicateArray.forEach((item, index) => {
            if (item.id === job.id) {
              this.commonservice.duplicateArray.splice(index, 1);
            }
          });
          break;
        }
      }
      this.commonservice.selectedJobArray = this.commonservice.duplicateArray;
      this.commonservice.favoriteJob = this.commonservice.selectedJobArray;
    }
  }


  jobDetail(selectedJob: JobData) {
    this.commonservice.SelectedJob = selectedJob;
    this.router.navigate(['/jobDetails']);
  }

}

