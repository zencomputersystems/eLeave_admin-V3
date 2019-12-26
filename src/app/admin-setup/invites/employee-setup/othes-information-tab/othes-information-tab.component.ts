import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';

/**
 * others information in add contact, family info, education & certification
 * @export
 * @class OthesInformationTabComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-othes-information-tab',
  templateUrl: './othes-information-tab.component.html',
  styleUrls: ['./othes-information-tab.component.scss']
})
export class OthesInformationTabComponent implements OnInit {

  /**
   * details from selected user
   * @type {*}
   * @memberof OthesInformationTabComponent
   */
  @Input() details: any;

  /**
   * value of toggle mode ON/OFF
   * @type {string}
   * @memberof OthesInformationTabComponent
   */
  @Input() mode: string;

  /**
   * emit changed details 
   * @memberof OthesInformationTabComponent
   */
  @Output() personal = new EventEmitter();

  /**
   * emergency contact items
   * @type {*}
   * @memberof OthesInformationTabComponent
   */
  public removeItems: any = [];

  /**
   * family info - spouse items
   * @type {*}
   * @memberof OthesInformationTabComponent
   */
  public spouseItems: any = [];

  /**
   * family info - child items
   * @type {*}
   * @memberof OthesInformationTabComponent
   */
  public childItems: any = [];

  /**
   * educations info
   * @type {*}
   * @memberof OthesInformationTabComponent
   */
  public eduList: any = [];

  /**
   * certification & awards items
   * @type {*}
   * @memberof OthesInformationTabComponent
   */
  public awards: any = [];

  /**
     * Object format of emergency contact
     * @memberof OthesInformationTabComponent
     */
  public contactObj = { contactName: '', contactRelationship: '', contactNumber: '' };

  /**
   * Object format of spouse details
   * @memberof OthesInformationTabComponent
   */
  public spouseObj = { spouseName: '', spouseIdentificationNumber: '' };

  /**
   * Object format of child details
   * @memberof OthesInformationTabComponent
   */
  public childObj = { childName: '', childIdentificationNumber: '' };

  /**
   * Object format of education details
   * @memberof OthesInformationTabComponent
   */
  public educationObj = { qualificationLevel: '', major: '', university: '', year: '' };

  /**
   * object of form field awards
   * @memberof OthesInformationTabComponent
   */
  public awardObj = { certificationName: '', certificationEnrollYear: '', certificationGraduateYear: '', certificationAttachment: '' };

  /**
   *Creates an instance of OthesInformationTabComponent.
   * @param {APIService} apiService
   * @memberof OthesInformationTabComponent
   */
  constructor(private apiService: APIService) { }

  /**
   * inital method to get details
   * @memberof OthesInformationTabComponent
   */
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

  /**
   * get changed value from parent component
   * @param {SimpleChanges} changes
   * @memberof OthesInformationTabComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.mode != undefined) {
      this.mode = changes.mode.currentValue;
      if (changes.mode.previousValue === 'ON' && changes.mode.currentValue === 'OFF') {
        this.personal.emit([this.removeItems,this.spouseItems, this.childItems,this.eduList, this.awards]);
      }
    }
  }

  /**
   * emergency contact items
   * @memberof OthesInformationTabComponent
   */
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

  /**
   * family info of spouse items
   * @memberof OthesInformationTabComponent
   */
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

  /**
   * family info of child items
   * @memberof OthesInformationTabComponent
   */
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

  /**
   * awards & certification items
   * @memberof OthesInformationTabComponent
   */
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

  /**
     * This is method used to create new form
     * @param {*} data
     * @param {Object} item
     * @memberof OthesInformationTabComponent
     */
  addList(data: any, item: Object) {
    if (data !== undefined) {
      data.push(item);
      this.getObject(data, item);
    } else {
      data = [];
      data.push(item);
      this.getObject(data, item);
    }
  }

  /**
   * This method is used to get object format   
   * @param {*} list
   * @param {*} obj
   * @memberof OthesInformationTabComponent
   */
  getObject(list, obj) {
    if (obj === this.contactObj) {
      this.contactObj = { contactName: '', contactRelationship: '', contactNumber: '' };
      this.removeItems = list;
    }
    if (obj === this.spouseObj) {
      this.spouseObj = { spouseName: '', spouseIdentificationNumber: '' };
      this.spouseItems = list;
    }
    if (obj === this.childObj) {
      this.childObj = { childName: '', childIdentificationNumber: '' };
      this.childItems = list;
    }
    if (obj === this.educationObj) {
      this.educationObj = { qualificationLevel: '', major: '', university: '', year: '' };
      this.eduList = list;
    }
    if (obj === this.awardObj) {
      this.awardObj = { certificationName: '', certificationEnrollYear: '', certificationGraduateYear: '', certificationAttachment: '' };
      this.awards = list;
    }
  }

  /**
   * This method is used to delete empty input form field 
   * @param {number} index
   * @param {*} list
   * @memberof OthesInformationTabComponent
   */
  removeItem(index: number, list: any) {
    list.splice(index, 1);
  }

  /**
   * click to download uploaded attachment
   * @param {number} index
   * @memberof OthesInformationTabComponent
   */
  downloadFile(index: number) {
    window.location.href = (this.details.link + this.awards[index].certificationAttachment)
  }

  /**
   * upload attached file to endpoint (api/azure/upload)
   * @param {*} file
   * @memberof OthesInformationTabComponent
   */
  upload(file, i: number) {
    this.awards[i].certificationAttachment = file[0].name;
    const fileToUpload = file.item(0);
    let formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    let res = this.apiService.post_file(formData).subscribe(res => console.log(res));
  }

}


