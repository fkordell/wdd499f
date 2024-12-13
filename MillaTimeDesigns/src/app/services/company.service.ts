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
        description: 'Welcome to MillaTime Designs, where creativity meets craftsmanship! We specialize in creating unique, handmade goods that bring warmth and personality to your space. From intricate laser-cut and engraved designs to other lovingly crafted creations, every piece we produce is made with care and attention to detail. Our mission is to provide high-quality, personalized items that celebrate lifes moments, big and small. Whether you are looking for custom gifts, décor, or something special for yourself, MillaTime Designs has something for everyone. At MillaTime Designs, we take pride in using sustainable materials and innovative techniques to create beautiful, functional, and timeless pieces. Explore our collection today and discover the perfect addition to your home or the ideal gift for someone you care about. Let us help you make memories that last a lifetime!'
    }

    constructor() {};

    getCompanyContact(): CompanyContact {
        return this.companyContact
    }
}