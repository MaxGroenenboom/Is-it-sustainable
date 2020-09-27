import {Component, Input, OnInit} from '@angular/core';
import {OrganizationDto} from '../../dto/organizationDto';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {OrganizationApi} from '../../api/organizationApi';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Globals } from '../../globals';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.css']
})
export class OrganizationListComponent implements OnInit {
  title = 'IsItSustainable';
  panelOpenState: boolean;

  @Input()
  orgs: OrganizationDto[];

  init = true;
  org: OrganizationDto;
  orgForm: FormGroup;

  constructor(private organizationService: OrganizationApi, private router: Router, private globals: Globals) {
    organizationService.getOrganizations().subscribe(
      (event) => {
        this.orgs = [];

        for (let i = 0; i < event.length; i++) {
          const e = event[i];
          // @ts-ignore
          this.orgs[i] = new OrganizationDto(e.id, e.name, e.website, e.partnerIds);
        }
      }
    );
  }

  ngOnInit(): void {
    this.org = new OrganizationDto(null, null, null, null);

    this.orgForm = new FormGroup({
      name: new FormControl(this.org.name, [
        Validators.required,
        Validators.minLength(1)
      ]),
      website: new FormControl(this.org.website, [
        Validators.required,
        Validators.minLength(1)
      ])
    });
  }

  get name() { return this.orgForm.get('name'); }
  get website() { return this.orgForm.get('website'); }

  submitForm(): void {
    this.init = false;
    this.org.name = this.name.value;
    this.org.website = this.website.value;
    this.organizationService.addOrganization(this.org).subscribe(event => {
      console.log(event);
    });
  }

  isChecked(): boolean {
    console.log(this.globals);
    return this.globals.checked.getValue();
  }
}
