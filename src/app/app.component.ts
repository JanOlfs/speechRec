import { ChangeDetectorRef, Component } from '@angular/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'speechRec';
  recording = false;
  text = '';
  processing = false; // New flag to prevent multiple triggers

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    SpeechRecognition.requestPermissions();
  }

  async startListening() {
    this.recording = true;
    this.changeDetectorRef.detectChanges();
    this.processing = false; // Reset flag each time listening starts
    const { available } = await SpeechRecognition.available();

    if (available) {
      // Remove any existing 'partialResults' listener before adding a new one
      await SpeechRecognition.removeAllListeners();

      SpeechRecognition.start({
        popup: false,
        partialResults: true,
        language: 'de-DE'
      });

      SpeechRecognition.addListener('partialResults', (data: any) => {
        if (!this.processing && data.matches && data.matches.length > 0) {
          this.text = data.matches[0];
          this.processTextForHelp(this.text);
          this.changeDetectorRef.detectChanges();
        }
      });
    }
  }

  async stopListening() {
    this.recording = false;
    await SpeechRecognition.stop();
    await SpeechRecognition.removeAllListeners(); // Clean up listeners when stopping
  }

  processTextForHelp(heardText: string) {
    // Convert text to lowercase for case-insensitive matching
    heardText = heardText.toLowerCase();
    this.processing = true; // Set processing flag to true to avoid duplicate triggers

    if (heardText.includes('hilfe') || heardText.includes('unterstützung')) {
      this.provideGeneralHelp();
    } else if (heardText.includes('anleitung') || heardText.includes('schritte')) {
      this.provideStepByStepInstructions();
    } else if (heardText.includes('kontakt') || heardText.includes('hotline')) {
      this.provideContactInformation();
    } else if (heardText.includes('abbrechen')) {
      this.stopListening();
      alert("Der Vorgang wurde abgebrochen.");
      this.processing = false; // Reset flag after stop
    } else {
      this.stopListening();
      console.log('Kein passender Hilfebefehl erkannt.');
      this.processing = false; // Reset flag if no match
    }
  }

  provideGeneralHelp() {
    alert("Allgemeine Hilfe: Sie können nach Anleitungen, Kontaktdaten oder spezifischen Hilfeschritten fragen.");
    this.stopListening();
  }

  provideStepByStepInstructions() {
    alert("Schritt-für-Schritt-Anleitung:\n1. Schritt eins\n2. Schritt zwei\n3. Schritt drei");
    this.stopListening();
  }

  provideContactInformation() {
    alert("Kontaktinformationen:\nHotline: 123-456-7890\nEmail: support@beispiel.de");
    this.stopListening();
  }
}
