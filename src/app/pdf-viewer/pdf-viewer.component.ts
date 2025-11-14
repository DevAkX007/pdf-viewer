import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NgxExtendedPdfViewerModule,
  NgxExtendedPdfViewerService,
  PDFNotificationService,
} from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [NgxExtendedPdfViewerModule],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.css',
  providers: [NgxExtendedPdfViewerService, PDFNotificationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfViewerComponent {
  pdfSrc: string = '/pdfs/Form 8300.pdf';
  constructor(private pdfViewerService: NgxExtendedPdfViewerService) {}

  public blob: Blob | undefined;

  public async export(): Promise<void> {
    this.blob = await this.pdfViewerService.getCurrentDocumentAsBlob();
  }
}
