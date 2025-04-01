import { Component, OnInit } from '@angular/core';
import NutrientViewer from '@nutrient-sdk/viewer';

@Component({
  selector: 'pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  standalone: true,
})
export class PdfViewerComponent implements OnInit {
  ngOnInit(): void {
    NutrientViewer.load({
      // Use the assets directory URL as a base URL. Nutrient will download its library assets from here.
      baseUrl: `${location.protocol}//${location.host}/assets/`,
      document: "/assets/document.pdf",
      container: "#pspdfkit-container",
    }).then(instance => {
      // For the sake of this demo, store the Nutrient for Web instance
      // on the global object so that you can open the dev tools and
      // play with the Nutrient API.
      (window as any).instance = instance;
    });
  }
}