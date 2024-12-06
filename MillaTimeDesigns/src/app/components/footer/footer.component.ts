import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [RouterModule, MatIconModule],
    templateUrl: './footer.component.html',
})
export class FooterComponent {
    currentYear: number = new Date().getFullYear();
}