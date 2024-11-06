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

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    SpeechRecognition.requestPermissions();
  }

  async startListening() {
    this.recording = true;
    const { available } = await SpeechRecognition.available();
    if (available) {
      SpeechRecognition.start({
        popup: false,
        partialResults: true,
        language: 'de-DE'
      });
      SpeechRecognition.addListener('partialResults', (data: any) => {
        if (data.matches && data.matches.length > 0) {
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
  }

  /**
   * Diese Funktion prüft das erkannte Wort und führt passende Hilfestellungen durch.
   * @param heardText Der erkannte Text vom Sprachmodul.
   */
  processTextForHelp(heardText: string) {
    heardText = heardText.toLowerCase(); // alles in Kleinbuchstaben, um Abgleich zu vereinfachen

    if (heardText.includes('hilfe') || heardText.includes('unterstützung')) {
      this.provideGeneralHelp();
    } else if (heardText.includes('anleitung') || heardText.includes('schritte')) {
      this.provideStepByStepInstructions();
    } else if (heardText.includes('kontakt') || heardText.includes('hotline')) {
      this.provideContactInformation();
    } else if (heardText.includes('abbrechen')) {
      this.stopListening();
      alert("Der Vorgang wurde abgebrochen.");
    } else {
      console.log('Kein passender Hilfebefehl erkannt.');
    }
  }

  /**
   * Zeigt allgemeine Hilfe an.
   */
  provideGeneralHelp() {
    alert("Allgemeine Hilfe: Sie können nach Anleitungen, Kontaktdaten oder spezifischen Hilfeschritten fragen.");
  }

  /**
   * Zeigt eine Schritt-für-Schritt-Anleitung an.
   */
  provideStepByStepInstructions() {
    alert("Schritt-für-Schritt-Anleitung:\n1. Schritt eins\n2. Schritt zwei\n3. Schritt drei");
  }

  /**
   * Zeigt Kontaktinformationen an.
   */
  provideContactInformation() {
    alert("Kontaktinformationen:\nHotline: 123-456-7890\nEmail: support@beispiel.de");
  }
}
