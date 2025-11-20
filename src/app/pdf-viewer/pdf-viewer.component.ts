import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import {
  NgxExtendedPdfViewerModule,
  NgxExtendedPdfViewerService,
  PDFNotificationService,
} from 'ngx-extended-pdf-viewer';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [NgxExtendedPdfViewerModule, CommonModule, HttpClientModule],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.css',
  providers: [NgxExtendedPdfViewerService, PDFNotificationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfViewerComponent {
  pdfSrc: string = '/pdfs/Form 8300.pdf';
  isExporting = false;
  exportSuccess = false;
  exportError = false;

  private pdfViewerService = inject(NgxExtendedPdfViewerService);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  public blob: Blob | undefined;

  public async export(): Promise<void> {
    if (this.isExporting) {
      return;
    }

    this.isExporting = true;

    this.blob = await this.pdfViewerService.getCurrentDocumentAsBlob();
    if (this.blob) {
      const formData = new FormData();
      formData.append('file', this.blob, 'document.pdf');

      this.http
        .post('http://localhost:8000/api/v1/pdf/create', formData)
        .pipe(
          finalize(() => {
            this.isExporting = false;
            this.cdr.markForCheck();
          })
        )
        .subscribe({
          next: (data) => {
            console.log(data, 'success');
          },
          error: () => {
            console.log('error');
          },
        });
    } else {
      this.isExporting = false;
    }
  }
}
