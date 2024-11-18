import { Injectable } from '@angular/core';
import { CompanyContact } from '../models/company-contact.model';

@Injectable({
    providedIn: 'root',
  })

export class CompanyContactService {
    private companyContact: CompanyContact = {
        name: 'MillaTime Designs',
        email: 'contact@millatime.com',
        phone: '123-456-7890',
        address: '123 Main St, Anytown, Country',
        description: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Enim odio mattis turpis velit felis viverra. Senectus purus nec nisi vestibulum in. Erat sed erat tincidunt facilisi a scelerisque odio. Ac ex ligula turpis elementum erat maximus eros. Et malesuada porttitor senectus lectus ligula nibh. Feugiat egestas bibendum tincidunt mattis aenean. Magnis fames commodo penatibus molestie arcu feugiat nisi. Parturient condimentum sed condimentum; curabitur tristique non maecenas cursus.Dictumst rutrum lobortis dignissim vulputate; semper facilisi porttitor in. Posuere sem mattis; platea efficitur dictumst massa metus. Est dui nullam tristique tortor eget eleifend. Porttitor bibendum rhoncus tristique auctor magnis nisl ridiculus habitasse. Taciti sollicitudin efficitur; natoque tempus arcu condimentum montes magnis. Augue euismod adipiscing adipiscing nibh viverra risus tellus quisque orci. Turpis quisque condimentum dolor aenean, nec suspendisse sagittis viverra. Facilisis senectus vel ligula bibendum ullamcorper senectus interdum viverra mattis. Magna primis sit interdum condimentum, donec ultrices vitae. Lorem ipsum odor amet, consectetuer adipiscing elit. Enim odio mattis turpis velit felis viverra. Senectus purus nec nisi vestibulum in. Erat sed erat tincidunt facilisi a scelerisque odio. Ac ex ligula turpis elementum erat maximus eros. Et malesuada porttitor senectus lectus ligula nibh. Feugiat egestas bibendum tincidunt mattis aenean. Magnis fames commodo penatibus molestie arcu feugiat nisi. Parturient condimentum sed condimentum; curabitur tristique non maecenas cursus. Dictumst rutrum lobortis dignissim vulputate; semper facilisi porttitor in. Posuere sem mattis; platea efficitur dictumst massa metus. Est dui nullam tristique tortor eget eleifend. Porttitor bibendum rhoncus tristique auctor magnis nisl ridiculus habitasse. Taciti sollicitudin efficitur; natoque tempus arcu condimentum montes magnis. Augue euismod adipiscing adipiscing nibh viverra risus tellus quisque orci. Turpis quisque condimentum dolor aenean, nec suspendisse sagittis viverra. Facilisis senectus vel ligula bibendum ullamcorper senectus interdum viverra mattis. Magna primis sit interdum condimentum, donec ultrices vitae.'
    }

    constructor() {};

    getCompanyContact(): CompanyContact {
        return this.companyContact
    }
}