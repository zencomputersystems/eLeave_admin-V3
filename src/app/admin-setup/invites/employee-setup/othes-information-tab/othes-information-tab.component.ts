import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';

@Component({
  selector: 'app-othes-information-tab',
  templateUrl: './othes-information-tab.component.html',
  styleUrls: ['./othes-information-tab.component.scss']
})
export class OthesInformationTabComponent implements OnInit {

  @Input() details: any;
  @Input() mode: string;
  @Output() personal = new EventEmitter();
  public removeItems: any = [];

  public spouseItems: any = [];

  public childItems: any = [];

  public eduList: any = [];
  public awards: any = [];

  /**
       * file name get from input
       * @private
       * @memberof OthesInformationTabComponent
       */
  private _imagePath: any;

  constructor(private apiService: APIService) { }

  ngOnInit() {
    this.removeItems = []; this.spouseItems = []; this.childItems = []; this.eduList = [];
    this.emergencyContact();
    this.familySpouse();
    this.familyChild();
    this.certification();
    if ((this.details.personalDetail.education instanceof Array) && this.details.personalDetail.education !== undefined) {
      this.eduList = (this.details.personalDetail.education);
    }
    else if (!(this.details.personalDetail.education instanceof Array) && this.details.personalDetail.education !== undefined) {
      this.eduList.push(this.details.personalDetail.education);
    } else {
      this.eduList = this.details.personalDetail.education;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.mode != undefined) {
      this.mode = changes.mode.currentValue;
      if (changes.mode.previousValue === 'ON' && changes.mode.currentValue === 'OFF') {
        this.personal.emit(this.details);
      }
    }
  }

  emergencyContact() {
    if ((this.details.personalDetail.emergencyContact instanceof Array) && this.details.personalDetail.emergencyContact !== undefined) {
      this.removeItems = (this.details.personalDetail.emergencyContact);
    }
    else if (!(this.details.personalDetail.emergencyContact instanceof Array) && this.details.personalDetail.emergencyContact !== undefined) {
      this.removeItems.push(this.details.personalDetail.emergencyContact);
    }
    else {
      this.removeItems = this.details.personalDetail.emergencyContact;
    }
  }

  familySpouse() {
    if ((this.details.personalDetail.family.spouse instanceof Array) && this.details.personalDetail.family.spouse !== undefined) {
      this.spouseItems = (this.details.personalDetail.family.spouse);
    }
    else if (!(this.details.personalDetail.family.spouse instanceof Array) && this.details.personalDetail.family.spouse !== undefined) {
      this.spouseItems.push(this.details.personalDetail.family.spouse);
    } else {
      this.spouseItems = this.details.personalDetail.family.spouse;
    }
  }

  familyChild() {
    if ((this.details.personalDetail.family.child instanceof Array) && this.details.personalDetail.family.child !== undefined) {
      this.childItems = (this.details.personalDetail.family.child);
    }
    else if (!(this.details.personalDetail.family.child instanceof Array) && this.details.personalDetail.family.child !== undefined) {
      this.childItems.push(this.details.personalDetail.family.child);
    } else {
      this.childItems = this.details.personalDetail.family.child;
    }
  }

  certification() {
    const award = this.details.personalDetail.certification;
    if (award != undefined) {
      if (award instanceof Array) {
        this.awards = award;
      } else {
        this.awards.push(award);
      }
    } else {
      this.awards = [];
    }
  }

  downloadFile(index: number) {
    window.location.href = (this.details.link + this.awards[index].certificationAttachment)
  }

  /**
     * get details of file after upload from local file
     * @param {*} files
     * @param {number} i
     * @returns
     * @memberof OthesInformationTabComponent
     */
  preview(files: any, i: number) {
    if (files.length === 0)
      return;
    const mimeType = files[0].type;
    this.awards[i].certificationAttachment = files[0].name;
    if (mimeType.match(/image\/*/) == null) {
      // this.showPdf = true;
      // this.showAttach = false;
      const reader = new FileReader();
      this._imagePath = files;
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        // this.imgURL = reader.result;
      }
      return;
    }
    this.readFile(files);
  }

  a(file) {
    const fileToUpload = file.item(0);
    let formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    let res = this.apiService.post_file(formData).subscribe(res => console.log(res));
  }

  /**
   * read file of attachment
   * @param {*} files
   * @memberof OthesInformationTabComponent
   */
  readFile(files) {
    // this.showImg = true;
    // this.showAttach = false;
    const reader = new FileReader();
    this._imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      // this.imgURL = reader.result;
    }
  }

}


